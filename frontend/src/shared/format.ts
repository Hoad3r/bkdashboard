import dayjs from 'dayjs';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatCurrency = (value: number) => currency.format(value);
export const formatDate = (iso: string) => dayjs(iso).format('DD/MM/YYYY');
export const formatDateTime = (iso: string) => dayjs(iso).format('DD/MM/YYYY HH:mm');
