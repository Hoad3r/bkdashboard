import { Card, Statistic, Typography } from 'antd';
import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  loading?: boolean;
  format: (value: number) => string;
  /** Secondary line under the value, e.g. the margin. */
  hint?: ReactNode;
  danger?: boolean;
}

export function MetricCard({ title, value, loading, format, hint, danger }: MetricCardProps) {
  return (
    <Card loading={loading} style={{ height: '100%' }}>
      <Statistic title={title} value={format(value)} valueStyle={danger ? { color: '#cf1322' } : undefined} />
      {hint && (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {hint}
        </Typography.Text>
      )}
    </Card>
  );
}
