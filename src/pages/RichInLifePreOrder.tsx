import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPreorderProducts = async () => {
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
        console.error('Failed to fetch pre-order products:', err)
        setError('Unable to load pre-order items. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchPreorderProducts()
  }, [])

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const faqs = [
    {
      question: "When am I charged?",
      answer: "At checkout, today. This secures your piece in our single production run."
    },
    {
      question: "When does it ship?",
      answer: "By mid-July, after we produce the items in one run following the close of the order window."
    },
    {
      question: "How do I use the early-bird discount?",
      answer: "Enter RICH10 at checkout for 10% off. This code is available during the pre-order window only."
    },
    {
      question: "Can I cancel?",
      answer: "The statutory 14-day right of withdrawal applies from delivery — if you need to make changes, just reach out to support@perfectworld.global."
    },
    {
      question: "Why pre-order?",
      answer: "So we produce to match demand exactly. This ensures no overproduction, a much smaller environmental footprint, and more profit left directly for the cause."
    }
  ]

  const burgundyProduct = products.find(p => p.handle.includes('burgundy') || p.handle.includes('red-brown'))
  const burgundyImage = burgundyProduct?.images[0]?.url || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop'
  
  const blackProduct = products.find(p => p.handle.includes('black'))
  const blackImage = blackProduct?.images[1]?.url || blackProduct?.images[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop'

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
            <span className="text-xs md:text-sm tracking-[0.25em] text-[#A98467] font-bold uppercase block">
              NEW CAMPAIGN DROP
            </span>
            <h1 
              className="text-6xl md:text-8xl font-bold tracking-tight text-[#2C2621]"
              style={{ fontFamily: '"Shadows Into Light", cursive', paddingTop: '10px', paddingBottom: '10px' }}
            >
              Rich in Life
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[#7D6B5D] max-w-2xl mx-auto leading-relaxed">
              Wealth you can't buy. A new collection, a shared idea, a cause behind every thread.
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
              Pre-order now
            </button>
            <p className="text-xs text-[#7D6B5D] tracking-wide">
              Drops 07.07 · Produced to demand, never overstocked
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 md:px-8 border-t border-[#F0EAE1]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-primary text-[#2C2621]">
              How the pre-order works
            </h2>
            <p className="text-sm text-[#A98467] tracking-widest uppercase font-semibold">
              Three simple steps to no waste
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
            {/* Step 1 */}
            <div className="space-y-4 p-6 bg-[#F5F2EB]/40 rounded-3xl border border-[#F0EAE1]">
              <div className="w-12 h-12 rounded-full bg-[#A98467] text-white flex items-center justify-center font-bold text-lg mx-auto md:mx-0">
                1
              </div>
              <h3 className="text-xl font-bold text-[#2C2621]">Order</h3>
              <p className="text-[#5C534C] text-sm leading-relaxed">
                Place your pre-order during the window. You're charged today.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 p-6 bg-[#F5F2EB]/40 rounded-3xl border border-[#F0EAE1]">
              <div className="w-12 h-12 rounded-full bg-[#A98467] text-white flex items-center justify-center font-bold text-lg mx-auto md:mx-0">
                2
              </div>
              <h3 className="text-xl font-bold text-[#2C2621]">We produce</h3>
              <p className="text-[#5C534C] text-sm leading-relaxed">
                After the window closes on 07.07, we produce the collection in one run, sized to exactly what was ordered.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 p-6 bg-[#F5F2EB]/40 rounded-3xl border border-[#F0EAE1]">
              <div className="w-12 h-12 rounded-full bg-[#A98467] text-white flex items-center justify-center font-bold text-lg mx-auto md:mx-0">
                3
              </div>
              <h3 className="text-xl font-bold text-[#2C2621]">It ships</h3>
              <p className="text-[#5C534C] text-sm leading-relaxed">
                Your piece arrives as soon as possible (with production beginning in the first 2nd week of July!)
              </p>
            </div>
          </div>

          <div className="text-center mt-12 pt-6 border-t border-[#F0EAE1]/80">
            <p className="text-base font-semibold text-[#A98467] italic tracking-wide">
              No overproduction. Nothing wasted. More left for the cause.
            </p>
          </div>
        </div>
      </section>

      {/* The Design Section */}
      <section className="py-24 px-4 md:px-8 bg-[#F5F2EB]/40 border-t border-[#F0EAE1]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs tracking-[0.2em] text-[#A98467] font-semibold uppercase block">
                THE ARTWORK
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2621] font-primary">
                A small world, hand-drawn
              </h2>
              <p className="text-[#5C534C] text-base leading-relaxed">
                Inside the circle is a map of what "rich in life" actually means: a sun, an Andean condor, mountains, a winding river — and two people walking it together. Nature, the journey, and the people you walk it with. The condor and the sun are a quiet nod to Colombia, where this collection's cause lives. It's not a logo. It's a reminder of what's worth being rich in.
              </p>
              <div className="p-4 rounded-xl bg-white border border-[#F0EAE1] text-xs text-[#7D6B5D] leading-relaxed italic">
                Note: Both colourways feature premium finishes — available in Maroon front print and Black back print.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-md border border-[#F0EAE1] relative group">
                <img 
                  src={burgundyImage} 
                  alt="Maroon front print mockup" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-white text-[10px] uppercase font-semibold">
                  Maroon Front Print
                </div>
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-md border border-[#F0EAE1] relative group">
                <img 
                  src={blackImage} 
                  alt="Black back print mockup" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-white text-[10px] uppercase font-semibold">
                  Black Back Print
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Purpose */}
      <section className="py-24 px-4 md:px-8 border-t border-[#F0EAE1] text-center bg-[#FDFBF7]">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-xs tracking-[0.2em] text-[#A98467] font-semibold uppercase block">
            OUR PROMISE
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C2621] font-primary">
            A brand that keeps none of the profit
          </h2>
          <p className="text-[#5C534C] text-lg leading-relaxed max-w-2xl mx-auto">
            Perfect World runs on one rule: <strong>100% of profit, after production, goes to the cause</strong>. Not a percentage. Not "a portion." All of it. For Rich in Life, that cause is <strong>Mission Positivity</strong> — funding education for children in rural Colombia. You buy a piece. We make it. The profit moves the mission.
          </p>
          <p className="font-semibold text-black text-lg pt-4">
            Together. Not Alone.
          </p>
        </div>
      </section>

      {/* Products Collection Grid */}
      <section ref={productsRef} className="py-24 px-4 md:px-8 border-t border-[#F0EAE1] bg-[#F5F2EB]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-primary text-[#2C2621]">
              The Pre-Order Collection
            </h2>
            <p className="text-[#5C534C] text-sm md:text-base max-w-xl mx-auto">
              Select a piece below to secure your pre-order. 10% off is auto-applied at checkout.
            </p>
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

      {/* FAQ Accordion */}
      <section className="py-24 px-4 md:px-8 border-t border-[#F0EAE1] bg-[#FDFBF7]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-primary text-[#2C2621]">
              FAQ
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index
              return (
                <div 
                  key={index} 
                  className="border-b border-[#F0EAE1] pb-4 transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between py-4 text-left font-semibold text-lg text-[#2C2621] hover:text-[#A98467] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <svg 
                      className={`w-5 h-5 text-[#A98467] transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-[#5C534C] text-sm leading-relaxed pb-4 pr-6">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
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
