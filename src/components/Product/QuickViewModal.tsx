import { motion, AnimatePresence } from 'framer-motion'
import type { ShopifyProduct } from '../../types/shopify.types'
import { useCart } from '../../contexts/CartContext'
import { useState, useEffect } from 'react'
import GlassyButton from '../ui/GlassyButton'

interface QuickViewModalProps {
  product: ShopifyProduct | null
  isOpen: boolean
  onClose: () => void
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart()
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  // Reset state when product changes
  useEffect(() => {
    setSelectedVariantIndex(0)
    setQuantity(1)
  }, [product])

  if (!product) return null

  const selectedVariant = product.variants[selectedVariantIndex]
  const price = parseFloat(selectedVariant.price.amount)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedVariant.price.currencyCode,
  }).format(price)

  const mainImage = product.images[0]?.url || '/placeholder-product.jpg'
  const isAvailable = selectedVariant.availableForSale

  const handleAddToCart = async () => {
    if (!isAvailable) return

    setIsAdding(true)

    addToCart({
      variantId: selectedVariant.id,
      productId: product.id,
      title: product.title,
      variant: selectedVariant.title,
      price,
      image: mainImage,
      quantity,
    })

    // Show feedback then close
    setTimeout(() => {
      setIsAdding(false)
      onClose()
    }, 800)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5">
                <img
                  src={mainImage}
                  alt={product.images[0]?.altText || product.title}
                  className="w-full h-full object-cover"
                />
                {!isAvailable && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-6 py-3 bg-red-500 text-white text-lg font-bold rounded-full">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold text-white mb-4">{product.title}</h2>

                <div className="text-3xl font-bold text-white mb-6">{formattedPrice}</div>

                {product.description && (
                  <p className="text-gray-300 mb-6 line-clamp-4">
                    {product.description.replace(/<[^>]*>/g, '')}
                  </p>
                )}

                {/* Variant Selector */}
                {product.variants.length > 1 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Select Option
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant, index) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariantIndex(index)}
                          disabled={!variant.availableForSale}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedVariantIndex === index
                              ? 'bg-white text-black'
                              : variant.availableForSale
                              ? 'bg-white/10 text-white hover:bg-white/20'
                              : 'bg-gray-800 text-gray-600 cursor-not-allowed line-through'
                          }`}
                        >
                          {variant.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold text-white w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-3">
                  <GlassyButton
                    onClick={handleAddToCart}
                    variant="light"
                    className="w-full"
                    background={!isAvailable || isAdding ? 'rgba(55, 65, 81, 0.5)' : undefined}
                    hoverBackground={!isAvailable || isAdding ? 'rgba(55, 65, 81, 0.5)' : undefined}
                    textColor={!isAvailable || isAdding ? 'rgb(107, 114, 128)' : undefined}
                  >
                    {isAdding ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Adding to Cart...
                      </span>
                    ) : !isAvailable ? (
                      'Sold Out'
                    ) : (
                      'Add to Cart'
                    )}
                  </GlassyButton>

                  <GlassyButton
                    href={`/product/${product.handle}`}
                    variant="primary"
                    className="w-full"
                    background="rgba(255, 255, 255, 0.1)"
                    hoverBackground="rgba(255, 255, 255, 0.2)"
                  >
                    View Full Details
                  </GlassyButton>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
