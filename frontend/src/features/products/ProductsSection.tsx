import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Table } from 'antd';
import { useState } from 'react';
import { Section } from '../../shared/components/Section';
import { formatDate } from '../../shared/format';
import type { ProductDto as Product } from '@dashboardbk/shared';
import { fetchProducts, productsKey } from './api';
import { ProductFormModal } from './ProductFormModal';


export function ProductsSection() {
  const [creating, setCreating] = useState(false);
  const { data = [], isLoading } = useQuery({ queryKey: productsKey, queryFn: fetchProducts });

  return (
    <Section
      title="Produtos"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreating(true)}>
          Novo
        </Button>
      }
    >
      <Table<Product>
        size="middle"
        rowKey="id"
        loading={isLoading}
        dataSource={data}
        pagination={{ pageSize: 5, hideOnSinglePage: true }}
        columns={[
          { title: 'Produto', dataIndex: 'name' },
          { title: 'SKU', dataIndex: 'sku' },
          { title: 'Cadastro', dataIndex: 'createdAt', align: 'right', render: formatDate },
        ]}
      />
      <ProductFormModal open={creating} onClose={() => setCreating(false)} />
    </Section>
  );
}
