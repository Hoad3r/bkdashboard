import { Alert, Col, Row } from 'antd';
import type { DashboardSummaryDto as DashboardSummary } from '@dashboardbk/shared';
import { formatCurrency } from '../../shared/format';
import { MetricCard } from './MetricCard';

interface DashboardOverviewProps {
  data?: DashboardSummary;
  loading: boolean;
  error: Error | null;
}

const metrics = [
  { key: 'profit', title: 'Lucro', format: formatCurrency },
  { key: 'revenue', title: 'Faturamento', format: formatCurrency },
  { key: 'totalCost', title: 'Custo Total', format: formatCurrency },
  { key: 'ordersCount', title: 'Total de Pedidos', format: (v: number) => v.toLocaleString('pt-BR') },
] as const satisfies readonly { key: keyof DashboardSummary; title: string; format: (v: number) => string }[];

export function DashboardOverview({ data, loading, error }: DashboardOverviewProps) {
  if (error) return <Alert type="error" showIcon message="Não foi possível carregar os indicadores" description={error.message} />;

  return (
    <Row gutter={[16, 16]}>
      {metrics.map(({ key, title, format }) => (
        <Col key={key} xs={24} sm={12} lg={6}>
          <MetricCard title={title} value={data?.[key] ?? 0} loading={loading} format={format} />
        </Col>
      ))}
    </Row>
  );
}
