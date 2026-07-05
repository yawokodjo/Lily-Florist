import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import type { PaginatedResponse, Product, Category, AuthResponse, Order } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// Injecter le token JWT à chaque requête
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Refresh silencieux en cas de 401
let isRefreshing = false
let queue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = []

const flush = (error: unknown, token: string | null) => {
  queue.forEach(({ resolve, reject }) => (token ? resolve(token) : reject(error)))
  queue = []
}

apiClient.interceptors.response.use(
  (r) => r,
  async (error) => {
    const orig = error.config as typeof error.config & { _retry?: boolean }
    if (error.response?.status !== 401 || orig._retry) return Promise.reject(error)

    if (isRefreshing) {
      return new Promise((resolve, reject) => queue.push({ resolve, reject }))
        .then((token) => {
          orig.headers.Authorization = `Bearer ${token}`
          return apiClient(orig)
        })
    }

    orig._retry = true
    isRefreshing = true
    try {
      const refresh = useAuthStore.getState().refreshToken
      if (!refresh) throw new Error('No refresh token')
      const { data } = await axios.post(`${BASE_URL}/api/v1/auth/refresh/`, { refresh })
      useAuthStore.getState().setTokens(data.access, data.refresh ?? refresh)
      flush(null, data.access)
      orig.headers.Authorization = `Bearer ${data.access}`
      return apiClient(orig)
    } catch (e) {
      flush(e, null)
      useAuthStore.getState().logout()
      return Promise.reject(e)
    } finally {
      isRefreshing = false
    }
  },
)

// ── Services ──────────────────────────────────────────────────────

export const productsApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<Product>>('/products/', { params }).then((r) => r.data),
  featured: () =>
    apiClient.get<Product[]>('/products/featured/').then((r) => r.data),
  detail: (slug: string) =>
    apiClient.get<Product>(`/products/${slug}/`).then((r) => r.data),
  categories: () =>
    apiClient.get<Category[]>('/products/categories/').then((r) => r.data),
}

export const authApi = {
  register: (data: { email: string; password: string; first_name: string; last_name: string }) =>
    apiClient.post<AuthResponse>('/auth/register/', data).then((r) => r.data),
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login/', { email, password }).then((r) => r.data),
  logout: (refresh: string) =>
    apiClient.post('/auth/logout/', { refresh }),
}

export const ordersApi = {
  create: (data: unknown) =>
    apiClient.post<Order>('/orders/', data).then((r) => r.data),
  list: () =>
    apiClient.get<Order[]>('/orders/').then((r) => r.data),
  detail: (id: string) =>
    apiClient.get<Order>(`/orders/${id}/`).then((r) => r.data),
}
