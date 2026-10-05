import type { Product } from './product';

/** Persistence contract. Swap the in-memory implementation for a real one without touching use cases. */
export interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
}
