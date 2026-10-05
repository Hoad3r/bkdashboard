import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Table, Typography } from 'antd';
import { useState } from 'react';
import { Section } from '../../shared/components/Section';
import { formatCurrency } from '../../shared/format';
import type { ProductCostDto as ProductCost } from '@dashboardbk/shared';
import { costsKey, fetchProductCosts } from '../costs/api';
import { ProductFormModal } from './ProductFormModal';

/** Catalog listing; reads product-costs so each row also shows its current cost. */
export function ProductsSection() {
  const [creating, setCreating] = useState(false);
  const { data = [], isLoading } = useQuery({ queryKey: costsKey, queryFn: fetchProductCosts });

  return (
    <Section
      title="Produtos"
      subtitle={`${data.length} ${data.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}`}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreating(true)}>
          Novo
        </Button>
      }
    >
      <Table<ProductCost>
        size="middle"
        rowKey={(row) => row.product.id}
        loading={isLoading}
        dataSource={data}
        pagination={{ pageSize: 5, hideOnSinglePage: true }}
        columns={[
          {
            title: 'Produto',
            render: (_, { product }) => (
              <div>
                <Typography.Text strong>{product.name}</Typography.Text>
                <br />
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {product.sku}
                </Typography.Text>
              </div>
            ),
          },
          {
            title: 'Custo unitário',
            align: 'right',
            render: (_, { cost }) =>
              cost === null ? <Typography.Text type="secondary">Sem custo</Typography.Text> : formatCurrency(cost),
          },
        ]}
      />
      <ProductFormModal open={creating} onClose={() => setCreating(false)} />
    </Section>
  );
}
