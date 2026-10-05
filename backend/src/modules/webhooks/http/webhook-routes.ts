import type { WebhookOrderResponse } from '@dashboardbk/shared';
import { Router } from 'express';
import type { OrderService } from '../../orders/application/order-service';
import { toOrderDto } from '../../orders/http/order-routes';
import type { WebhookMapperRegistry } from '../mapper-registry';

export function webhookRoutes(registry: WebhookMapperRegistry, orders: OrderService): Router {
  const router = Router();

  router.post('/:platform/orders', async (req, res) => {
    const order = registry.get(req.params.platform).map(req.body);
    const result = await orders.register(order);
    // 201 for a new order, 200 when the platform re-delivered a known one.
    const body: WebhookOrderResponse = { ...toOrderDto(result.order), duplicate: !result.created };
    res.status(result.created ? 201 : 200).json(body);
  });

  return router;
}
