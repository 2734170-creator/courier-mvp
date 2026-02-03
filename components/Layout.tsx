
import React from 'react';
// @ts-ignore - Fixing "Module 'react-router-dom' has no exported member" errors
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Package, MessageSquare, Bell } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { OrderStatus } from '../types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, notification, setNotification } = useApp();

  const assignedCount = orders.filter(o => [OrderStatus.ASSEMBLY, OrderStatus.READY, OrderStatus.TRANSFERRED_TO_COURIER].includes(o.status)).length;

  const navItems = [
    { label: 'Поддержка', path: '/support', icon: MessageSquare },
    { label: 'Доставки', path: '/deliveries', icon: Package, badge: assignedCount },
    { label: 'Профиль', path: '/profile', icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gray-50 shadow-xl overflow-hidden relative">
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 animate-in slide-in-from-top duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-start gap-3 border-l-4 border-brand">
            <div className="bg-brand-light p-2 rounded-full"><Bell className="w-5 h-5 text-brand" /></div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-gray-800">Уведомление</h4>
              <p className="text-xs text-gray-600 leading-tight">{notification}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-gray-300 hover:text-gray-600 text-xl font-light">×</button>
          </div>
        </div>
      )}
      <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      <nav className="fixed bottom-0 w-full max-w-md bg-white/80 backdrop-blur-md border-t border-gray-100 safe-bottom z-40">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button key={item.path} onClick={() => navigate(item.path)} className={`flex flex-col items-center gap-1.5 transition-all duration-200 px-4 ${isActive ? 'text-brand scale-105' : 'text-gray-400 opacity-70 hover:opacity-100'}`}>
                <div className="relative">
                  <item.icon className={`w-6 h-6 ${isActive ? 'fill-brand/10' : ''}`} />
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-brand text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center border-2 border-white shadow-sm">{item.badge}</span>
                  )}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-80'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
