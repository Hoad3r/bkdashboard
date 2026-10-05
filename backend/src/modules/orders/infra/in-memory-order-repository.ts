import { isWithinRange, type DateRange } from '../../../shared/date-range';
import type { Order } from '../domain/order';
import type { OrderRepository } from '../domain/order-repository';

export class InMemoryOrderRepository implements OrderRepository {
  private readonly items = new Map<string, Order>();

  async save(order: Order) {
    this.items.set(order.id, { ...order, items: order.items.map((i) => ({ ...i })) });
  }

  async findById(id: string) {
    return this.items.get(id) ?? null;
  }

  async findAll(range: DateRange = {}) {
    return [...this.items.values()]
      .filter((o) => isWithinRange(o.createdAt, range))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
