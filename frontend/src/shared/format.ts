import dayjs from 'dayjs';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const percent = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 });

export const formatCurrency = (value: number) => currency.format(value);
export const formatPercent = (ratio: number) => percent.format(ratio);
export const formatDate = (iso: string) => dayjs(iso).format('DD/MM/YYYY');
export const formatDateTime = (iso: string) => dayjs(iso).format('DD/MM/YYYY HH:mm');
