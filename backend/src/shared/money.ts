/** Money is handled internally as integer cents to avoid floating point drift. */
export type Cents = number;

export const toCents = (amount: number): Cents => Math.round(amount * 100);
export const fromCents = (cents: Cents): number => cents / 100;
