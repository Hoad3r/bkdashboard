import { EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Table } from 'antd';
import { useState } from 'react';
import { Section } from '../../shared/components/Section';
import { formatCurrency, formatDate } from '../../shared/format';
import type { DateRangeFilter } from '../../shared/date-range';
import type { OrderDto as Order } from '@dashboardbk/shared';
import { fetchOrders, ordersKey } from './api';
import { OrderDetailsModal } from './OrderDetailsModal';


export function OrdersSection({ range }: { range: DateRangeFilter }) {
  const [selected, setSelected] = useState<Order | null>(null);
  const { data = [], isLoading } = useQuery({ queryKey: [...ordersKey, range], queryFn: () => fetchOrders(range) });

  return (
    <Section title="Pedidos Recentes" subtitle="Últimos pedidos recebidos via webhook">
      <Table<Order>
        size="middle"
        rowKey="id"
        loading={isLoading}
        dataSource={data}
        pagination={{ pageSize: 5, hideOnSinglePage: true }}
        columns={[
          { title: 'Pedido', dataIndex: 'id' },
          { title: 'Cliente', dataIndex: ['customer', 'name'] },
          { title: 'Data', dataIndex: 'createdAt', render: formatDate },
          { title: 'Total', dataIndex: 'total', align: 'right', render: formatCurrency },
          {
            title: '',
            align: 'right',
            render: (_, order) => (
              <Button type="text" icon={<EyeOutlined />} aria-label={`Ver detalhes de ${order.id}`} onClick={() => setSelected(order)} />
            ),
          },
        ]}
      />
      <OrderDetailsModal order={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}
