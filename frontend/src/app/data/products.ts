// Données statiques originales — utilisées en dev si l'API n'est pas disponible.
// En production, les produits viennent de l'API Django.
import type { LocalProduct } from '../types'

export const products: LocalProduct[] = [
  {
    id: '1',
    name: 'Red Roses Bouquet',
    price: 29.99,
    category: 'Roses',
    image: 'https://images.unsplash.com/photo-1548094967-e25a127d1f6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    description: 'Classic red roses, perfect for expressing love and romance. Dozen fresh roses beautifully arranged.',
    inStock: true,
    stockQuantity: 25,
  },
  {
    id: '2',
    name: 'Pink Tulips',
    price: 24.99,
    category: 'Tulips',
    image: 'https://images.unsplash.com/photo-1645802419761-eb577d82e025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    description: 'Elegant pink tulips that brighten any room. Fresh spring blooms with vibrant colors.',
    inStock: true,
    stockQuantity: 30,
  },
  {
    id: '3',
    name: 'White Lilies',
    price: 34.99,
    category: 'Lilies',
    image: 'https://images.unsplash.com/photo-1758673825420-3e7fb0eb199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    description: 'Pure white lilies symbolizing elegance and grace. Perfect for special occasions.',
    inStock: false,
    stockQuantity: 0,
  },
  {
    id: '4',
    name: 'Mixed Bouquet',
    price: 39.99,
    category: 'Arrangements',
    image: 'https://images.unsplash.com/photo-1642728265490-2ea6c3320880?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    description: 'Beautiful mix of seasonal flowers in vibrant colors. A delightful surprise for any recipient.',
    inStock: true,
    stockQuantity: 20,
  },
  {
    id: '5',
    name: 'Sunflower Bouquet',
    price: 27.99,
    category: 'Sunflowers',
    image: 'https://images.unsplash.com/photo-1752765579755-3fa8ed16f5f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    description: 'Bright and cheerful sunflowers that bring sunshine into any home. Perfect for lifting spirits.',
    inStock: true,
    stockQuantity: 15,
  },
  {
    id: '6',
    name: 'Purple Orchids',
    price: 44.99,
    category: 'Orchids',
    image: 'https://images.unsplash.com/photo-1769498491336-e67913b8a870?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    description: 'Exotic purple orchids for the sophisticated taste. Long-lasting and elegant.',
    inStock: true,
    stockQuantity: 12,
  },
  {
    id: '7',
    name: 'Colorful Carnations',
    price: 19.99,
    category: 'Carnations',
    image: 'https://images.unsplash.com/photo-1618327887512-af4399ccab36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    description: 'Vibrant carnations in multiple colors. Affordable and long-lasting beauty.',
    inStock: true,
    stockQuantity: 40,
  },
  {
    id: '8',
    name: 'Pink Peonies',
    price: 49.99,
    category: 'Peonies',
    image: 'https://images.unsplash.com/photo-1588457776180-4206b4909301?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    description: 'Luxurious pink peonies with full, lush blooms. Perfect for weddings and special celebrations.',
    inStock: true,
    stockQuantity: 8,
  },
]

export const categories = [
  'All', 'Roses', 'Tulips', 'Lilies', 'Sunflowers',
  'Orchids', 'Carnations', 'Peonies', 'Arrangements',
]

// Convertit un LocalProduct en CartItem-compatible
export function toCartItem(p: LocalProduct) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    photo_url: p.image,
    stock_quantity: p.stockQuantity,
  }
}
