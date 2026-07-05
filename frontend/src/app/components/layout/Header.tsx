import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Flower2, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

export function Header() {
  const itemCount = useCartStore((s) => s.itemCount())
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const displayName = user
    ? `${user.first_name} ${user.last_name}`.trim() || user.email
    : ''

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Flower2 className="size-8 text-pink-500" />
            <span className="text-xl font-semibold text-gray-900">Lily's Florist</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-pink-500 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-pink-500 transition-colors">
              Shop
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-pink-500 transition-colors">
              About
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/account"
                  className="flex items-center gap-2 text-gray-700 hover:text-pink-500 transition-colors"
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline text-sm">{displayName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-pink-500 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="size-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-gray-700 hover:text-pink-500 transition-colors"
              >
                <User className="size-5" />
                <span className="hidden sm:inline text-sm">Sign in</span>
              </Link>
            )}

            <Link to="/cart" className="relative" data-testid="cart-icon">
              <ShoppingCart className="size-6 text-gray-700 hover:text-pink-500 transition-colors" />
              {itemCount > 0 && (
                <span
                  data-testid="cart-badge"
                  className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full size-5 flex items-center justify-center font-medium"
                >
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/cart" className="relative">
              <ShoppingCart className="size-6 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col px-4 py-3 gap-3">
            <Link to="/" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">Home</Link>
            <Link to="/shop" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">Shop</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">About</Link>
            <hr className="border-gray-200" />
            {isAuthenticated ? (
              <>
                <Link to="/account" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">My Account</Link>
                <button onClick={handleLogout} className="py-2 text-left text-gray-700">Sign out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">Sign in</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
