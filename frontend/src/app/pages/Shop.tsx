import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { products, categories } from '../data/products'
import { ProductCard } from '../components/features/ProductCard'

export function Shop() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    const min = priceRange.min ? parseFloat(priceRange.min) : 0
    const max = priceRange.max ? parseFloat(priceRange.max) : Infinity
    filtered = filtered.filter((p) => p.price >= min && p.price <= max)

    return filtered
  }, [searchQuery, selectedCategory, priceRange])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2 text-gray-900">Shop All Flowers</h1>
          <p className="text-gray-600">
            Browse our complete collection of fresh flowers and arrangements
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for flowers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="size-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange((p) => ({ ...p, max: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  onClick={() => setPriceRange({ min: '', max: '' })}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4 text-sm">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>

        {filteredProducts.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-testid="product-grid"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No products found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
