import { Descriptions, Modal, Table } from 'antd';
import { formatCurrency, formatDateTime } from '../../shared/format';
import type { OrderDto as Order, OrderItemDto as OrderItem } from '@dashboardbk/shared';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  return (
    <Modal open={!!order} onCancel={onClose} footer={null} title={order ? `Pedido ${order.id}` : ''} width={640}>
      {order && (
        <>
          <Descriptions size="small" column={2} style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Cliente">{order.customer.name}</Descriptions.Item>
            <Descriptions.Item label="E-mail">{order.customer.email}</Descriptions.Item>
            <Descriptions.Item label="Data">{formatDateTime(order.createdAt)}</Descriptions.Item>
            <Descriptions.Item label="Total">{formatCurrency(order.total)}</Descriptions.Item>
          </Descriptions>
          <Table<OrderItem>
            size="small"
            pagination={false}
            rowKey="sku"
            dataSource={order.items}
            columns={[
              { title: 'Produto', dataIndex: 'name' },
              { title: 'SKU', dataIndex: 'sku' },
              { title: 'Qtd.', dataIndex: 'quantity', align: 'right' },
              { title: 'Preço unit.', dataIndex: 'unitPrice', align: 'right', render: formatCurrency },
              { title: 'Subtotal', dataIndex: 'subtotal', align: 'right', render: formatCurrency },
            ]}
          />
        </>
      )}
    </Modal>
  );
}
