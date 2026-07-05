import { Flower2, Heart, Mail, Phone } from 'lucide-react'

export function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="text-center mb-12">
            <Flower2 className="size-16 text-pink-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl mb-4 text-gray-900">About Lily's Florist</h1>
            <p className="text-xl text-gray-600">
              Bringing beauty and joy through fresh flowers since 2015
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Welcome to Lily's Florist, your premier destination for fresh, beautiful flowers delivered daily.
              We take pride in hand-selecting each bloom to ensure you receive only the highest quality arrangements.
            </p>
            <p className="text-gray-600 mb-8">
              Whether you're celebrating a special occasion, expressing sympathy, or simply brightening someone's day,
              our expert florists create stunning arrangements that convey your sentiments perfectly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="bg-pink-50 rounded-lg p-6">
                <Heart className="size-10 text-pink-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To deliver fresh, beautiful flowers that bring smiles and create lasting memories for our customers and their loved ones.
                </p>
              </div>
              <div className="bg-pink-50 rounded-lg p-6">
                <Flower2 className="size-10 text-pink-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
                <p className="text-gray-600">
                  Every bouquet is crafted with care using the freshest flowers. We stand behind our quality with a 100% satisfaction guarantee.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-12">Contact Us</h2>
            <div className="space-y-4 not-prose">
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-pink-500" />
                <span className="text-gray-600">(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-pink-500" />
                <span className="text-gray-600">hello@lilysflorist.com</span>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hours of Operation</h3>
              <div className="space-y-1 text-gray-600">
                <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
                <p>Saturday: 10:00 AM – 5:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
