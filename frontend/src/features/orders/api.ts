import type { OrderDto } from '@dashboardbk/shared';
import { http } from '../../api/http';
import { toQueryString, type DateRangeFilter } from '../../shared/date-range';

export const ordersKey = ['orders'] as const;

export const fetchOrders = (range: DateRangeFilter) => http.get<OrderDto[]>(`/orders${toQueryString(range)}`);
