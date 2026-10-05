import { z } from 'zod';
import { toCents } from '../../../shared/money';
import { parseOrThrow } from '../../../shared/http/validate';
import type { Order } from '../../orders/domain/order';
import type { OrderWebhookMapper } from '../order-webhook-mapper';

/** Shape sent by the e-commerce platform (external contract). */
const payloadSchema = z.object({
  id: z.string().min(1),
  buyer: z.object({
    buyerName: z.string().min(1),
    buyerEmail: z.string().email(),
  }),
  lineItems: z
    .array(
      z.object({
        itemId: z.string().min(1),
        itemName: z.string().min(1),
        qty: z.number().int().positive(),
        unitPrice: z.number().nonnegative(),
      }),
    )
    .min(1),
  totalAmount: z.number().nonnegative(),
  createdAt: z.string().datetime(),
});

export class EcommerceOrderMapper implements OrderWebhookMapper {
  readonly platform = 'ecommerce';

  map(body: unknown): Order {
    const payload = parseOrThrow(payloadSchema, body);
    return {
      id: payload.id,
      customer: { name: payload.buyer.buyerName, email: payload.buyer.buyerEmail },
      items: payload.lineItems.map((item) => ({
        sku: item.itemId,
        name: item.itemName,
        quantity: item.qty,
        unitPrice: toCents(item.unitPrice),
      })),
      total: toCents(payload.totalAmount),
      createdAt: new Date(payload.createdAt),
    };
  }
}
