import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { createContainer } from '../src/bootstrap/container';
import { EcommerceOrderMapper } from '../src/modules/webhooks/mappers/ecommerce-order.mapper';

const webhookBody = {
  id: 'ORD-98432',
  buyer: { buyerName: 'Maria Souza', buyerEmail: 'maria@email.com' },
  lineItems: [
    { itemId: 'P-001', itemName: 'Camiseta Básica', qty: 2, unitPrice: 49.9 },
    { itemId: 'P-002', itemName: 'Calça Jeans', qty: 1, unitPrice: 129.9 },
  ],
  totalAmount: 229.7,
  createdAt: '2025-02-10T14:32:00Z',
};

describe('EcommerceOrderMapper', () => {
  it('maps the platform payload to the domain order', () => {
    const order = new EcommerceOrderMapper().map(webhookBody);
    expect(order).toEqual({
      id: 'ORD-98432',
      customer: { name: 'Maria Souza', email: 'maria@email.com' },
      items: [
        { sku: 'P-001', name: 'Camiseta Básica', quantity: 2, unitPrice: 4990 },
        { sku: 'P-002', name: 'Calça Jeans', quantity: 1, unitPrice: 12990 },
      ],
      total: 22970,
      createdAt: new Date('2025-02-10T14:32:00Z'),
    });
  });

  it('rejects malformed payloads', () => {
    expect(() => new EcommerceOrderMapper().map({ id: 'x' })).toThrow();
  });
});

describe('API', () => {
  let api: ReturnType<typeof request>;

  beforeEach(() => {
    api = request(createApp(createContainer()));
  });

  const createProduct = async (sku: string, name: string) =>
    (await api.post('/api/products').send({ sku, name })).body;

  it('creates products and rejects duplicate SKUs', async () => {
    await api.post('/api/products').send({ sku: 'P-001', name: 'Camiseta Básica' }).expect(201);
    await api.post('/api/products').send({ sku: 'P-001', name: 'Outra' }).expect(409);
    await api.post('/api/products').send({ sku: '' }).expect(400);
    expect((await api.get('/api/products').expect(200)).body).toHaveLength(1);
  });

  it('sets product cost and lists it with the product', async () => {
    const product = await createProduct('P-001', 'Camiseta Básica');
    await api.put(`/api/product-costs/${product.id}`).send({ cost: 18.5 }).expect(200);
    await api.put('/api/product-costs/unknown').send({ cost: 1 }).expect(404);
    await api.put(`/api/product-costs/${product.id}`).send({ cost: -1 }).expect(400);

    const { body } = await api.get('/api/product-costs').expect(200);
    expect(body[0]).toMatchObject({ cost: 18.5, product: { sku: 'P-001' } });
  });

  it('ingests webhooks idempotently and rejects unknown platforms', async () => {
    await api.post('/api/webhooks/ecommerce/orders').send(webhookBody).expect(201);
    const again = await api.post('/api/webhooks/ecommerce/orders').send(webhookBody).expect(200);
    expect(again.body.duplicate).toBe(true);
    await api.post('/api/webhooks/other/orders').send(webhookBody).expect(404);
    await api.post('/api/webhooks/ecommerce/orders').send({}).expect(400);
    expect((await api.get('/api/orders')).body).toHaveLength(1);
  });

  it('computes dashboard figures filtered by period', async () => {
    const shirt = await createProduct('P-001', 'Camiseta Básica');
    const jeans = await createProduct('P-002', 'Calça Jeans');
    await api.put(`/api/product-costs/${shirt.id}`).send({ cost: 18 });
    await api.put(`/api/product-costs/${jeans.id}`).send({ cost: 52 });
    await api.post('/api/webhooks/ecommerce/orders').send(webhookBody);
    await api
      .post('/api/webhooks/ecommerce/orders')
      .send({ ...webhookBody, id: 'ORD-2', totalAmount: 49.9, createdAt: '2025-03-01T10:00:00Z',
        lineItems: [webhookBody.lineItems[0]].map((i) => ({ ...i, qty: 1 })) });

    const all = await api.get('/api/dashboard').expect(200);
    expect(all.body).toEqual({ ordersCount: 2, revenue: 279.6, totalCost: 106, profit: 173.6 });

    const feb = await api.get('/api/dashboard?from=2025-02-01&to=2025-02-10').expect(200);
    expect(feb.body).toEqual({ ordersCount: 1, revenue: 229.7, totalCost: 88, profit: 141.7 });

    await api.get('/api/dashboard?from=2025-03-01&to=2025-02-01').expect(400);
    await api.get('/api/dashboard?from=nope').expect(400);
  });
});
