import axios from 'axios';
import { getIdToken } from './auth';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const apiClient = axios.create({ baseURL: BASE_URL });

// Attach Cognito JWT to every request (skips silently if not logged in)
apiClient.interceptors.request.use(async (config) => {
  const token = await getIdToken().catch(() => undefined);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Products ─────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
}

export const productsApi = {
  list: () => apiClient.get<{ items: Product[] }>('/products').then((r) => r.data.items),
  get: (id: string) => apiClient.get<Product>(`/products/${id}`).then((r) => r.data),
  create: (data: Omit<Product, 'id'>) => apiClient.post<Product>('/products', data).then((r) => r.data),
  update: (id: string, data: Partial<Omit<Product, 'id'>>) =>
    apiClient.put<Product>(`/products/${id}`, data).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/products/${id}`),
};

// ── Cart ─────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export const cartApi = {
  get: () => apiClient.get<{ items: CartItem[] }>('/cart').then((r) => r.data.items),
  addItem: (productId: string, quantity: number) =>
    apiClient.post<CartItem>('/cart/items', { productId, quantity }).then((r) => r.data),
  updateItem: (productId: string, quantity: number) =>
    apiClient.put<CartItem>(`/cart/items/${productId}`, { quantity }).then((r) => r.data),
  removeItem: (productId: string) => apiClient.delete(`/cart/items/${productId}`),
};

// ── Orders ────────────────────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export const ordersApi = {
  list: () => apiClient.get<{ items: Order[] }>('/orders').then((r) => r.data.items),
  get: (id: string) => apiClient.get<Order>(`/orders/${id}`).then((r) => r.data),
  create: () => apiClient.post<Order>('/orders').then((r) => r.data),
};
