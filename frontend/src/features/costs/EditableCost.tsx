import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Button, InputNumber, Space, Typography } from 'antd';
import { useState } from 'react';
import { formatCurrency } from '../../shared/format';

interface EditableCostProps {
  value: number | null;
  saving: boolean;
  onSave: (value: number) => Promise<unknown>;
}

/** Displays a cost and swaps to an inline input when the edit button is clicked. */
export function EditableCost({ value, saving, onSave }: EditableCostProps) {
  const [draft, setDraft] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);

  const start = () => {
    setDraft(value);
    setEditing(true);
  };

  const save = async () => {
    if (draft === null) return;
    try {
      await onSave(draft);
      setEditing(false);
    } catch {
      /* the mutation reports the error; keep the input open */
    }
  };

  if (!editing) {
    return (
      <Space>
        {value === null ? <Typography.Text type="secondary">Sem custo</Typography.Text> : formatCurrency(value)}
        <Button type="text" size="small" icon={<EditOutlined />} aria-label="Editar custo" onClick={start} />
      </Space>
    );
  }

  return (
    <Space>
      <InputNumber
        autoFocus
        min={0}
        step={0.01}
        precision={2}
        prefix="R$"
        value={draft}
        onChange={setDraft}
        onPressEnter={save}
        style={{ width: 130 }}
      />
      <Button type="primary" size="small" icon={<CheckOutlined />} loading={saving} disabled={draft === null} aria-label="Salvar custo" onClick={save} />
      <Button size="small" icon={<CloseOutlined />} aria-label="Cancelar" onClick={() => setEditing(false)} />
    </Space>
  );
}
