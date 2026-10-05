import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Modal, message } from 'antd';
import { costsKey } from '../costs/api';
import type { CreateProductRequest as CreateProductInput } from '@dashboardbk/shared';
import { createProduct, productsKey } from './api';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProductFormModal({ open, onClose }: ProductFormModalProps) {
  const [form] = Form.useForm<CreateProductInput>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKey });
      queryClient.invalidateQueries({ queryKey: costsKey });
      message.success('Produto cadastrado');
      form.resetFields();
      onClose();
    },
    onError: (error: Error) => message.error(error.message),
  });

  return (
    <Modal
      title="Novo produto"
      open={open}
      okText="Cadastrar"
      cancelText="Cancelar"
      confirmLoading={mutation.isPending}
      onOk={() => form.submit()}
      onCancel={onClose}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={(values) => mutation.mutate(values)}>
        <Form.Item name="sku" label="SKU" rules={[{ required: true, whitespace: true, message: 'Informe o SKU' }]}>
          <Input placeholder="P-005" maxLength={40} />
        </Form.Item>
        <Form.Item name="name" label="Nome" rules={[{ required: true, whitespace: true, message: 'Informe o nome' }]}>
          <Input placeholder="Boné Esportivo" maxLength={120} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
