// ── Produit ────────────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  slug: string
  price: string          // décimal string depuis l'API Django
  category: string
  category_name: string
  photo_url: string
  in_stock: boolean
  stock_quantity: number
  is_featured: boolean
  description?: string
  created_at?: string
}

// Produit en mode local (données statiques pendant le dev / fallback)
export interface LocalProduct {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  inStock: boolean
  stockQuantity: number
}

export interface Category {
  id: number
  name: string
  slug: string
  product_count: number
}

// ── Panier ─────────────────────────────────────────────────────────
export interface CartItem {
  id: string
  name: string
  price: number           // converti en number dans le store
  photo_url: string
  stock_quantity: number
  quantity: number
  gift_message?: string
}

// ── Auth / User ────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
}

export interface Address {
  id: number
  label: string
  street: string
  city: string
  postal_code: string
  country: string
  is_default: boolean
}

// ── Commande ───────────────────────────────────────────────────────
export interface OrderItem {
  product_name: string
  product_price: string
  quantity: number
}

export interface Order {
  id: string
  reference: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: string
  delivery_date: string
  created_at: string
  items: OrderItem[]
  delivery_street?: string
  delivery_city?: string
}

// ── API ────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  total_pages: number
  results: T[]
}

export interface AuthResponse {
  user: User
  access: string
  refresh: string
}

// ── Checkout (session) ─────────────────────────────────────────────
export interface DeliveryDetails {
  recipientName: string
  address: string
  city: string
  zipCode: string
  deliveryDate: string
  specialInstructions: string
  giftMessage: string
}

export interface OrderData {
  deliveryDetails: DeliveryDetails
  items: CartItem[]
  pricing: {
    subtotal: number
    deliveryFee: number
    tax: number
    discount: number
    total: number
  }
  promoCode?: string
}
