import { Card, Typography } from 'antd';
import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
  children: ReactNode;
}

export function Section({ title, subtitle, extra, children }: SectionProps) {
  return (
    <Card
      title={
        <div>
          <Typography.Text strong>{title}</Typography.Text>
          {subtitle && (
            <Typography.Paragraph type="secondary" style={{ margin: 0, fontWeight: 400, fontSize: 12 }}>
              {subtitle}
            </Typography.Paragraph>
          )}
        </div>
      }
      extra={extra}
    >
      {children}
    </Card>
  );
}
