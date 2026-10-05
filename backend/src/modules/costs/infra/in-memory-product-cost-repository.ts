import type { ProductCost } from '../domain/product-cost';
import type { ProductCostRepository } from '../domain/product-cost-repository';

export class InMemoryProductCostRepository implements ProductCostRepository {
  private readonly items = new Map<string, ProductCost>();

  async save(cost: ProductCost) {
    this.items.set(cost.productId, { ...cost });
  }

  async findByProductId(productId: string) {
    return this.items.get(productId) ?? null;
  }

  async findAll() {
    return [...this.items.values()];
  }
}
