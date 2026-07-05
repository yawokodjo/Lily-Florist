import { Link } from 'react-router-dom'
import { ShoppingCart, Package } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '../../store/cartStore'
import type { LocalProduct } from '../../types'

interface ProductCardProps {
  product: LocalProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = () => {
    if (!product.inStock) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      photo_url: product.image,
      stock_quantity: product.stockQuantity,
    })
    toast.success(`${product.name} ajouté au panier`)
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      data-testid="product-card"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white px-4 py-2 rounded-md flex items-center gap-2">
                <Package className="size-5 text-red-500" />
                <span className="text-red-500 font-semibold text-sm">OUT OF STOCK</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-1">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-pink-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            data-testid="add-to-cart"
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${
              product.inStock
                ? 'bg-pink-500 text-white hover:bg-pink-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="size-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
