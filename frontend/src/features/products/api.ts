import type { CreateProductRequest, ProductDto } from '@dashboardbk/shared';
import { http } from '../../api/http';

export const productsKey = ['products'] as const;

export const fetchProducts = () => http.get<ProductDto[]>('/products');
export const createProduct = (input: CreateProductRequest) => http.post<ProductDto>('/products', input);
