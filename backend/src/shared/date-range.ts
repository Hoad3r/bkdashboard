export interface DateRange {
  from?: Date;
  to?: Date;
}

export const isWithinRange = (date: Date, { from, to }: DateRange): boolean =>
  (!from || date >= from) && (!to || date <= to);
