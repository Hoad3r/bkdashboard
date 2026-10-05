import type { Product } from '../domain/product';
import type { ProductRepository } from '../domain/product-repository';

export class InMemoryProductRepository implements ProductRepository {
  private readonly items = new Map<string, Product>();

  async save(product: Product) {
    this.items.set(product.id, { ...product });
  }

  async findById(id: string) {
    return this.items.get(id) ?? null;
  }

  async findBySku(sku: string) {
    return [...this.items.values()].find((p) => p.sku === sku) ?? null;
  }

  async findAll() {
    return [...this.items.values()].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}
