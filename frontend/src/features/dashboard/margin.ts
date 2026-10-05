import type { DashboardSummaryDto } from '@dashboardbk/shared';

/** Profit over revenue; null when there is no revenue to divide by. */
export const marginOf = ({ revenue, profit }: Pick<DashboardSummaryDto, 'revenue' | 'profit'>) =>
  revenue > 0 ? profit / revenue : null;
