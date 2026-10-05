import { Router } from 'express';
import { z } from 'zod';
import { parseOrThrow } from '../../../shared/http/validate';
import type { ProductService } from '../application/product-service';
import type { CreateProductRequest, ProductDto } from '@dashboardbk/shared';
import type { Product } from '../domain/product';

const createProductSchema: z.ZodType<CreateProductRequest> = z.object({
  sku: z.string().trim().min(1).max(40),
  name: z.string().trim().min(1).max(120),
});

export const toProductDto = (p: Product): ProductDto => ({
  id: p.id,
  sku: p.sku,
  name: p.name,
  createdAt: p.createdAt.toISOString(),
});

export function productRoutes(service: ProductService): Router {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json((await service.list()).map(toProductDto));
  });

  router.post('/', async (req, res) => {
    const input = parseOrThrow(createProductSchema, req.body);
    res.status(201).json(toProductDto(await service.create(input)));
  });

  return router;
}
