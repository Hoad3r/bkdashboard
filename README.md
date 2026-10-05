# Dashboard de Vendas — Teste Técnico BK Company

Aplicação fullstack para acompanhar pedidos, faturamento, custo e lucro por período, cadastrar produtos e custos, e receber pedidos via webhook de uma plataforma de e-commerce.

- **Backend:** Node.js + Express 5 + Zod + TypeScript (repositórios em memória)
- **Frontend:** React + Vite + TypeScript + Ant Design + TanStack Query

## Como executar

Requer Node.js 20+.

```bash
npm install
npm run dev      # API em http://localhost:3001 e frontend em http://localhost:5173
```

Abra http://localhost:5173. Os dados são em memória e reiniciam a cada execução; por padrão a API sobe com dados de exemplo (4 produtos com custo e 45 pedidos, 5 deles de hoje e o resto espalhado pelos últimos 45 dias, relativos à data atual). Para iniciar vazio: `SEED_DATA=false npm run dev`.

Outros comandos: `npm test` (testes do backend), `npm run typecheck`, `npm run build` (frontend).

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/api/products` | Cadastra produto `{ sku, name }` (SKU único) |
| GET | `/api/products` | Lista produtos |
| PUT | `/api/product-costs/:productId` | Cadastra/atualiza o custo `{ cost }` |
| GET | `/api/product-costs` | Lista produtos com seus custos |
| POST | `/api/webhooks/:platform/orders` | Recebe webhook de pedido (`ecommerce` é a plataforma implementada) |
| GET | `/api/orders?from=&to=` | Lista pedidos (mais novos primeiro) |
| GET | `/api/dashboard?from=&to=` | `{ ordersCount, revenue, totalCost, profit }` |

`from`/`to` aceitam `YYYY-MM-DD` (dia inteiro, UTC, inclusivo) ou ISO 8601.

Exemplo de webhook:

```bash
curl -X POST localhost:3001/api/webhooks/ecommerce/orders -H 'content-type: application/json' -d '{
  "id": "ORD-98433",
  "buyer": { "buyerName": "Maria Souza", "buyerEmail": "maria@email.com" },
  "lineItems": [{ "itemId": "P-001", "itemName": "Camiseta Básica", "qty": 2, "unitPrice": 49.90 }],
  "totalAmount": 99.80,
  "createdAt": "2025-02-10T14:32:00Z"
}'
```

## Arquitetura

```
shared/src                 # @dashboardbk/shared: contrato HTTP (DTOs) usado pelo backend e pelo frontend
backend/src
├── app.ts                 # montagem do Express (rotas + middlewares)
├── server.ts              # bootstrap
├── bootstrap/             # container.ts (composition root) e seed.ts
├── shared/                # erros, dinheiro (centavos), intervalo de datas, helpers HTTP
└── modules/
    ├── products/          # domain (entidade + interface do repositório) · infra (in-memory) · application · http
    ├── costs/             # custo de produto (mesma divisão)
    ├── orders/            # pedidos (mesma divisão)
    ├── dashboard/         # consolidação (application) + rota
    └── webhooks/          # OrderWebhookMapper (contrato), registry e mappers por plataforma
frontend/src
├── api/                   # cliente HTTP
├── shared/                # formatação, componente Section
└── features/              # dashboard · orders · products · costs (api + componentes de cada seção)
```

Decisões principais:

- **Monorepo com npm workspaces** (`shared`, `backend`, `frontend`): um único `npm install`, e o contrato da API é tipado uma só vez em `@dashboardbk/shared`. Os presenters do backend e o cliente do frontend usam os mesmos tipos, então uma mudança no contrato quebra a compilação dos dois lados.
- **Dependency Inversion:** services dependem apenas das interfaces `*Repository`; as implementações em memória só são conhecidas pelo `bootstrap/container.ts`. Trocar por um banco real não altera regra de negócio.
- **Open/Closed no webhook:** o formato externo é isolado em `OrderWebhookMapper`. Um novo formato de plataforma é uma nova classe registrada no container, acessível em `/api/webhooks/<plataforma>/orders`, sem alterar o restante.
- **Valores em centavos** internamente (sem erros de ponto flutuante); a API expõe valores decimais.
- **Webhook idempotente:** reenvio do mesmo `id` retorna 200 sem duplicar o pedido (novo pedido retorna 201).
- **Total do pedido conferido:** o webhook é rejeitado com 400 quando `totalAmount` não bate com a soma de `qty × unitPrice` dos itens. A validação do formato fica no mapper; essa regra fica no `OrderService`, porque vale para qualquer plataforma.
- **Produto desconhecido é aceito:** um `itemId` sem produto cadastrado não bloqueia o pedido (a plataforma é a origem da venda). O item entra com custo zero até que um produto com esse SKU seja cadastrado e receba custo; a partir daí o lucro é recalculado.
- **Custo calculado no momento da consulta**, usando o custo atual de cada SKU (`itemId` do webhook = `sku` do produto). Cadastrar um custo corrige também o lucro de pedidos já recebidos; itens sem custo contam como zero.

## Vídeo demonstrativo

[_Adicionar o link aqui._](https://youtu.be/MRujsIOm2Cs)
