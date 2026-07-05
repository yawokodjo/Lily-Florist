import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { CreditCard, Tag, AlertCircle } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

const PROMO_CODES: Record<string, number> = {
  SAVE10: 10,
  SPRING15: 15,
  WELCOME20: 20,
  LILY25: 25,
}

function formatCard(value: string) {
  return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
}
function formatExpiry(value: string) {
  return value.replace(/\D/g, '').replace(/^(.{2})/, '$1/').slice(0, 5)
}

export function Payment() {
  const { items, total } = useCartStore()
  const navigate = useNavigate()

  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [promo, setPromo] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; pct: number } | null>(null)
  const [promoError, setPromoError] = useState('')

  if (items.length === 0) return <Navigate to="/cart" replace />
  const delivery = sessionStorage.getItem('deliveryDetails')
  if (!delivery) return <Navigate to="/checkout/delivery" replace />

  const subtotal = total()
  const deliveryFee = 10
  const discount = appliedPromo ? (subtotal * appliedPromo.pct) / 100 : 0
  const tax = (subtotal - discount) * 0.08
  const orderTotal = subtotal - discount + deliveryFee + tax

  const applyPromo = () => {
    const code = promo.toUpperCase()
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, pct: PROMO_CODES[code] })
      setPromoError('')
    } else {
      setPromoError('Invalid or expired promo code')
      setAppliedPromo(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const orderData = {
      deliveryDetails: JSON.parse(delivery),
      items,
      pricing: { subtotal, deliveryFee, tax, discount, total: orderTotal },
      promoCode: appliedPromo?.code,
    }
    sessionStorage.setItem('orderData', JSON.stringify(orderData))
    navigate('/checkout/confirmation')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {(
            [
              { n: 1, label: 'Delivery', done: true, active: false },
              { n: 2, label: 'Payment', done: false, active: true },
              { n: 3, label: 'Confirm', done: false, active: false },
            ] satisfies Array<{ n: number; label: string; done: boolean; active: boolean }>
          ).map(({ n, label, done, active }, i, arr) => (
            <div key={n} className="flex items-center">
              <div className="flex items-center">
                <div className={`size-8 rounded-full flex items-center justify-center text-sm font-medium ${done || active ? 'bg-pink-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {n}
                </div>
                <span className={`ml-2 text-sm font-medium ${done || active ? 'text-pink-500' : 'text-gray-600'}`}>{label}</span>
              </div>
              {i < arr.length - 1 && <div className="w-16 h-0.5 bg-gray-300 mx-2" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="size-6 text-gray-600" />
              <h1 className="text-2xl text-gray-900">Payment Details</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={card.name}
                  onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  value={card.number}
                  onChange={(e) => setCard((c) => ({ ...c, number: formatCard(e.target.value) }))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                  <input
                    type="text"
                    required
                    value={card.expiry}
                    onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={4}
                    value={card.cvv}
                    onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '') }))}
                    placeholder="123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* Promo code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline size-4 mr-1" />
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    disabled={!!appliedPromo}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={() => { setAppliedPromo(null); setPromo('') }}
                      className="px-4 py-2 text-red-500 border border-red-300 rounded-md hover:bg-red-50"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {promoError && (
                  <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="size-3" /> {promoError}
                  </p>
                )}
                {appliedPromo && (
                  <p className="text-green-600 text-xs mt-1">
                    ✓ {appliedPromo.code} — {appliedPromo.pct}% off applied
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/checkout/delivery')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.quantity} × {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-gray-600"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span><span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
