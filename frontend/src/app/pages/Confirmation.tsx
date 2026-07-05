import { useEffect, useRef, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { CheckCircle, Package, Calendar, Mail } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import type { OrderData } from '../types'

export function Confirmation() {
  const { clearCart } = useCartStore()
  const { user, addOrder } = useAuthStore()
  const processed = useRef(false)

  // Snapshot once at mount so a later re-render (triggered by clearCart/addOrder
  // below, after sessionStorage is cleared) doesn't flip this back to null and
  // skip the useEffect call below, which would violate the Rules of Hooks.
  const [data] = useState<OrderData | null>(() => {
    const raw = sessionStorage.getItem('orderData')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    if (processed.current || !data) return
    processed.current = true

    addOrder({
      created_at: new Date().toISOString(),
      items: data.items.map((i) => ({
        product_name: i.name,
        product_price: i.price.toString(),
        quantity: i.quantity,
      })),
      total: data.pricing.total.toString(),
      delivery_date: data.deliveryDetails.deliveryDate,
      delivery_street: data.deliveryDetails.address,
      delivery_city: `${data.deliveryDetails.city}, ${data.deliveryDetails.zipCode}`,
      status: 'confirmed',
    })

    clearCart()
    sessionStorage.removeItem('deliveryDetails')
    sessionStorage.removeItem('orderData')
  }, [data, addOrder, clearCart])

  if (!data) return <Navigate to="/cart" replace />

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center size-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="size-12 text-green-500" />
          </div>

          <h1 className="text-3xl md:text-4xl mb-4 text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg mb-8">Thank you for your order!</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="size-5 text-pink-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 mb-1">Confirmation Email Sent</p>
                <p className="text-sm text-gray-600">
                  A confirmation email has been sent to {user?.email || 'your email address'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="size-5 text-pink-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 mb-1">Delivery Scheduled</p>
                <p className="text-sm text-gray-600">
                  {new Date(data.deliveryDetails.deliveryDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {data.deliveryDetails.address}, {data.deliveryDetails.city},{' '}
                  {data.deliveryDetails.zipCode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="size-5 text-pink-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 mb-1">Order Items</p>
                <div className="text-sm text-gray-600 space-y-1">
                  {data.items.map((item) => (
                    <div key={item.id}>
                      {item.quantity} × {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>${data.pricing.subtotal.toFixed(2)}</span>
            </div>
            {data.pricing.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({data.promoCode})</span>
                <span>-${data.pricing.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span><span>${data.pricing.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span><span>${data.pricing.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span><span>${data.pricing.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {user && (
              <Link
                to="/account"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                View Order History
              </Link>
            )}
            <Link
              to="/shop"
              className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
