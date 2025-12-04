import { motion } from 'framer-motion'
import type { ShopifyProduct } from '../../types/shopify.types'
import { useCart } from '../../contexts/CartContext'
import { useState } from 'react'
import GlassyButton from '../ui/GlassyButton'

interface ProductCardProps {
  product: ShopifyProduct
  onQuickView?: (product: ShopifyProduct) => void
  themeColor?: string
  isLightMode?: boolean
}

export default function ProductCard({ product, onQuickView, themeColor = '#3498DB', isLightMode = false }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const price = parseFloat(product.priceRange.minVariantPrice.amount)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode,
  }).format(price)

  const mainImage = product.images[0]?.url || '/placeholder-product.jpg'
  const isAvailable = product.availableForSale && product.variants.some((v) => v.availableForSale)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAvailable) return

    setIsAdding(true)

    // Find first available variant
    const availableVariant = product.variants.find((v) => v.availableForSale)

    if (availableVariant) {
      addToCart({
        variantId: availableVariant.id,
        productId: product.id,
        title: product.title,
        variant: availableVariant.title,
        price: parseFloat(availableVariant.price.amount),
        image: mainImage,
        quantity: 1,
      })
    }

    // Show feedback
    setTimeout(() => setIsAdding(false), 1000)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product)
  }

  return (
    <motion.div
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isLightMode
          ? 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
          : 'bg-white/5 backdrop-blur-sm hover:bg-white/10'
        }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onClick={() => window.location.href = `/product/${product.handle}`}
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={mainImage}
          alt={product.images[0]?.altText || product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Quick View Button */}
          {onQuickView && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all duration-300">
              <GlassyButton
                label="Quick View"
                onClick={handleQuickView}
                variant="light"
              />
            </div>
          )}
        </div>

        {/* Availability Badge */}
        {!isAvailable && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
            Sold Out
          </div>
        )}

        {/* Theme Color Accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: themeColor }}
        />
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className={`text-lg font-bold mb-2 line-clamp-2 transition-colors font-primary ${isLightMode ? 'text-gray-900 group-hover:text-blue-600' : 'text-white group-hover:text-gray-200'
          }`}>
          {product.title}
        </h3>

        {product.description && (
          <p className={`text-sm mb-4 line-clamp-2 ${isLightMode ? 'text-gray-600' : 'text-gray-400'
            }`}>
            {product.description.replace(/<[^>]*>/g, '')}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className={`text-xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'
            }`}>
            {formattedPrice}
          </span>

          <GlassyButton
            onClick={handleAddToCart}
            variant={isLightMode ? 'dark' : 'light'}
            background={!isAvailable || isAdding ? 'rgba(107, 114, 128, 0.3)' : undefined}
            hoverBackground={!isAvailable || isAdding ? 'rgba(107, 114, 128, 0.3)' : undefined}
            textColor={!isAvailable || isAdding ? 'rgb(156, 163, 175)' : undefined}
          >
            {isAdding ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                Adding...
              </span>
            ) : !isAvailable ? (
              'Sold Out'
            ) : (
              'Add to Cart'
            )}
          </GlassyButton>
        </div>
      </div>
    </motion.div>
  )
}
