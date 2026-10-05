import { z } from 'zod';
import type { DateRange } from '../date-range';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const dateParam = (endOfDay: boolean) =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (!value) return undefined;
      // Date-only values (YYYY-MM-DD) cover the whole day, in UTC.
      const date = new Date(DATE_ONLY.test(value) ? `${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z` : value);
      if (Number.isNaN(date.getTime())) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid date' });
        return z.NEVER;
      }
      return date;
    });

export const dateRangeQuerySchema = z
  .object({ from: dateParam(false), to: dateParam(true) })
  .refine(({ from, to }) => !from || !to || from <= to, {
    message: '"from" must be before or equal to "to"',
    path: ['from'],
  });

export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema> & DateRange;
