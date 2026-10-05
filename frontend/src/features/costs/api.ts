import type { ProductCostDto, SetProductCostRequest } from '@dashboardbk/shared';
import { http } from '../../api/http';

export const costsKey = ['product-costs'] as const;

export const fetchProductCosts = () => http.get<ProductCostDto[]>('/product-costs');
export const setProductCost = ({ productId, cost }: SetProductCostRequest & { productId: string }) =>
  http.put<ProductCostDto>(`/product-costs/${productId}`, { cost } satisfies SetProductCostRequest);
