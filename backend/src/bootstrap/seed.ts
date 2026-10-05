import type { Container } from './container';

const TODAY_ORDERS = 5;

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
 * Demo data: the catalog with costs and ~45 orders: 5 from today and the rest spread over the last 45 days,
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

  // The first orders land earlier today, so the "today" filter is never empty.
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const minutesSinceMidnight = Math.max(1, Math.floor((now.getTime() - startOfToday.getTime()) / 60_000));

  const orders = Array.from({ length: 45 }, (_, index) => {
    const minutesAgo =
      index < TODAY_ORDERS
        ? Math.floor(next() * minutesSinceMidnight)
        : Math.floor(next() * 45) * 24 * 60 + Math.floor(next() * 10 * 60);
    const createdAt = new Date(now.getTime() - minutesAgo * 60_000);
    createdAt.setSeconds(0, 0);
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
