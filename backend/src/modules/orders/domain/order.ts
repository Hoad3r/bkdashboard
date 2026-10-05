import type { Cents } from '../../../shared/money';

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: Cents;
}

export interface Customer {
  name: string;
  email: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  total: Cents;
  createdAt: Date;
}

/** Sum of quantity x unit price of every item, in cents. */
export const itemsTotal = (order: Pick<Order, 'items'>): Cents =>
  order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
