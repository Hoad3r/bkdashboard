import { useQuery } from '@tanstack/react-query';
import type { DateRangeFilter } from '../../shared/date-range';
import { fetchDashboard } from './api';

export const dashboardKey = ['dashboard'] as const;

export const useDashboard = (range: DateRangeFilter) =>
  useQuery({ queryKey: [...dashboardKey, range], queryFn: () => fetchDashboard(range) });
