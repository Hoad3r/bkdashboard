import { CalendarOutlined } from '@ant-design/icons';
import { DatePicker, Segmented } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import type { DateRangeFilter } from '../../shared/date-range';

const DATE_FORMAT = 'YYYY-MM-DD';
const CUSTOM = 'custom';

type Range = [Dayjs, Dayjs] | null;

const presets: { value: string; label: string; range: () => Range }[] = [
  { value: 'today', label: 'Hoje', range: () => [dayjs(), dayjs()] },
  { value: '7d', label: '7 dias', range: () => [dayjs().subtract(6, 'day'), dayjs()] },
  { value: '30d', label: '30 dias', range: () => [dayjs().subtract(29, 'day'), dayjs()] },
  { value: 'month', label: 'Este mês', range: () => [dayjs().startOf('month'), dayjs()] },
  { value: 'all', label: 'Tudo', range: () => null },
];

interface DateRangeFormProps {
  onApply: (range: DateRangeFilter) => void;
}

/** Period filter: quick presets plus a start/end date picker. Every change is applied right away. */
export function DateRangeForm({ onApply }: DateRangeFormProps) {
  const [preset, setPreset] = useState('all');
  const [range, setRange] = useState<Range>(null);

  const apply = (next: Range, nextPreset: string) => {
    setRange(next);
    setPreset(nextPreset);
    onApply({ from: next?.[0].format(DATE_FORMAT), to: next?.[1].format(DATE_FORMAT) });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      <Segmented
        value={preset}
        options={[...presets.map(({ value, label }) => ({ value, label })), ...(preset === CUSTOM ? [{ value: CUSTOM, label: 'Personalizado' }] : [])]}
        onChange={(value) => {
          const chosen = presets.find((p) => p.value === value);
          if (chosen) apply(chosen.range(), chosen.value);
        }}
      />
      <DatePicker.RangePicker
        value={range}
        onChange={(dates) => apply(dates?.[0] && dates[1] ? [dates[0], dates[1]] : null, dates ? CUSTOM : 'all')}
        format="DD/MM/YYYY"
        placeholder={['Data inicial', 'Data final']}
        suffixIcon={<CalendarOutlined />}
        allowEmpty={[false, false]}
        style={{ width: 260 }}
      />
    </div>
  );
}
