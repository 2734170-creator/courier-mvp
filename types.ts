
export enum OrderStatus {
  ASSEMBLY = 'Сборка',
  READY = 'Готово к выдаче',
  TRANSFERRED_TO_COURIER = 'Передано Курьеру',
  DELIVERED = 'Передано Клиенту',
  CANCELLED = 'Отменён',
  RETURNED_TO_CFZ = 'Возвращён в ЦФЗ'
}

export enum CourierStatus {
  IN_CFZ = 'В ЦФЗ',
  DELIVERY_ASSIGNED = 'Назначена доставка',
  DELIVERY = 'Доставка',
  RETURN_TO_CFZ = 'Возврат в ЦФЗ'
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  address: string;
  floor: string;
  comment: string;
  status: OrderStatus;
  assemblyTimeLeft: number; // seconds
  deliveryTimeLeft: number; // seconds
  items: OrderItem[];
  cancelReason?: string;
  deliveredAt?: Date;
}

export interface SupportTicket {
  id: string;
  date: string;
  createdAt: number; // timestamp
  subject: string;
  status: 'На рассмотрении' | 'Решено';
  text: string;
  answer?: string;
}

export interface CourierProfile {
  name: string;
  photo: string;
  cfzAddress: string;
}
