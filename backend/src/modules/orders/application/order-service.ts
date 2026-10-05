import type { DateRange } from '../../../shared/date-range';
import type { Order } from '../domain/order';
import type { OrderRepository } from '../domain/order-repository';

export class OrderService {
  constructor(private readonly orders: OrderRepository) {}

  /**
   * Registers an order. Idempotent on the order id, since e-commerce platforms
   * retry webhook deliveries: a repeated id returns the stored order untouched.
   */
  async register(order: Order): Promise<{ order: Order; created: boolean }> {
    const existing = await this.orders.findById(order.id);
    if (existing) return { order: existing, created: false };
    await this.orders.save(order);
    return { order, created: true };
  }

  list(range?: DateRange): Promise<Order[]> {
    return this.orders.findAll(range);
  }
}
