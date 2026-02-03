
import React from 'react';
// @ts-ignore - Fixing "Module 'react-router-dom' has no exported member" errors
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Navigation, CheckCircle2, XCircle, Info, MapPinned, MessageSquare, Clock } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { OrderStatus } from '../types';

const OrderDetailsScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, finishOrder } = useApp();
  const order = orders.find(o => o.id === id);

  if (!order) return <div className="p-10 text-center font-bold">Заказ не найден</div>;

  const isDelivering = order.status === OrderStatus.TRANSFERRED_TO_COURIER;
  const isAssembling = order.status === OrderStatus.ASSEMBLY;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getStatusStyle = (status: string) => {
    if (status === OrderStatus.DELIVERED) return 'bg-green-500 text-gray-200';
    if (status === OrderStatus.CANCELLED) return 'bg-yellow-400 text-gray-200';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-10 px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-800" />
            </button>
            <div>
              <h1 className="font-black text-gray-800 uppercase tracking-tighter text-lg leading-none">#{order.id}</h1>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 inline-block ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
            </div>
        </div>
        <div className="flex flex-col items-end">
           <div className={`text-lg font-black font-mono ${order.deliveryTimeLeft < 180 ? 'text-red-500' : 'text-gray-800'}`}>
              {formatTime(order.deliveryTimeLeft)}
           </div>
           <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">SLA</span>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Address Card (Updated to match screenshot) */}
        <div className="bg-gray-50/50 rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
           <div className="flex gap-5 mb-6">
              <div className="bg-[#FFF1F4] p-4 rounded-2xl h-fit">
                <MapPinned className="w-7 h-7 text-brand" />
              </div>
              <div className="flex-1">
                <h3 className="text-[11px] font-black text-brand uppercase tracking-widest mb-1">Адрес доставки</h3>
                <p className="text-[22px] font-black text-gray-800 leading-[1.1]">{order.address}</p>
                
                <div className="mt-5 flex flex-col">
                    <span className="text-[11px] font-black text-[#A0AFC7] uppercase tracking-widest mb-1">Этаж</span>
                    <span className="text-[22px] font-black text-gray-800">{order.floor}</span>
                </div>
              </div>
           </div>

           <h3 className="text-[11px] font-black text-[#A0AFC7] uppercase tracking-widest mb-3 px-1">Комментарий клиента</h3>
           <div className="bg-white rounded-[1.5rem] p-5 flex gap-4 border border-gray-100/50 shadow-sm">
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-3.5 h-3.5 text-gray-300" />
              </div>
              <p className="text-[15px] font-medium text-gray-600 leading-snug">{order.comment}</p>
           </div>
        </div>

        {/* Quick Actions */}
        {isDelivering && (
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gray-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
              <Navigation className="w-5 h-5 text-brand" /> 
              <span className="text-sm uppercase tracking-tighter">Навигатор</span>
            </button>
            <button className="bg-gray-100 text-gray-800 font-black py-5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
              <Phone className="w-5 h-5 text-gray-400" /> 
              <span className="text-sm uppercase tracking-tighter">Позвонить</span>
            </button>
          </div>
        )}

        {/* Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Состав заказа</h3>
            <span className="text-xs font-black text-gray-800">{order.items.length} поз.</span>
          </div>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex justify-between items-center shadow-sm">
                <span className="text-sm font-bold text-gray-700">{item.name}</span>
                <span className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl text-xs font-black text-gray-800">x{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Action */}
        {isDelivering && (
          <div className="pt-4 space-y-4">
            <button 
              onClick={() => { finishOrder(order.id); navigate('/deliveries'); }}
              className="w-full bg-brand text-white font-black py-6 rounded-full shadow-2xl shadow-brand/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              <CheckCircle2 className="w-7 h-7" />
              <span className="text-xl uppercase tracking-tighter">Завершить заказ</span>
            </button>
            <button 
              onClick={() => navigate(`/order/${order.id}/cancel`)}
              className="w-full bg-white border-2 border-gray-100 text-gray-400 font-black py-4 rounded-full flex items-center justify-center gap-2 hover:text-red-500 hover:border-red-200 transition-all active:scale-[0.98]"
            >
              <XCircle className="w-5 h-5" /> 
              <span className="text-sm uppercase tracking-widest">Отменить заказ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsScreen;
