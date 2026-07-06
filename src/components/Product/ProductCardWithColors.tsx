import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  'mocha': '#705335',
  'multi': 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFA07A)',
  'dusk': '#5f7682',
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
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
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
  const formattedPrice = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode,
  }).format(price)

  // Extract base name without color for cleaner display
  const baseName = extractBaseName(product.title)
  const productType = extractProductType(product.title)

  const displayImage = displayProduct?.images[0]?.url || product.images[0]?.url || '/placeholder-product.jpg'
  const isAvailable = product.availableForSale && product.variants.some((v) => v.availableForSale)

  // Product type badge
  const typeBadge = productType === 'tshirt' ? 'T-SHIRT' :
    productType === 'hoodie' ? 'HOODIE' :
      productType === 'tote' ? 'TOTE BAG' :
        productType === 'oversized' ? 'OVERSIZED SHIRT' : ''

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
        onClick={() => navigate(`/product/${displayProduct?.handle || product.handle}`)}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            <motion.img
              key={displayProduct?.id || product.id}
              src={displayImage}
              alt={displayProduct?.images[0]?.altText || displayProduct?.title || product.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain p-2 md:p-4"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {/* Product Type Badge - Glassy Style */}
          {typeBadge && (
            <div className="absolute top-2 left-2 md:top-4 md:left-4 pointer-events-none">
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
              {t('product.soldOut')}
            </div>
          )}

          {/* Color Selector Overlay - Visible on card hover - Glassy Style */}
          {siblings.length > 0 && (
            <div
              className={`hidden md:block absolute bottom-0 left-0 right-0 py-2.5 px-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 ${isHoveringCard ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
              <div className="flex flex-wrap gap-2 justify-center items-center">
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
                      className={`group/swatch relative transition-all duration-200 ${isHovered ? 'scale-110' : 'scale-100'
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
                          className={`w-7 h-7 rounded-full transition-all duration-300 ${isCurrentProduct
                              ? 'ring-2 ring-white/95 ring-offset-1 ring-offset-black/70 shadow-lg scale-105'
                              : 'ring-1 ring-white/40 hover:ring-2 hover:ring-white/95 hover:scale-105 hover:shadow-lg'
                            }`}
                          style={{
                            background: colorValue,
                            boxShadow: isCurrentProduct
                              ? '0 4px 10px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.2)'
                              : '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.2)',
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
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover/swatch:opacity-100 transition-all duration-200 pointer-events-none">
                        <div className="px-2 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] rounded-md whitespace-nowrap shadow-xl font-semibold">
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
      <div className="p-3 md:p-5">
        <Link to={`/product/${product.handle}`}>
          <h3 className="text-sm md:text-lg font-bold mb-1 line-clamp-2 transition-colors font-primary text-gray-900 group-hover:text-blue-600">
            {baseName}
          </h3>
        </Link>

        {/* Static color dots - always visible, no hover needed */}
        {siblings.length > 1 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {siblings.slice(0, 5).map((sibling) => {
              const colorKey = extractColorFromTitle(sibling.title).toLowerCase()
              return (
                <span
                  key={sibling.id}
                  className={`w-3 h-3 rounded-full ring-1 ring-gray-300 ${sibling.id === product.id ? 'ring-2 ring-gray-900' : ''}`}
                  style={{ background: COLOR_MAP[colorKey] || '#808080' }}
                />
              )
            })}
            {siblings.length > 5 && (
              <span className="text-[10px] text-gray-500">+{siblings.length - 5}</span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 md:mt-4">
          <span className="text-base md:text-xl font-bold text-gray-900">
            {formattedPrice}
          </span>

          <GlassyButton
            onClick={handleAddToCart}
            variant="dark"
            fontSize="13px"
            paddingX="16px"
            paddingY="8px"
            background={
              !isAvailable || isAdding
                ? 'rgba(107, 114, 128, 0.3)'
                : undefined
            }
            hoverBackground={
              !isAvailable || isAdding
                ? 'rgba(107, 114, 128, 0.3)'
                : undefined
            }
            textColor={
              !isAvailable || isAdding
                ? 'rgb(156, 163, 175)'
                : undefined
            }
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
                {t('product.adding')}
              </span>
            ) : !isAvailable ? (
              t('product.soldOut')
            ) : (
              t('product.addToCart')
            )}
          </GlassyButton>
        </div>

      </div>
    </motion.div>
  )
}
