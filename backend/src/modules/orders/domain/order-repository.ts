import type { DateRange } from '../../../shared/date-range';
import type { Order } from './order';

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  /** Newest first. */
  findAll(range?: DateRange): Promise<Order[]>;
}
