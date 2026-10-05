import type { Cents } from '../../../shared/money';

export interface ProductCost {
  productId: string;
  amount: Cents;
  updatedAt: Date;
}
