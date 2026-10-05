import type { DashboardSummaryDto } from '@dashboardbk/shared';
import { Router } from 'express';
import { fromCents } from '../../../shared/money';
import { dateRangeQuerySchema } from '../../../shared/http/date-range-query';
import { parseOrThrow } from '../../../shared/http/validate';
import type { DashboardService } from '../application/dashboard-service';

export function dashboardRoutes(service: DashboardService): Router {
  const router = Router();

  router.get('/', async (req, res) => {
    const range = parseOrThrow(dateRangeQuerySchema, req.query);
    const s = await service.summary(range);
    const body: DashboardSummaryDto = {
      ordersCount: s.ordersCount,
      revenue: fromCents(s.revenue),
      totalCost: fromCents(s.totalCost),
      profit: fromCents(s.profit),
    };
    res.json(body);
  });

  return router;
}
