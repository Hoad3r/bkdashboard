import type { Container } from './container';

/** Demo data matching the reference layout. Disable with SEED_DATA=false. */
export async function seed({ productService, costService, webhookMappers, orderService }: Container) {
  const catalog = [
    { sku: 'P-001', name: 'Camiseta Básica', cost: 18 },
    { sku: 'P-002', name: 'Calça Jeans', cost: 52 },
    { sku: 'P-003', name: 'Tênis Esportivo', cost: 85 },
    { sku: 'P-004', name: 'Jaqueta Corta-Vento', cost: 110 },
  ];
  for (const { cost, ...input } of catalog) {
    const product = await productService.create(input);
    await costService.setCost(product.id, cost);
  }

  const mapper = webhookMappers.get('ecommerce');
  const line = (i: number, qty: number) => {
    const p = catalog[i];
    const price = [49.9, 129.9, 189.9, 249.9][i];
    return { itemId: p.sku, itemName: p.name, qty, unitPrice: price };
  };
  const samples = [
    ['ORD-98428', 'Fernanda Lima', '2025-02-08T10:05:00Z', [line(0, 2), line(1, 1)]],
    ['ORD-98429', 'Carlos Mendes', '2025-02-07T16:40:00Z', [line(1, 1), line(2, 1)]],
    ['ORD-98430', 'Ana Costa', '2025-02-08T09:12:00Z', [line(0, 1)]],
    ['ORD-98431', 'João Silva', '2025-02-09T18:20:00Z', [line(3, 1), line(2, 1)]],
    ['ORD-98432', 'Maria Souza', '2025-02-10T14:32:00Z', [line(0, 2), line(1, 1)]],
  ] as const;

  for (const [id, name, createdAt, lineItems] of samples) {
    const totalAmount = lineItems.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    await orderService.register(
      mapper.map({
        id,
        buyer: { buyerName: name, buyerEmail: `${name.split(' ')[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()}@email.com` },
        lineItems,
        totalAmount: Math.round(totalAmount * 100) / 100,
        createdAt,
      }),
    );
  }
}
