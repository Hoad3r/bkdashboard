import type { ProductCostDto, SetProductCostRequest } from '@dashboardbk/shared';
import { Router } from 'express';
import { z } from 'zod';
import { fromCents } from '../../../shared/money';
import { parseOrThrow } from '../../../shared/http/validate';
import { toProductDto } from '../../products/http/product-routes';
import type { ProductCostService, ProductWithCost } from '../application/product-cost-service';

const setCostSchema: z.ZodType<SetProductCostRequest> = z.object({
  cost: z.number().finite().nonnegative().max(1_000_000),
});

const toDto = ({ product, cost }: ProductWithCost): ProductCostDto => ({
  product: toProductDto(product),
  cost: cost ? fromCents(cost.amount) : null,
  updatedAt: cost?.updatedAt.toISOString() ?? null,
});

export function productCostRoutes(service: ProductCostService): Router {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json((await service.listWithProducts()).map(toDto));
  });

  router.put('/:productId', async (req, res) => {
    const { cost } = parseOrThrow(setCostSchema, req.body);
    res.json(toDto(await service.setCost(req.params.productId, cost)));
  });

  return router;
}
