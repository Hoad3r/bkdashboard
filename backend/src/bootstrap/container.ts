import { ProductCostService } from '../modules/costs/application/product-cost-service';
import type { ProductCostRepository } from '../modules/costs/domain/product-cost-repository';
import { InMemoryProductCostRepository } from '../modules/costs/infra/in-memory-product-cost-repository';
import { DashboardService } from '../modules/dashboard/application/dashboard-service';
import { OrderService } from '../modules/orders/application/order-service';
import type { OrderRepository } from '../modules/orders/domain/order-repository';
import { InMemoryOrderRepository } from '../modules/orders/infra/in-memory-order-repository';
import { ProductService } from '../modules/products/application/product-service';
import type { ProductRepository } from '../modules/products/domain/product-repository';
import { InMemoryProductRepository } from '../modules/products/infra/in-memory-product-repository';
import { WebhookMapperRegistry } from '../modules/webhooks/mapper-registry';
import { EcommerceOrderMapper } from '../modules/webhooks/mappers/ecommerce-order.mapper';

export interface Repositories {
  products: ProductRepository;
  costs: ProductCostRepository;
  orders: OrderRepository;
}

export const inMemoryRepositories = (): Repositories => ({
  products: new InMemoryProductRepository(),
  costs: new InMemoryProductCostRepository(),
  orders: new InMemoryOrderRepository(),
});

/** Composition root: the only place that knows which concrete implementations are used. */
export function createContainer(repositories: Repositories = inMemoryRepositories()) {
  const productService = new ProductService(repositories.products);
  const costService = new ProductCostService(repositories.products, repositories.costs);
  const orderService = new OrderService(repositories.orders);
  const dashboardService = new DashboardService(orderService, costService);
  const webhookMappers = new WebhookMapperRegistry([new EcommerceOrderMapper()]);

  return { productService, costService, orderService, dashboardService, webhookMappers };
}

export type Container = ReturnType<typeof createContainer>;
