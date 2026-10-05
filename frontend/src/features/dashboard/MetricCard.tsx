import { Card, Statistic } from 'antd';

interface MetricCardProps {
  title: string;
  value: number;
  loading?: boolean;
  format: (value: number) => string;
}

export function MetricCard({ title, value, loading, format }: MetricCardProps) {
  return (
    <Card loading={loading}>
      <Statistic title={title} value={format(value)} />
    </Card>
  );
}
