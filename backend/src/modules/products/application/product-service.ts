import { randomUUID } from 'node:crypto';
import { ConflictError } from '../../../shared/errors';
import type { Product } from '../domain/product';
import type { ProductRepository } from '../domain/product-repository';

export interface CreateProductInput {
  sku: string;
  name: string;
}

export class ProductService {
  constructor(private readonly products: ProductRepository) {}

  async create({ sku, name }: CreateProductInput): Promise<Product> {
    if (await this.products.findBySku(sku)) {
      throw new ConflictError(`A product with SKU "${sku}" already exists`);
    }
    const product: Product = { id: randomUUID(), sku, name, createdAt: new Date() };
    await this.products.save(product);
    return product;
  }

  list(): Promise<Product[]> {
    return this.products.findAll();
  }
}
