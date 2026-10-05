import type { DateRange } from '../../../shared/date-range';
import { ValidationError } from '../../../shared/errors';
import { fromCents } from '../../../shared/money';
import { itemsTotal, type Order } from '../domain/order';
import type { OrderRepository } from '../domain/order-repository';

export class OrderService {
  constructor(private readonly orders: OrderRepository) {}

  /**
   * Registers an order. Idempotent on the order id, since e-commerce platforms
   * retry webhook deliveries: a repeated id returns the stored order untouched.
   * Rejects orders whose total differs from the sum of their items, so revenue
   * and cost are always computed over the same items.
   */
  async register(order: Order): Promise<{ order: Order; created: boolean }> {
    const expected = itemsTotal(order);
    if (order.total !== expected) {
      throw new ValidationError('Order total does not match the sum of its items', {
        total: fromCents(order.total),
        itemsTotal: fromCents(expected),
      });
    }
    const existing = await this.orders.findById(order.id);
    if (existing) return { order: existing, created: false };
    await this.orders.save(order);
    return { order, created: true };
  }

  list(range?: DateRange): Promise<Order[]> {
    return this.orders.findAll(range);
  }
}
