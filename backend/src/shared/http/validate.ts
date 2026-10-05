import type { z } from 'zod';
import { ValidationError } from '../errors';

export function parseOrThrow<S extends z.ZodTypeAny>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError('Invalid request data', result.error.flatten());
  }
  return result.data;
}
