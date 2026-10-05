import { NotFoundError } from '../../../shared/errors';
import { toCents, type Cents } from '../../../shared/money';
import type { Product } from '../../products/domain/product';
import type { ProductRepository } from '../../products/domain/product-repository';
import type { ProductCost } from '../domain/product-cost';
import type { ProductCostRepository } from '../domain/product-cost-repository';

export interface ProductWithCost {
  product: Product;
  cost: ProductCost | null;
}

export class ProductCostService {
  constructor(
    private readonly products: ProductRepository,
    private readonly costs: ProductCostRepository,
  ) {}

  /** Creates or updates the unit cost of a product. */
  async setCost(productId: string, amount: number): Promise<ProductWithCost> {
    const product = await this.products.findById(productId);
    if (!product) throw new NotFoundError(`Product "${productId}" not found`);

    const cost: ProductCost = { productId, amount: toCents(amount), updatedAt: new Date() };
    await this.costs.save(cost);
    return { product, cost };
  }

  async listWithProducts(): Promise<ProductWithCost[]> {
    const [products, costs] = await Promise.all([this.products.findAll(), this.costs.findAll()]);
    const byProduct = new Map(costs.map((c) => [c.productId, c]));
    return products.map((product) => ({ product, cost: byProduct.get(product.id) ?? null }));
  }

  /** Unit cost in cents per SKU; products without a registered cost are absent. */
  async unitCostBySku(): Promise<Map<string, Cents>> {
    const entries = await this.listWithProducts();
    return new Map(entries.flatMap(({ product, cost }) => (cost ? [[product.sku, cost.amount] as const] : [])));
  }
}
