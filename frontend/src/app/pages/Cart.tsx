import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

export function Cart() {
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const navigate = useNavigate()

  const deliveryFee = 10.0
  const subtotal = total()
  const tax = subtotal * 0.08
  const orderTotal = subtotal + deliveryFee + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="size-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some beautiful flowers to get started</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-md hover:bg-pink-600 transition-colors"
          >
            Shop Now <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl mb-8 text-gray-900">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="p-6" data-testid="cart-item">
                  <div className="flex gap-4">
                    <img
                      src={item.photo_url}
                      alt={item.name}
                      className="size-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)} each</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="size-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            −
                          </button>
                          <span
                            className="w-12 text-center font-medium"
                            data-testid="qty-display"
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock_quantity}
                            data-testid="qty-increase"
                            className="size-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 mt-6 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-semibold text-gray-900 mb-6">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout/delivery')}
                className="w-full bg-pink-500 text-white py-3 rounded-md hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="size-5" />
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                Secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
