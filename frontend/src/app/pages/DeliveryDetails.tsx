import { useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Calendar, MapPin, MessageSquare } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import type { DeliveryDetails as DeliveryData } from '../types'

const tomorrow = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}
const maxDate = () => {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
}

export function DeliveryDetails() {
  const { items } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<DeliveryData>({
    defaultValues: {
      recipientName: user ? `${user.first_name} ${user.last_name}`.trim() : '',
      address: '',
      city: '',
      zipCode: '',
      deliveryDate: '',
      specialInstructions: '',
      giftMessage: '',
    },
  })

  if (items.length === 0) return <Navigate to="/cart" replace />

  const onSubmit = (data: DeliveryData) => {
    sessionStorage.setItem('deliveryDetails', JSON.stringify(data))
    navigate('/checkout/payment')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[
            { n: 1, label: 'Delivery', active: true },
            { n: 2, label: 'Payment', active: false },
            { n: 3, label: 'Confirm', active: false },
          ].map(({ n, label, active }, i, arr) => (
            <div key={n} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`size-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    active ? 'bg-pink-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {n}
                </div>
                <span className={`ml-2 text-sm font-medium ${active ? 'text-pink-500' : 'text-gray-600'}`}>
                  {label}
                </span>
              </div>
              {i < arr.length - 1 && <div className="w-16 h-0.5 bg-gray-300 mx-2" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl mb-6 text-gray-900">Delivery Information</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name *</label>
              <input
                {...register('recipientName', { required: 'Required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {errors.recipientName && <p className="text-red-500 text-xs mt-1">{errors.recipientName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline size-4 mr-1" />
                Delivery Address *
              </label>
              <input
                {...register('address', { required: 'Required' })}
                placeholder="Street address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  {...register('city', { required: 'Required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                <input
                  {...register('zipCode', { required: 'Required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline size-4 mr-1" />
                Delivery Date *
              </label>
              <input
                type="date"
                {...register('deliveryDate', { required: 'Required' })}
                min={tomorrow()}
                max={maxDate()}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {errors.deliveryDate && <p className="text-red-500 text-xs mt-1">{errors.deliveryDate.message}</p>}
              <p className="text-sm text-gray-500 mt-1">Schedule delivery up to 30 days in advance</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Delivery Instructions (Optional)
              </label>
              <textarea
                {...register('specialInstructions')}
                rows={3}
                placeholder="e.g., Leave at front door, Call before delivery"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline size-4 mr-1" />
                Add Gift Message (Optional)
              </label>
              <textarea
                {...register('giftMessage')}
                rows={3}
                placeholder="Your personalized message for the recipient"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
