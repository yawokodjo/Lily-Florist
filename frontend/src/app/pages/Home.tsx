import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Truck, Phone } from 'lucide-react'
import { products } from '../data/products'
import { ProductCard } from '../components/features/ProductCard'

export function Home() {
  const featuredProducts = products.filter((p) => p.inStock).slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1719586901803-d3a5ef35b28f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920)',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl md:text-6xl mb-4">Fresh Flowers Delivered Daily</h1>
            <p className="text-xl mb-8 text-gray-200">
              Brighten someone's day with beautiful blooms from Lily's Florist
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-pink-500 text-white px-8 py-3 rounded-md hover:bg-pink-600 transition-colors text-lg"
            >
              Shop Now
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">Featured Products</h2>
          <p className="text-gray-600 text-lg">Our most popular arrangements, loved by customers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors"
          >
            View All Products
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Fresh & Beautiful',
                desc: 'Hand-picked flowers delivered fresh every day',
              },
              {
                icon: Truck,
                title: 'Same-Day Delivery',
                desc: 'Schedule delivery up to 30 days in advance',
              },
              {
                icon: Phone,
                title: '24/7 Support',
                desc: "We're here to help with any questions",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="inline-flex items-center justify-center size-16 bg-pink-100 rounded-full mb-4">
                  <Icon className="size-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
