import type { DateRangeQuery } from '@dashboardbk/shared';

/** Dates as YYYY-MM-DD; undefined means open-ended. */
export type DateRangeFilter = DateRangeQuery;

export const toQueryString = ({ from, to }: DateRangeFilter) => {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};
