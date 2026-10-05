import type { ProductCost } from './product-cost';

export interface ProductCostRepository {
  save(cost: ProductCost): Promise<void>;
  findByProductId(productId: string): Promise<ProductCost | null>;
  findAll(): Promise<ProductCost[]>;
}
