import { Navigate, Link } from 'react-router-dom'
import { Package, User, MapPin, Calendar, CheckCircle, Clock } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export function Account() {
  const { user, orders, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  const statusStyle: Record<string, string> = {
    confirmed: 'text-green-600 bg-green-50',
    pending: 'text-yellow-600 bg-yellow-50',
    delivered: 'text-blue-600 bg-blue-50',
    cancelled: 'text-red-600 bg-red-50',
    processing: 'text-purple-600 bg-purple-50',
    shipped: 'text-indigo-600 bg-indigo-50',
  }

  const displayName = user
    ? `${user.first_name} ${user.last_name}`.trim() || user.email
    : ''

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl mb-8 text-gray-900">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <User className="size-8 text-pink-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h2>

              {sortedOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="size-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <Link
                    to="/shop"
                    className="inline-block bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-pink-300 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Order #{order.reference || order.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusStyle[order.status] ?? 'text-gray-600 bg-gray-50'}`}
                        >
                          {order.status === 'confirmed' ? (
                            <CheckCircle className="size-4" />
                          ) : (
                            <Clock className="size-4" />
                          )}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="size-4" />
                          <span>Delivery: {new Date(order.delivery_date).toLocaleDateString()}</span>
                        </div>
                        {(order.delivery_street || order.delivery_city) && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="size-4" />
                            <span className="truncate">
                              {[order.delivery_street, order.delivery_city].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-200 pt-3">
                        <div className="space-y-1 mb-2">
                          {order.items.map((item, i) => (
                            <p key={i} className="text-sm text-gray-600">
                              {item.quantity} × {item.product_name}
                            </p>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">
                            ${parseFloat(order.total).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
