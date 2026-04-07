export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;    // in cents
  quantity: number;
}

export interface Order {
  pk: string;       // "ORDER#<orderId>"
  sk: string;       // "ORDER#<orderId>"
  gsi1pk: string;   // "USER#<userId>"
  gsi1sk: string;   // "ORDER#<orderId>"
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;    // in cents
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
