import type { DateRange } from '../../../shared/date-range';
import type { Cents } from '../../../shared/money';
import type { Order } from '../../orders/domain/order';

export interface DashboardSummary {
  ordersCount: number;
  revenue: Cents;
  totalCost: Cents;
  profit: Cents;
}

/** Abstractions the dashboard depends on (Dependency Inversion). */
export interface OrderSource {
  list(range?: DateRange): Promise<Order[]>;
}

export interface UnitCostSource {
  /** Unit cost in cents per SKU; SKUs without a registered cost are absent. */
  unitCostBySku(): Promise<Map<string, Cents>>;
}

export class DashboardService {
  constructor(
    private readonly orders: OrderSource,
    private readonly costs: UnitCostSource,
  ) {}

  /**
   * Costs are resolved at query time from the current unit cost of each SKU, so
   * registering a cost also corrects the figures of orders received earlier.
   * Items whose product has no cost registered count as zero cost.
   */
  async summary(range: DateRange): Promise<DashboardSummary> {
    const [orders, unitCosts] = await Promise.all([this.orders.list(range), this.costs.unitCostBySku()]);

    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalCost = orders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity * (unitCosts.get(i.sku) ?? 0), 0),
      0,
    );

    return { ordersCount: orders.length, revenue, totalCost, profit: revenue - totalCost };
  }
}
