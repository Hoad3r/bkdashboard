import type { OrderDto } from '@dashboardbk/shared';
import { Router } from 'express';
import { fromCents } from '../../../shared/money';
import { dateRangeQuerySchema } from '../../../shared/http/date-range-query';
import { parseOrThrow } from '../../../shared/http/validate';
import type { OrderService } from '../application/order-service';
import type { Order } from '../domain/order';

export const toOrderDto = (o: Order): OrderDto => ({
  id: o.id,
  customer: o.customer,
  items: o.items.map((i) => ({
    sku: i.sku,
    name: i.name,
    quantity: i.quantity,
    unitPrice: fromCents(i.unitPrice),
    subtotal: fromCents(i.unitPrice * i.quantity),
  })),
  total: fromCents(o.total),
  createdAt: o.createdAt.toISOString(),
});

export function orderRoutes(service: OrderService): Router {
  const router = Router();

  router.get('/', async (req, res) => {
    const range = parseOrThrow(dateRangeQuerySchema, req.query);
    res.json((await service.list(range)).map(toOrderDto));
  });

  return router;
}
