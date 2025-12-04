import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { ShopifyProduct } from '../../types/shopify.types'
import { useCart } from '../../contexts/CartContext'
import { extractBaseName, extractColorFromTitle, extractProductType } from '../../utils/productGrouping'
import GlassyButton from '../ui/GlassyButton'

// Color name to hex code mapping
const COLOR_MAP: Record<string, string> = {
  'black': '#000000',
  'white': '#FFFFFF',
  'navy': '#001f3f',
  'french navy': '#0F4C81',
  'navy blue': '#000080',
  'blue': '#0074D9',
  'worker blue': '#5B9BD5',
  'sky blue': '#87CEEB',
  'light blue': '#ADD8E6',
  'royal blue': '#4169E1',
  'blue soul': '#5BA3D0',
  'indian grey': '#9E9E9E',
  'anthracite': '#3D3D3D',
  'grey': '#808080',
  'gray': '#808080',
  'heather grey': '#A9A9A9',
  'green': '#2ECC40',
  'green bay': '#2ECC71',
  'forest green': '#228B22',
  'olive green': '#808000',
  'kelly green': '#4CBB17',
  'red': '#FF4136',
  'fiesta': '#DD4B39',
  'bright orange': '#FF6600',
  'burgundy': '#800020',
  'maroon': '#800000',
  'pink': '#FF69B4',
  'purple': '#B10DC9',
  'orange': '#FF851B',
  'yellow': '#FFDC00',
  'brown': '#8B4513',
  'beige': '#F5F5DC',
  'khaki': '#C3B091',
  'cream': '#FFFDD0',
  'ivory': '#FFFFF0',
  'charcoal': '#36454F',
  'natural': '#F5F5DC',
  'multi': 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFA07A)',
}

interface ProductCardWithColorsProps {
  product: ShopifyProduct | null
  siblings: ShopifyProduct[]
  onQuickView?: (product: ShopifyProduct) => void
  isLightMode?: boolean
}

export default function ProductCardWithColors({
  product,
  siblings,
}: ProductCardWithColorsProps) {
  const { addToCart } = useCart()
  const [hoveredProduct, setHoveredProduct] = useState<ShopifyProduct | null>(null)
  const [isHoveringCard, setIsHoveringCard] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Show hovered product's image, or default product
  const displayProduct = hoveredProduct || product

  if (!product) {
    return (
      <div className="aspect-[3/4] rounded-2xl bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400 text-sm">No product available</p>
      </div>
    )
  }

  const price = parseFloat(product.priceRange.minVariantPrice.amount)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode,
  }).format(price)

  // Extract base name without color for cleaner display
  const baseName = extractBaseName(product.title)
  const productType = extractProductType(product.title)

  // Use second image (back design) for Wild at Heart products, first image for others
  const isWildAtHeart = product.title.toLowerCase().includes('wild at heart')
  const imageIndex = isWildAtHeart ? 1 : 0
  const displayImage = displayProduct?.images[imageIndex]?.url || displayProduct?.images[0]?.url || product.images[imageIndex]?.url || product.images[0]?.url || '/placeholder-product.jpg'
  const isAvailable = product.availableForSale && product.variants.some((v) => v.availableForSale)

  // Product type badge
  const typeBadge = productType === 'tshirt' ? 'T-SHIRT' :
    productType === 'hoodie' ? 'HOODIE' :
      productType === 'tote' ? 'TOTE BAG' : ''

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
        image: product.images[0]?.url || '',
        quantity: 1,
      })
    }

    // Show feedback
    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <motion.div
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 bg-white border border-gray-100 shadow-sm hover:shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHoveringCard(true)}
      onHoverEnd={() => {
        setIsHoveringCard(false)
        setHoveredProduct(null)
      }}
    >
      {/* Product Image with AnimatePresence for smooth transitions */}
      <div
        className="block cursor-pointer"
        onClick={() => window.location.href = `/product/${displayProduct?.handle || product.handle}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            <motion.img
              key={displayProduct?.id || product.id}
              src={displayImage}
              alt={displayProduct?.images[0]?.altText || displayProduct?.title || product.title}
              className="w-full h-full object-contain p-4"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {/* Product Type Badge - Glassy Style */}
          {typeBadge && (
            <div className="absolute top-4 left-4 pointer-events-none">
              <GlassyButton
                variant="light"
                fontSize="11px"
                fontWeight={700}
                paddingX="14px"
                paddingY="6px"
                borderRadius={20}
                blur={12}
                background="rgba(255, 255, 255, 0.15)"
                hoverBackground="rgba(255, 255, 255, 0.15)"
                textColor="#000000"
              >
                {typeBadge}
              </GlassyButton>
            </div>
          )}

          {/* Availability Badge */}
          {!isAvailable && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
              Sold Out
            </div>
          )}

          {/* Color Selector Overlay - Visible on card hover - Glassy Style */}
          {siblings.length > 0 && (
            <div
              className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${isHoveringCard ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <div className="flex flex-wrap gap-10 justify-center">
                {siblings.map((sibling) => {
                  const colorName = extractColorFromTitle(sibling.title)
                  const colorKey = colorName.toLowerCase()
                  const colorValue = COLOR_MAP[colorKey] || '#808080'
                  const isCurrentProduct = sibling.id === product.id
                  const isHovered = hoveredProduct?.id === sibling.id

                  return (
                    <Link
                      key={sibling.id}
                      to={`/product/${sibling.handle}`}
                      className={`group relative transition-all duration-200 ${isHovered ? 'scale-125' : 'scale-100'
                        }`}
                      onMouseEnter={(e) => {
                        e.preventDefault()
                        setHoveredProduct(sibling)
                      }}
                      onMouseLeave={(e) => {
                        e.preventDefault()
                        setHoveredProduct(null)
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      title={colorName}
                    >
                      {/* Color swatch circle - Enhanced Glassy Style */}
                      <div className="relative">
                        <div
                          className={`w-12 h-12 rounded-full transition-all duration-300 ${isCurrentProduct
                              ? 'ring-2 ring-white/90 ring-offset-2 ring-offset-black/60 shadow-xl scale-110'
                              : 'ring-1 ring-white/50 hover:ring-2 hover:ring-white/90 hover:scale-110 hover:shadow-xl'
                            }`}
                          style={{
                            background: colorValue,
                            boxShadow: isCurrentProduct
                              ? '0 6px 16px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
                              : '0 4px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
                            backdropFilter: 'blur(8px)',
                          }}
                        >
                          {/* Inner highlight for glass effect */}
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)',
                              pointerEvents: 'none',
                            }}
                          />
                        </div>
                      </div>
                      {/* Tooltip with color name on hover - Enhanced Glassy Style */}
                      <div className="absolute -top-11 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                        <div className="px-3 py-1.5 bg-white/15 backdrop-blur-lg border border-white/30 text-white text-xs rounded-full whitespace-nowrap shadow-xl font-semibold">
                          {colorName}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <Link to={`/product/${product.handle}`}>
          <h3 className="text-lg font-bold mb-2 line-clamp-2 transition-colors font-primary text-gray-900 group-hover:text-blue-600">
            {baseName}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">
            {formattedPrice}
          </span>

          <GlassyButton
            onClick={handleAddToCart}
            variant="dark"
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

        {/* Color indicator text */}
        {siblings.length > 0 && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            {siblings.length} color{siblings.length !== 1 ? 's' : ''} available • Hover to preview
          </p>
        )}
      </div>
    </motion.div>
  )
}
