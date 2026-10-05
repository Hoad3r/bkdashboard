import type { Container } from './container';

const DAY_MS = 24 * 60 * 60 * 1000;

const catalog = [
  { sku: 'P-001', name: 'Camiseta Básica', cost: 18, price: 49.9 },
  { sku: 'P-002', name: 'Calça Jeans', cost: 52, price: 129.9 },
  { sku: 'P-003', name: 'Tênis Esportivo', cost: 85, price: 189.9 },
  { sku: 'P-004', name: 'Jaqueta Corta-Vento', cost: 110, price: 249.9 },
];

const customers = [
  'Maria Souza', 'João Silva', 'Ana Costa', 'Carlos Mendes', 'Fernanda Lima', 'Ricardo Alves',
  'Juliana Rocha', 'Pedro Santos', 'Camila Ribeiro', 'Lucas Ferreira', 'Beatriz Gomes', 'Rafael Martins',
];

/** Small deterministic PRNG so the demo data is the same on every start. */
const random = (seedValue: number) => () => {
  seedValue = (seedValue * 1664525 + 1013904223) % 2 ** 32;
  return seedValue / 2 ** 32;
};

const emailOf = (name: string) =>
  `${name.split(' ')[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()}@email.com`;

/**
 * Demo data: the catalog with costs and ~40 orders spread over the last 45 days,
 * relative to the current date so period filters have something to show.
 * Disable with SEED_DATA=false.
 */
export async function seed({ productService, costService, webhookMappers, orderService }: Container, now = new Date()) {
  for (const { cost, sku, name } of catalog) {
    const product = await productService.create({ sku, name });
    await costService.setCost(product.id, cost);
  }

  const mapper = webhookMappers.get('ecommerce');
  const next = random(42);
  const pick = <T>(list: readonly T[]) => list[Math.floor(next() * list.length)];

  const orders = Array.from({ length: 40 }, () => {
    const daysAgo = Math.floor(next() * 45);
    const createdAt = new Date(now.getTime() - daysAgo * DAY_MS - Math.floor(next() * 10) * 60 * 60 * 1000);
    const products = [...new Set(Array.from({ length: 1 + Math.floor(next() * 3) }, () => pick(catalog)))];
    const lineItems = products.map((p) => ({ itemId: p.sku, itemName: p.name, qty: 1 + Math.floor(next() * 3), unitPrice: p.price }));
    return { createdAt, buyerName: pick(customers), lineItems };
  }).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  for (const [index, { createdAt, buyerName, lineItems }] of orders.entries()) {
    const totalAmount = lineItems.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
    await orderService.register(
      mapper.map({
        id: `ORD-${98400 + index}`,
        buyer: { buyerName, buyerEmail: emailOf(buyerName) },
        lineItems,
        totalAmount: Math.round(totalAmount * 100) / 100,
        createdAt: createdAt.toISOString(),
      }),
    );
  }
}
