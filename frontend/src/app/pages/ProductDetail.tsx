import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Package, Check } from 'lucide-react'
import { toast } from 'sonner'
import { products } from '../data/products'
import { useCartStore } from '../store/cartStore'

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)

  // En dev on utilise l'id (slug = id pour les données statiques)
  const product = products.find((p) => p.id === slug)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product not found</h2>
          <Link to="/shop" className="text-pink-500 hover:text-pink-600">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        photo_url: product.image,
        stock_quantity: product.stockQuantity,
      },
      quantity,
    )
    setShowSuccess(true)
    toast.success(`${product.name} ajouté au panier`)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="size-5" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[500px] object-cover rounded-lg"
              />
              {!product.inStock && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <Package className="size-5" />
                  <span>OUT OF STOCK</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl mb-4 text-gray-900">{product.name}</h1>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {product.inStock && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="size-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(1, Math.min(product.stockQuantity, parseInt(e.target.value) || 1)),
                        )
                      }
                      data-testid="qty-display"
                      className="w-20 text-center px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      data-testid="qty-increase"
                      className="size-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.stockQuantity} available)
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-auto">
                {product.inStock ? (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-md hover:bg-pink-600 transition-colors"
                    >
                      <ShoppingCart className="size-5" />
                      Add to Cart
                    </button>
                    {showSuccess && (
                      <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-md">
                        <Check className="size-5" />
                        <span>Added to cart!</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gray-100 text-gray-500 px-6 py-3 rounded-md text-center">
                    Currently Unavailable
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
