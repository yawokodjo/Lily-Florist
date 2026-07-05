import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Order } from '../types'

interface AuthState {
  user: User | null
  orders: Order[]
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  // Auth
  setAuth: (user: User, access: string, refresh: string) => void
  setTokens: (access: string, refresh: string) => void
  logout: () => void

  // Orders (local fallback — en prod vient de l'API)
  addOrder: (order: Omit<Order, 'id' | 'reference'>) => string
  setOrders: (orders: Order[]) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      orders: [],
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, access, refresh) =>
        set({ user, accessToken: access, refreshToken: refresh, isAuthenticated: true }),

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),

      addOrder: (orderData) => {
        const id = `ORD-${Date.now()}`
        const reference = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        const newOrder: Order = { ...orderData, id, reference }
        set((state) => ({ orders: [...state.orders, newOrder] }))
        return id
      },

      setOrders: (orders) => set({ orders }),
    }),
    {
      name: 'lily-auth',
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken,
        orders: state.orders,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
