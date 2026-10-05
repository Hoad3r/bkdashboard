import type { Order } from '../orders/domain/order';

/**
 * Translates a platform-specific "order created" payload into the domain Order.
 * To support a new platform, implement this contract and register it in the
 * composition root; nothing else changes (Open/Closed).
 */
export interface OrderWebhookMapper {
  /** Identifier used in the webhook URL: POST /api/webhooks/:platform/orders */
  readonly platform: string;
  /** Validates the raw body and maps it. Throws ValidationError on malformed payloads. */
  map(payload: unknown): Order;
}
