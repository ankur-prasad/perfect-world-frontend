import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Navigation from '../components/Layout/Navigation'
import Footer from '../components/Layout/Footer'
import ProductCard from '../components/Product/ProductCard'
import QuickViewModal from '../components/Product/QuickViewModal'
import { getCollectionProducts } from '../utils/shopify'
import type { ShopifyProduct } from '../types/shopify.types'

export default function RichInLifePreOrder() {
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null)

  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const collection = await getCollectionProducts('rich-in-life')
        if (collection && collection.products) {
          const taggedProducts = collection.products.map((product) => ({
            ...product,
            collectionHandle: 'rich-in-life',
            collectionName: 'Mission Positivity',
            collectionColor: '#D4A373',
          }))
          setProducts(taggedProducts)
        }
      } catch (err) {
        console.error('Failed to fetch Rich in Life products:', err)
        setError('Unable to load the collection. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2621]">
      <Navigation isDarkContent={true} />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 px-4 md:px-8 bg-gradient-to-b from-[#F5F2EB] to-[#FDFBF7]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1
              className="text-6xl md:text-8xl font-bold tracking-tight text-[#2C2621]"
              style={{ fontFamily: '"Shadows Into Light", cursive', paddingTop: '10px', paddingBottom: '10px' }}
            >
              Rich in Life
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[#7D6B5D] max-w-2xl mx-auto leading-relaxed">
              Rich isn't a number in your bank account.
            </p>
            <p className="text-base md:text-lg text-[#7D6B5D] max-w-2xl mx-auto">
              The new collection — created with Mission Positivity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-4 pt-4"
          >
            <button
              onClick={scrollToProducts}
              className="px-10 py-4 bg-[#2C2621] text-white rounded-full font-semibold text-lg hover:bg-[#473E36] active:scale-[0.98] transition-all shadow-xl"
            >
              Shop the Collection
            </button>
            <p className="text-xs text-[#7D6B5D] tracking-wide">
              100% of profits donated · Organic Stanley Stella · Produced in Germany
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro - above the product grid */}
      <section className="py-24 px-4 md:px-8 border-t border-[#F0EAE1]">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-primary text-[#2C2621]">
            One shirt can't change the world. But here's what it can do.
          </h2>
          <p className="text-[#5C534C] text-lg leading-relaxed">
            Every piece in this collection funds education for children in the rural Colombian
            villages of Paya, Milagros and La Unión — together with our partners at Mission
            Positivity. Not a percentage. Not "a portion of proceeds." 100% of profits, always.
          </p>
          <p className="text-lg font-semibold text-[#2C2621]">
            You wear it. A kid goes to school. That's the whole business model.
          </p>
        </div>
      </section>

      {/* Products Collection Grid */}
      <section ref={productsRef} className="py-24 px-4 md:px-8 border-t border-[#F0EAE1] bg-[#F5F2EB]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-primary text-[#2C2621]">
              The Collection
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-[#F0EAE1] border-t-[#2C2621] animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center text-[#7D6B5D] py-20">
              No products found in the collection.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedProduct}
                  themeColor="#D4A373"
                  isLightMode={true}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works - below the grid */}
      <section className="py-24 px-4 md:px-8 border-t border-[#F0EAE1]">
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-primary text-[#2C2621]">
              Made when it's wanted. Not before.
            </h2>
            <p className="text-[#5C534C] text-lg leading-relaxed">
              We produce in batches to avoid overproduction and waste — no warehouses full of
              unsold stock. Your piece is printed here in Germany and ships within 7–10 days
              of your order.
            </p>
          </div>

          <div className="text-center space-y-6 pt-8 border-t border-[#F0EAE1]/80">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-primary text-[#2C2621]">
              Where your money actually goes
            </h2>
            <p className="text-[#5C534C] text-lg leading-relaxed">
              Every order from this collection supports school materials, teaching and
              educational programs for children in rural Colombia.
            </p>
            <p className="text-[#5C534C] text-lg leading-relaxed">
              Rich in Life is what it sounds like: the idea that being rich has nothing to do
              with what you own — and everything to do with what you give.
            </p>
            <p className="font-semibold text-black text-lg pt-4">
              Together. Not Alone.
            </p>
            <div className="pt-6">
              <button
                onClick={scrollToProducts}
                className="px-10 py-4 bg-[#2C2621] text-white rounded-full font-semibold text-lg hover:bg-[#473E36] active:scale-[0.98] transition-all shadow-xl"
              >
                Shop the Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
