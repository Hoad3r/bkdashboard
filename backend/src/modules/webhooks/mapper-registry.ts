import { NotFoundError } from '../../shared/errors';
import type { OrderWebhookMapper } from './order-webhook-mapper';

export class WebhookMapperRegistry {
  private readonly mappers = new Map<string, OrderWebhookMapper>();

  constructor(mappers: OrderWebhookMapper[] = []) {
    mappers.forEach((m) => this.register(m));
  }

  register(mapper: OrderWebhookMapper): this {
    this.mappers.set(mapper.platform, mapper);
    return this;
  }

  get(platform: string): OrderWebhookMapper {
    const mapper = this.mappers.get(platform);
    if (!mapper) throw new NotFoundError(`Unsupported webhook platform "${platform}"`);
    return mapper;
  }
}
