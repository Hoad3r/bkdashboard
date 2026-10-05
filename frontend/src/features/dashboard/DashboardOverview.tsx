import { Alert, Col, Row } from 'antd';
import type { DashboardSummaryDto as DashboardSummary } from '@dashboardbk/shared';
import { formatCurrency, formatPercent } from '../../shared/format';
import { marginOf } from './margin';
import { MetricCard } from './MetricCard';

interface DashboardOverviewProps {
  data?: DashboardSummary;
  loading: boolean;
  error: Error | null;
}

const empty: DashboardSummary = { ordersCount: 0, revenue: 0, totalCost: 0, profit: 0 };

export function DashboardOverview({ data = empty, loading, error }: DashboardOverviewProps) {
  if (error) return <Alert type="error" showIcon message="Não foi possível carregar os indicadores" description={error.message} />;

  const margin = marginOf(data);
  const averageTicket = data.ordersCount > 0 ? data.revenue / data.ordersCount : 0;

  const cards = [
    {
      title: 'Lucro',
      value: data.profit,
      format: formatCurrency,
      danger: data.profit < 0,
      hint: margin === null ? 'Sem faturamento no período' : `Margem de ${formatPercent(margin)}`,
    },
    { title: 'Faturamento', value: data.revenue, format: formatCurrency, hint: `Ticket médio de ${formatCurrency(averageTicket)}` },
    { title: 'Custo Total', value: data.totalCost, format: formatCurrency, hint: 'Custo dos produtos vendidos' },
    { title: 'Total de Pedidos', value: data.ordersCount, format: (v: number) => v.toLocaleString('pt-BR'), hint: 'Recebidos via webhook' },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((card) => (
        <Col key={card.title} xs={24} sm={12} lg={6}>
          <MetricCard {...card} loading={loading} />
        </Col>
      ))}
    </Row>
  );
}
