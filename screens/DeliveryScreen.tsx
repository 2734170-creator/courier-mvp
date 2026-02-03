import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, ChevronRight, PackageCheck, Package } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Order, OrderStatus, CourierStatus } from '../types';

const DeliveryScreen: React.FC = () => {
  const { orders, courierStatus, acceptOrders, returnToCFZ, returnTimeLeft } = useApp();
  const navigate = useNavigate();

  const orderPriority: Record<string, number> = {
    'ORD-6737': 1,
    'ORD-6742': 2
  };

  const allVisibleOrders = [...orders].sort((a, b) => 
    (orderPriority[a.id] || 99) - (orderPriority[b.id] || 99)
  );

  const isReadyToAccept = orders.some(o => o.status === OrderStatus.READY) && 
                         orders.every(o => o.status !== OrderStatus.ASSEMBLY);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderOrderCard = (order: Order) => {
    const isTerminal = [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status);
    const isCancelled = order.status === OrderStatus.CANCELLED;
    const isDelivered = order.status === OrderStatus.DELIVERED;

    if (isTerminal) {
      const historyBg = isCancelled 
        ? 'bg-[#FFFBEB]/50 border-[#FEF3C7]' 
        : 'bg-[#F0FDF4]/50 border-[#DCFCE7]';
      
      const accentColor = isDelivered ? 'bg-green-500' : 'bg-yellow-500';
      const badgeColor = isDelivered ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white';

      return (
        <div 
          key={order.id} 
          onClick={() => navigate(`/order/${order.id}`)}
          className={`${historyBg} rounded-[1.5rem] p-4 shadow-sm border transition-all active:scale-[0.98] flex justify-between items-center mb-3 cursor-pointer`}
        >
          <div className="flex gap-4 items-center">
            <div className={`w-1.5 h-10 rounded-full ${accentColor}`}></div>
            <div>
              <h4 className="text-[13px] font-bold text-gray-700 leading-tight mb-1">{order.address}</h4>
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${badgeColor}`}>
                  {order.status}
                </span>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-wider">
                  #{order.id}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 opacity-50" />
        </div>
      );
    }

    return (
      <div 
        key={order.id} 
        onClick={() => navigate(`/order/${order.id}`)}
        className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 transition-all active:scale-[0.97] overflow-hidden relative mb-4 cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest inline-flex items-center bg-gray-100 text-gray-500">
              {order.status}
            </span>
            <div className="text-[11px] font-black text-gray-300 mt-2 tracking-widest uppercase">
              #{order.id}
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-black text-lg text-gray-800">
            <Clock className="w-4 h-4 text-gray-400" />
            {formatTime(order.deliveryTimeLeft)}
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-brand-light/50 p-2.5 rounded-xl">
             <MapPin className="w-4 h-4 text-brand" />
          </div>
          <p className="text-sm font-bold text-gray-700 leading-tight">
            {order.address}
          </p>
        </div>
        
        <div className="flex justify-end items-center pt-4 border-t border-gray-50">
           <div className="text-brand font-black text-[11px] uppercase flex items-center gap-0.5 tracking-widest">
             ДЕТАЛИ <ChevronRight className="w-4 h-4" />
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col items-center py-6 text-center">
        <h1 className="text-2xl font-black text-[#1A1C1E] tracking-tight uppercase mb-3">
          Задания на доставку
        </h1>
        
        {courierStatus === CourierStatus.RETURN_TO_CFZ && (
          <div className="flex items-center gap-2 bg-[#FFF1F4] border border-[#FFD6DC] px-5 py-2.5 rounded-full text-brand font-black text-xs uppercase tracking-widest shadow-sm">
            <Clock className="w-4 h-4" />
            <span>Вернись в ЦФЗ: {formatTime(returnTimeLeft)}</span>
          </div>
        )}
      </div>

      {allVisibleOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-brand-light p-5 rounded-3xl mb-6 shadow-inner text-brand">
             <Package className="w-12 h-12" />
          </div>
          <h2 className="font-black text-xl text-brand uppercase tracking-[0.15em] mb-2">Доставки</h2>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Нет заказов в текущей смене</p>
        </div>
      )}

      <div className="space-y-2">
        {allVisibleOrders.map(order => renderOrderCard(order))}
      </div>

      {isReadyToAccept && courierStatus === CourierStatus.DELIVERY_ASSIGNED && (
        <div className="fixed bottom-24 left-0 right-0 px-4 max-w-md mx-auto z-40">
          <button 
            onClick={(e) => { e.stopPropagation(); acceptOrders(); }}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-[2.5rem] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <PackageCheck className="w-7 h-7" />
            <span className="text-xl tracking-tight uppercase">Принять заказ</span>
          </button>
        </div>
      )}

      {courierStatus === CourierStatus.RETURN_TO_CFZ && (
        <div className="fixed bottom-24 left-0 right-0 px-4 max-w-md mx-auto z-40">
           <button 
              onClick={returnToCFZ}
              className="w-full bg-green-500 text-white font-black py-6 rounded-2rem shadow-2xl transition-all active:scale-95 uppercase tracking-tight text-lg"
            >
              Я в ЦФЗ
            </button>
        </div>
      )}
    </div>
  );
};

export default DeliveryScreen;