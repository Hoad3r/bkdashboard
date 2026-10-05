import { Button, DatePicker, Form, Space } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import type { DateRangeFilter } from '../../shared/date-range';

const DATE_FORMAT = 'YYYY-MM-DD';

const presets: { label: string; range: () => [Dayjs, Dayjs] | null }[] = [
  { label: 'Hoje', range: () => [dayjs(), dayjs()] },
  { label: '7 dias', range: () => [dayjs().subtract(6, 'day'), dayjs()] },
  { label: '30 dias', range: () => [dayjs().subtract(29, 'day'), dayjs()] },
  { label: 'Este mês', range: () => [dayjs().startOf('month'), dayjs()] },
  { label: 'Tudo', range: () => null },
];

interface DateRangeFormProps {
  onApply: (range: DateRangeFilter) => void;
}

/** Start/end date filter; every change is applied right away. */
export function DateRangeForm({ onApply }: DateRangeFormProps) {
  const [from, setFrom] = useState<Dayjs | null>(null);
  const [to, setTo] = useState<Dayjs | null>(null);

  const apply = (nextFrom: Dayjs | null, nextTo: Dayjs | null) => {
    setFrom(nextFrom);
    setTo(nextTo);
    onApply({ from: nextFrom?.format(DATE_FORMAT), to: nextTo?.format(DATE_FORMAT) });
  };

  const isActive = (range: [Dayjs, Dayjs] | null) =>
    range === null ? !from && !to : !!from && !!to && from.isSame(range[0], 'day') && to.isSame(range[1], 'day');

  return (
    <Space direction="vertical" align="end" size={8}>
      <Space align="end" wrap>
        <Form.Item label="Data inicial" layout="vertical" style={{ margin: 0 }}>
          <DatePicker value={from} onChange={(d) => apply(d, to)} format="DD/MM/YYYY" maxDate={to ?? undefined} placeholder="Início" />
        </Form.Item>
        <Form.Item label="Data final" layout="vertical" style={{ margin: 0 }}>
          <DatePicker value={to} onChange={(d) => apply(from, d)} format="DD/MM/YYYY" minDate={from ?? undefined} placeholder="Fim" />
        </Form.Item>
      </Space>
      <Space size={4} wrap>
        {presets.map(({ label, range }) => {
          const value = range();
          return (
            <Button
              key={label}
              size="small"
              type={isActive(value) ? 'primary' : 'default'}
              onClick={() => apply(value?.[0] ?? null, value?.[1] ?? null)}
            >
              {label}
            </Button>
          );
        })}
      </Space>
    </Space>
  );
}
