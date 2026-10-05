import type { DashboardSummaryDto } from '@dashboardbk/shared';
import { http } from '../../api/http';
import { toQueryString, type DateRangeFilter } from '../../shared/date-range';

export const fetchDashboard = (range: DateRangeFilter) =>
  http.get<DashboardSummaryDto>(`/dashboard${toQueryString(range)}`);
