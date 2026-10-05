import { FilterOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import type { DateRangeFilter } from '../../shared/date-range';

const DATE_FORMAT = 'YYYY-MM-DD';

interface DateRangeFormProps {
  onApply: (range: DateRangeFilter) => void;
}

export function DateRangeForm({ onApply }: DateRangeFormProps) {
  const [from, setFrom] = useState<Dayjs | null>(null);
  const [to, setTo] = useState<Dayjs | null>(null);

  return (
    <Form layout="inline" onFinish={() => onApply({ from: from?.format(DATE_FORMAT), to: to?.format(DATE_FORMAT) })}>
      <Space align="end" wrap>
        <Form.Item label="Data inicial" layout="vertical" style={{ margin: 0 }}>
          <DatePicker value={from} onChange={setFrom} format="DD/MM/YYYY" maxDate={to ?? undefined} />
        </Form.Item>
        <Form.Item label="Data final" layout="vertical" style={{ margin: 0 }}>
          <DatePicker value={to} onChange={setTo} format="DD/MM/YYYY" minDate={from ?? undefined} />
        </Form.Item>
        <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
          Filtrar
        </Button>
      </Space>
    </Form>
  );
}
