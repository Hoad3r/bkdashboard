import cors from 'cors';
import express from 'express';
import type { Container } from './bootstrap/container';
import { productCostRoutes } from './modules/costs/http/product-cost-routes';
import { dashboardRoutes } from './modules/dashboard/http/dashboard-routes';
import { orderRoutes } from './modules/orders/http/order-routes';
import { productRoutes } from './modules/products/http/product-routes';
import { webhookRoutes } from './modules/webhooks/http/webhook-routes';
import { errorHandler, notFoundHandler } from './shared/http/error-handler';

export function createApp(c: Container) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/products', productRoutes(c.productService));
  app.use('/api/product-costs', productCostRoutes(c.costService));
  app.use('/api/orders', orderRoutes(c.orderService));
  app.use('/api/dashboard', dashboardRoutes(c.dashboardService));
  app.use('/api/webhooks', webhookRoutes(c.webhookMappers, c.orderService));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
