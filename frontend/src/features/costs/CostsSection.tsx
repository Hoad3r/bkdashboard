import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, message } from 'antd';
import { Section } from '../../shared/components/Section';
import { dashboardKey } from '../dashboard/useDashboard';
import type { ProductCostDto as ProductCost } from '@dashboardbk/shared';
import { costsKey, fetchProductCosts, setProductCost } from './api';
import { EditableCost } from './EditableCost';


export function CostsSection() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: costsKey, queryFn: fetchProductCosts });

  const mutation = useMutation({
    mutationFn: setProductCost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: costsKey });
      // Profit depends on costs.
      queryClient.invalidateQueries({ queryKey: dashboardKey });
      message.success('Custo atualizado');
    },
    onError: (error: Error) => message.error(error.message),
  });

  return (
    <Section title="Custos de Produto" subtitle="Clique no lápis para editar o custo unitário">
      <Table<ProductCost>
        size="middle"
        rowKey={(row) => row.product.id}
        loading={isLoading}
        dataSource={data}
        pagination={{ pageSize: 5, hideOnSinglePage: true }}
        columns={[
          { title: 'Produto', render: (_, row) => row.product.name },
          { title: 'SKU', render: (_, row) => row.product.sku },
          {
            title: 'Custo',
            align: 'right',
            render: (_, row) => (
              <EditableCost
                value={row.cost}
                saving={mutation.isPending}
                onSave={(cost) => mutation.mutateAsync({ productId: row.product.id, cost })}
              />
            ),
          },
        ]}
      />
    </Section>
  );
}
