import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, CourierStatus, CourierProfile, SupportTicket } from '../types';
import { MOCK_ORDERS } from '../constants';

interface AppContextType {
  orders: Order[];
  courierStatus: CourierStatus;
  profile: CourierProfile;
  tickets: SupportTicket[];
  returnTimeLeft: number;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setCourierStatus: (status: CourierStatus) => void;
  addTicket: (ticket: SupportTicket) => void;
  acceptOrders: () => void;
  finishOrder: (id: string) => void;
  cancelOrder: (id: string, reason: string) => void;
  returnToCFZ: () => void;
  notification: string | null;
  setNotification: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [courierStatus, setCourierStatus] = useState<CourierStatus>(CourierStatus.IN_CFZ);
  const [returnTimeLeft, setReturnTimeLeft] = useState<number>(600);
  const [profile] = useState<CourierProfile>({
    name: 'Иван Курьеров',
    photo: 'https://picsum.photos/seed/courier/200/200',
    cfzAddress: 'СПб, Дворцовая пл. д. 1'
  });
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prev => prev.map(order => {
        if ([OrderStatus.ASSEMBLY, OrderStatus.READY, OrderStatus.TRANSFERRED_TO_COURIER].includes(order.status)) {
          const nextDeliveryTime = Math.max(0, order.deliveryTimeLeft - 1);
          let nextStatus = order.status;
          let nextAssemblyTime = order.assemblyTimeLeft;

          if (order.status === OrderStatus.ASSEMBLY) {
            nextAssemblyTime = Math.max(0, order.assemblyTimeLeft - 1);
            if (nextAssemblyTime === 0) {
              nextStatus = OrderStatus.READY;
              setNotification(`Заказ ${order.id} готов к выдаче!`);
            }
          }
          return { ...order, status: nextStatus, assemblyTimeLeft: nextAssemblyTime, deliveryTimeLeft: nextDeliveryTime };
        }
        return order;
      }));

      if (courierStatus === CourierStatus.RETURN_TO_CFZ) {
        setReturnTimeLeft(t => Math.max(0, t - 1));
      }

      setTickets(prev => prev.map(ticket => {
        if (ticket.status === 'На рассмотрении' && Date.now() - ticket.createdAt > 30000) {
          return { ...ticket, status: 'Решено', answer: 'Обращение рассмотрено. Спасибо!' };
        }
        return ticket;
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [courierStatus]);

  useEffect(() => {
    const activeOrders = orders.filter(o => [OrderStatus.ASSEMBLY, OrderStatus.READY].includes(o.status));
    if (activeOrders.length > 0 && courierStatus === CourierStatus.IN_CFZ) {
      setCourierStatus(CourierStatus.DELIVERY_ASSIGNED);
    }
  }, [orders, courierStatus]);

  const checkReturnToCFZ = useCallback(() => {
     setTimeout(() => {
        setOrders(current => {
            const stillActive = current.some(o => [OrderStatus.ASSEMBLY, OrderStatus.READY, OrderStatus.TRANSFERRED_TO_COURIER].includes(o.status));
            if (!stillActive) {
                setCourierStatus(CourierStatus.RETURN_TO_CFZ);
                setReturnTimeLeft(600);
            }
            return current;
        });
     }, 100);
  }, []);

  const acceptOrders = useCallback(() => {
    setOrders(prev => prev.map(o => o.status === OrderStatus.READY ? { ...o, status: OrderStatus.TRANSFERRED_TO_COURIER } : o));
    setCourierStatus(CourierStatus.DELIVERY);
  }, []);

  const finishOrder = useCallback((id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: OrderStatus.DELIVERED, deliveredAt: new Date() } : o));
    checkReturnToCFZ();
  }, [checkReturnToCFZ]);

  const cancelOrder = useCallback((id: string, reason: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: OrderStatus.CANCELLED, cancelReason: reason } : o));
    checkReturnToCFZ();
  }, [checkReturnToCFZ]);

  const returnToCFZ = useCallback(() => {
    setCourierStatus(CourierStatus.IN_CFZ);
    setOrders([]); 
  }, []);

  const addTicket = (ticket: SupportTicket) => setTickets(prev => [ticket, ...prev]);

  return (
    <AppContext.Provider value={{ 
      orders, courierStatus, profile, tickets, returnTimeLeft,
      setOrders, setCourierStatus, addTicket, acceptOrders, finishOrder, cancelOrder, returnToCFZ,
      notification, setNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};