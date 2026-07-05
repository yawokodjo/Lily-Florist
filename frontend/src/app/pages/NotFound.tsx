import { Link } from 'react-router-dom'
import { Flower2 } from 'lucide-react'

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Flower2 className="size-16 text-pink-300 mx-auto mb-4" />
        <h1 className="text-6xl font-semibold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-md hover:bg-pink-600 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}
