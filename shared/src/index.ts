/**
 * HTTP contract shared by backend and frontend.
 * Monetary values are decimals (BRL) and dates are ISO 8601 strings.
 */

export interface ProductDto {
  id: string;
  sku: string;
  name: string;
  createdAt: string;
}

export interface CreateProductRequest {
  sku: string;
  name: string;
}

export interface ProductCostDto {
  product: ProductDto;
  cost: number | null;
  updatedAt: string | null;
}

export interface SetProductCostRequest {
  cost: number;
}

export interface OrderItemDto {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDto {
  id: string;
  customer: { name: string; email: string };
  items: OrderItemDto[];
  total: number;
  createdAt: string;
}

export interface WebhookOrderResponse extends OrderDto {
  duplicate: boolean;
}

export interface DashboardSummaryDto {
  ordersCount: number;
  revenue: number;
  totalCost: number;
  profit: number;
}

/** Query string accepted by period-filtered endpoints: YYYY-MM-DD or ISO 8601. */
export interface DateRangeQuery {
  from?: string;
  to?: string;
}

export interface ApiErrorResponse {
  error: { code: string; message: string; details?: unknown };
}
