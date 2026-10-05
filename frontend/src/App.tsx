import { Layout, Space, Typography } from 'antd';
import { useState } from 'react';
import { CostsSection } from './features/costs/CostsSection';
import type { DateRangeFilter } from './shared/date-range';
import { DashboardOverview } from './features/dashboard/DashboardOverview';
import { DateRangeForm } from './features/dashboard/DateRangeForm';
import { useDashboard } from './features/dashboard/useDashboard';
import { OrdersSection } from './features/orders/OrdersSection';
import { ProductsSection } from './features/products/ProductsSection';

export function App() {
  const [range, setRange] = useState<DateRangeFilter>({});
  const dashboard = useDashboard(range);

  return (
    <Layout style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Layout.Content style={{ maxWidth: 1100, width: '100%', margin: '0 auto', padding: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <Typography.Title level={3} style={{ margin: 0 }}>Dashboard</Typography.Title>
              <Typography.Text type="secondary">Visão geral do seu negócio</Typography.Text>
            </div>
            <DateRangeForm onApply={setRange} />
          </header>

          <DashboardOverview data={dashboard.data} loading={dashboard.isLoading} error={dashboard.error} />
          <OrdersSection range={range} />
          <ProductsSection />
          <CostsSection />
        </Space>
      </Layout.Content>
    </Layout>
  );
}
