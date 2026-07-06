import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'
import ProductCard from '../components/Product/ProductCard'
import { getProduct, getCollectionProducts, getAllProducts } from '../utils/shopify'
import type { ShopifyProduct } from '../types/shopify.types'
import { useCart } from '../contexts/CartContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { sanitizeHtml } from '../utils/sanitize'
import { extractColorFromTitle, extractProductType } from '../utils/productGrouping'
import { projects } from '../data/projects'

// Color name to hex code mapping (same as ProductCardWithColors)
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
  'dusk': '#5f7682',
}

interface ProductSpec {
  features: string[]
  composition: string
  care: string
}

function getProductSpecs(title: string): ProductSpec {
  const type = extractProductType(title)
  if (type === 'hoodie') {
    return {
      features: [
        'Double-layered hood in self-fabric',
        'Round drawcords in matching body colour with metal tipping',
        'Metal eyelets',
        'Inside single jersey back neck tape',
        'Self-fabric half moon at back neck',
        '1x1 rib at sleeve hem and bottom hem',
        'Flatlock topstitching on all seams',
        'Kangaroo pocket at front'
      ],
      composition: 'Shell: Brushed, 85% Cotton - Organic Ring Spun Combed, 15% Polyester - Recycled, Fabric washed, Light sueded, 350 G/M²',
      care: 'Wash similar colours together, no ironing on print, wash and iron inside out.'
    }
  } else if (type === 'oversized') {
    return {
      features: [
        'Set-in sleeves',
        'Dropped shoulders',
        '1x1 rib at collar',
        'Inside back neck tape in self-fabric',
        'Sleeve hem and bottom hem with wide double needle topstitch'
      ],
      composition: 'Shell: Single Jersey, 100% Cotton - Organic Combed Ring Spun / Heather Haze: 70% Organic Cotton - 30% Recycled Cotton, Combed Ring Spun, Fabric washed, 200 G/M²',
      care: 'Wash similar colours together, no ironing on print, wash and iron inside out.'
    }
  } else if (type === 'tote') {
    return {
      features: [
        'Top edge double folded for strength and clean finish',
        'Long handles with reinforced cross stitch',
        'Shaping seam at bottom to create volume'
      ],
      composition: 'Shell: Canvas, 80% Cotton - Recycled, 20% Polyester - Recycled, Fabric washed, 300 G/M²',
      care: 'Wash similar colours together, do not iron on print, wash and iron inside out.'
    }
  } else {
    // Default: T-Shirt
    return {
      features: [
        '1x1 rib at neckline',
        'Self-fabric back neck tape',
        'Set-in sleeves',
        'Twin-needle topstitching at sleeve cuffs and hem'
      ],
      composition: 'Shell: Single Jersey, 100% Cotton - Organic Combed Ring Spun / Heather Haze: 70% Organic Cotton - 30% Recycled Cotton, Combed Ring Spun, Fabric washed, 180 G/M²',
      care: 'Wash similar colours together, no ironing on print, wash and iron inside out.'
    }
  }
}

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { t, i18n } = useTranslation()

  const [product, setProduct] = useState<ShopifyProduct | null>(null)
  const [siblings, setSiblings] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([])
  const [globalProducts, setGlobalProducts] = useState<ShopifyProduct[]>([])

  usePageTitle(product?.title)

  useEffect(() => {
    setSelectedImageIndex(0)
    setSelectedVariantIndex(0)
    setQuantity(1)
    setIsSizeChartOpen(false)

    const fetchProduct = async () => {
      if (!handle) return

      setLoading(true)
      setError(null)

      try {
        const fetchedProduct = await getProduct(handle)
        if (fetchedProduct) {
          setProduct(fetchedProduct)



          // Fetch siblings using getAllProducts (which is cached and includes loose products)
          try {
            const allShopProducts = await getAllProducts()
            setGlobalProducts(allShopProducts)
            const currentType = extractProductType(fetchedProduct.title)
            
            // Find matching project for fetchedProduct
            const matchingProject = projects.find(project =>
              fetchedProduct.collections?.some(c => c.handle === project.shopifyCollection.handle) ||
              fetchedProduct.title.toLowerCase().includes(project.name.toLowerCase()) ||
              fetchedProduct.title.toLowerCase().includes(project.slug.replace(/-/g, ' ').toLowerCase())
            )

            const relatedProducts = allShopProducts.filter(p => {
              if (p.id === fetchedProduct.id) return false
              
              // Must be the same product type
              if (extractProductType(p.title) !== currentType) return false
              
              // Must belong to the same project or collection
              if (matchingProject) {
                const isMatch = p.collections?.some(c => c.handle === matchingProject.shopifyCollection.handle) ||
                                p.title.toLowerCase().includes(matchingProject.name.toLowerCase()) ||
                                p.title.toLowerCase().includes(matchingProject.slug.replace(/-/g, ' ').toLowerCase())
                return isMatch
              } else {
                // If no matching project, check if they share at least one collection
                const hasSharedCollection = p.collections?.some(pc => 
                  fetchedProduct.collections?.some(fc => fc.handle === pc.handle)
                )
                return hasSharedCollection || (
                  fetchedProduct.title.toLowerCase().includes('embroidered') && 
                  p.title.toLowerCase().includes('embroidered')
                )
              }
            })

            const allSiblings = [...relatedProducts, fetchedProduct].sort((a, b) => a.title.localeCompare(b.title))
            setSiblings(allSiblings)
          } catch (err) {
            console.warn('Failed to fetch sibling products:', err)
          }

          // Fetch related products from the same collection if available
          if (fetchedProduct.collectionHandle) {
            try {
              const collection = await getCollectionProducts(fetchedProduct.collectionHandle)
              if (collection && collection.products) {
                // Filter out current product and take first 4
                const related = collection.products
                  .filter((p) => p.id !== fetchedProduct.id)
                  .slice(0, 4)
                setRelatedProducts(related)
              }
            } catch (err) {
              console.error('Failed to fetch related products:', err)
            }
          }
        } else {
          setError('Product not found')
        }
      } catch (err) {
        console.error('Failed to fetch product:', err)
        setError('Failed to load product. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [handle])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">{error || 'Product Not Found'}</h1>
            <button
              onClick={() => navigate('/shop')}
              className="px-16 py-5 bg-white text-black rounded-full hover:bg-gray-200 transition-colors font-semibold"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    )
  }

  const selectedVariant = product.variants[selectedVariantIndex]
  const price = parseFloat(selectedVariant.price.amount)
  const formattedPrice = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: selectedVariant.price.currencyCode,
  }).format(price)

  const isAvailable = selectedVariant.availableForSale
  
  let sizeChartImage = product.images.find(img => 
    img.url.toLowerCase().includes('chart') || 
    img.url.toLowerCase().includes('size') || 
    img.url.toLowerCase().includes('screenshot_2024-11-18') ||
    img.altText?.toLowerCase().includes('chart') || 
    img.altText?.toLowerCase().includes('size')
  )?.url

  if (!sizeChartImage && globalProducts.length > 0) {
    const currentType = extractProductType(product.title)
    const matchingProductWithChart = globalProducts.find(p => {
      if (extractProductType(p.title) !== currentType) return false
      return p.images.some(img => 
        img.url.toLowerCase().includes('chart') || 
        img.url.toLowerCase().includes('size') || 
        img.url.toLowerCase().includes('screenshot_2024-11-18')
      )
    })

    if (matchingProductWithChart) {
      sizeChartImage = matchingProductWithChart.images.find(img => 
        img.url.toLowerCase().includes('chart') || 
        img.url.toLowerCase().includes('size') || 
        img.url.toLowerCase().includes('screenshot_2024-11-18')
      )?.url
    }
  }

  const galleryImages = product.images.filter(img => 
    !img.url.toLowerCase().includes('chart') && 
    !img.url.toLowerCase().includes('size') && 
    !img.url.toLowerCase().includes('screenshot_2024-11-18') &&
    !(img.altText?.toLowerCase().includes('chart')) && 
    !(img.altText?.toLowerCase().includes('size'))
  )

  const currentImage = galleryImages[selectedImageIndex] || galleryImages[0]

  const handleAddToCart = async () => {
    if (!isAvailable) return

    setIsAdding(true)

    addToCart({
      variantId: selectedVariant.id,
      productId: product.id,
      title: product.title,
      variant: selectedVariant.title,
      price,
      image: currentImage?.url || product.images[0]?.url || '',
      quantity,
    })

    setTimeout(() => setIsAdding(false), 1000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description?.substring(0, 100) || '',
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Navigation isDarkContent={false} />

      <main className="pt-8 md:pt-12 pb-20 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="w-full max-w-[1200px]">
            {/* Breadcrumb */}
            <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-400 py-4 pl-2 pr-24 md:px-8">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-white transition-colors">
                Shop
              </Link>
              {product.collectionName && (
                <>
                  <span>/</span>
                  <Link
                    to={`/project/${product.collectionHandle}`}
                    className="hover:text-white transition-colors"
                  >
                    {product.collectionName}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-white">{product.title}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 mb-24">
              {/* Images */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Main Image */}
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 mb-4 md:mx-8">
                  <img
                    src={currentImage?.url || '/placeholder-product.jpg'}
                    alt={currentImage?.altText || product.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-[1.18] cursor-zoom-in"
                  />
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                      <span className="px-8 py-4 bg-red-500 text-white text-2xl font-bold rounded-full">
                        {t('product.soldOut')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-3 py-5 md:mx-9">
                    {galleryImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden transition-all ${selectedImageIndex === index
                          ? 'ring-4 ring-white'
                          : 'opacity-60 hover:opacity-100'
                          }`}
                      >
                        <img
                          src={image.url}
                          alt={image.altText || `${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{product.title}</h1>

                <div className="flex flex-wrap items-center gap-4 mb-8 py-5">
                  <span className="text-4xl font-bold text-white">{formattedPrice}</span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-300/30 text-emerald-300 text-xs font-semibold uppercase tracking-wide">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    100% of profits donated
                  </span>
                </div>

                {/* Color Selector (Sibling Products) - Color Swatches */}
                {siblings.length > 1 && (
                  <div className="mb-8">
                    <label className="block text-2xl font-bold text-white py-2.5">
                      Color
                      {extractColorFromTitle(product.title) && (
                        <span className="ml-3 text-base font-normal text-gray-300 capitalize">
                          {extractColorFromTitle(product.title).toLowerCase()}
                        </span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {siblings.map((sibling) => {
                        // Use shared utility to extract color name
                        const colorName = extractColorFromTitle(sibling.title) || sibling.title
                        const colorKey = colorName.toLowerCase()
                        const colorValue = COLOR_MAP[colorKey] || '#808080'
                        const isCurrentProduct = sibling.handle === product.handle

                        return (
                          <Link
                            key={sibling.id}
                            to={`/product/${sibling.handle}`}
                            className="group relative"
                            title={colorName}
                          >
                            {/* Color swatch circle - Enhanced Glassy Style */}
                            <div className="relative">
                              <div
                                className={`w-14 h-14 rounded-full transition-all duration-300 ${isCurrentProduct
                                  ? 'ring-2 ring-white/90 ring-offset-2 ring-offset-gray-900/60 shadow-xl scale-110'
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
                            {/* Tooltip with color name on hover */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
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

                {/* Size Selector (Variant Options) */}
                {product.options && product.options.map((option) => {
                  if (option.name.toLowerCase() === 'color') return null // Skip color if handled by siblings (or if it's redundant)

                  return (
                    <div key={option.id} className="mb-8">
                      <div className="flex items-center justify-between py-2.5">
                        <label className="block text-2xl font-bold text-white">
                          {option.name}
                        </label>
                        {option.name.toLowerCase() === 'size' && sizeChartImage && (
                          <button
                            onClick={() => setIsSizeChartOpen(true)}
                            className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 cursor-pointer bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 hover:bg-white/10 animate-fade-in"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                            </svg>
                            Size Guide
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {option.values.sort((a, b) => {
                          const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
                          const indexA = sizeOrder.indexOf(a)
                          const indexB = sizeOrder.indexOf(b)
                          // If both are in the list, sort by index
                          if (indexA !== -1 && indexB !== -1) return indexA - indexB
                          // If only one is in the list, prioritize it
                          if (indexA !== -1) return -1
                          if (indexB !== -1) return 1
                          // Otherwise sort alphabetically
                          return a.localeCompare(b)
                        }).map((value) => {
                          const isSelected = selectedVariant.selectedOptions?.some(
                            (o) => o.name === option.name && o.value === value
                          )

                          return (
                            <button
                              key={value}
                              onClick={() => {
                                // Logic to select variant based on this option value
                                // ... (same as before)
                                const currentOptions = selectedVariant.selectedOptions || []
                                const targetOptions = currentOptions.map(o =>
                                  o.name === option.name ? { ...o, value } : o
                                )
                                const matchingVariantIndex = product.variants.findIndex(v =>
                                  v.selectedOptions?.every(vo =>
                                    targetOptions.some(to => to.name === vo.name && to.value === vo.value)
                                  )
                                )
                                if (matchingVariantIndex !== -1) {
                                  setSelectedVariantIndex(matchingVariantIndex)
                                } else {
                                  const fallbackIndex = product.variants.findIndex(v =>
                                    v.selectedOptions?.some(o => o.name === option.name && o.value === value)
                                  )
                                  if (fallbackIndex !== -1) {
                                    setSelectedVariantIndex(fallbackIndex)
                                  }
                                }
                              }}
                              className={`min-w-[80px] px-6 py-3 rounded-full font-semibold transition-all backdrop-blur-md border ${isSelected
                                ? 'bg-white/20 text-white border-white shadow-lg'
                                : 'bg-white/10 text-white hover:bg-white/20 border-white/20 hover:border-white/40'
                                }`}
                            >
                              {value}
                            </button>
                          )
                        })}
                      </div>
                      {option.name.toLowerCase() === 'size' && product.title.toLowerCase().includes('oversized') && (
                        <p className="mt-3 text-sm text-gray-400 leading-relaxed font-medium">
                          Note: This style is designed to be oversized (loose and roomy). If you prefer a closer fit, consider sizing down.
                        </p>
                      )}
                    </div>
                  )
                })}

                {/* Quantity Selector - Glassy Style */}
                <div className="mb-8">
                  <label className="block text-2xl font-bold text-white py-2.5">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all text-xl font-bold shadow-lg"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-white w-16 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      aria-label="Increase quantity"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all text-xl font-bold shadow-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 mb-8">
                  <button
                    onClick={handleAddToCart}
                    disabled={!isAvailable || isAdding}
                    className={`w-full py-4 my-4 rounded-full font-bold text-xl transition-all ${isAvailable && !isAdding
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {isAdding ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
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
                        {t('product.addingToCart')}
                      </span>
                    ) : !isAvailable ? (
                      t('product.soldOut')
                    ) : (
                      t('product.addToCart')
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-full py-4 rounded-full font-bold text-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-3 shadow-lg"
                  >
                    {linkCopied ? (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        Share Product
                      </>
                    )}
                  </button>
                </div>

                {/* Description - Formatted specs block */}
                {product.description && (
                  <div className="space-y-8 py-5 px-1.5 border-t border-white/10 mt-8 animate-fade-in">
                    {/* The original description text */}
                    <div
                      className="text-gray-300 text-lg leading-relaxed font-medium"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                    />
                    
                    {/* SPECIFICATIONS GRID */}
                    {(() => {
                      const specs = getProductSpecs(product.title)
                      return (
                        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                          {/* Left side: Feature Checklist */}
                          <div>
                            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-4">Description</h4>
                            <ul className="space-y-3">
                              {specs.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-gray-300 text-base">
                                  <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Right side: Composition & Care */}
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-3">Composition</h4>
                              <p className="text-gray-300 text-base leading-relaxed">{specs.composition}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-3">Care Instructions</h4>
                              <p className="text-gray-300 text-base leading-relaxed mb-4">{specs.care}</p>
                              {/* Care icons */}
                              <div className="flex items-center gap-4 text-white/70">
                                {/* Tub 30 */}
                                <div className="flex items-center justify-center p-1.5 rounded-lg bg-white/5 border border-white/10" title="Machine wash at 30°C">
                                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M4 10h16l-2 9H6l-2-9zM3 7h18" />
                                    <path d="M4 10c1-1 2-1 3 0s2 1 3 0 2-1 3 0 2-1 3 0 2-1 3 0" />
                                    <text x="12" y="16" fontSize="4.5" fontWeight="bold" fill="currentColor" textAnchor="middle">30</text>
                                  </svg>
                                </div>
                                {/* Do not bleach */}
                                <div className="flex items-center justify-center p-1.5 rounded-lg bg-white/5 border border-white/10" title="Do not bleach">
                                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 3l9 16H3L12 3z" />
                                    <path d="M9 10l6 6M15 10l-6 6" />
                                  </svg>
                                </div>
                                {/* Do not tumble dry */}
                                <div className="flex items-center justify-center p-1.5 rounded-lg bg-white/5 border border-white/10" title="Do not tumble dry">
                                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="4" y="4" width="16" height="16" rx="2" />
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M9 9l6 6M15 9l-6 6" />
                                  </svg>
                                </div>
                                {/* Iron medium heat */}
                                <div className="flex items-center justify-center p-1.5 rounded-lg bg-white/5 border border-white/10" title="Iron medium heat">
                                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M4 17h16c1 0 2-1 2-2v-4c0-2-1.5-3.5-3.5-3.5H9C7 7.5 5.5 9 5.5 11v4M4 17c-1 0-2-1-2-2V7.5c0-.8.7-1.5 1.5-1.5h3.5" />
                                    <circle cx="10" cy="13" r="0.75" fill="currentColor" />
                                    <circle cx="13" cy="13" r="0.75" fill="currentColor" />
                                  </svg>
                                </div>
                                {/* Do not dry clean */}
                                <div className="flex items-center justify-center p-1.5 rounded-lg bg-white/5 border border-white/10" title="Do not dry clean">
                                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="8" />
                                    <path d="M9 9l6 6M15 9l-6 6" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })()}

                    {/* Certification Logos */}
                    <div className="pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-md">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <span className="text-white font-bold text-sm">GOTS Certified</span>
                        <span className="text-xs text-gray-400 mt-1">100% Organic Cotton</span>
                      </div>

                      <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-md">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                          </svg>
                        </div>
                        <span className="text-white font-bold text-sm">OEKO-TEX</span>
                        <span className="text-xs text-gray-400 mt-1">Standard 100</span>
                      </div>

                      <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-md">
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 mb-2">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <span className="text-white font-bold text-sm">PETA Approved</span>
                        <span className="text-xs text-gray-400 mt-1">100% Vegan</span>
                      </div>

                      <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-md">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-white font-bold text-sm">Fair Wear</span>
                        <span className="text-xs text-gray-400 mt-1">Ethical Labor</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Charitable Impact */}
                {product.collectionName && (
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-2">Your Impact</h3>
                    <p className="text-gray-300">
                      100% of profits from this product support {product.collectionName}. Every
                      purchase makes a real difference.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-white mb-8">You May Also Like</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <ProductCard
                      key={relatedProduct.id}
                      product={relatedProduct}
                      themeColor={product.collectionColor}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Sticky mobile buy bar - keeps price + CTA reachable without scrolling back up */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-lg border-t border-white/10 px-4 pt-3"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col min-w-0 shrink-0">
            <span className="text-white font-bold text-lg leading-tight">{formattedPrice}</span>
            {selectedVariant.title !== 'Default Title' && (
              <span className="text-gray-400 text-xs truncate max-w-[120px]">{selectedVariant.title}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            className={`flex-1 min-h-[48px] py-3 rounded-full font-bold text-base transition-all ${isAvailable && !isAdding
              ? 'bg-white text-black active:scale-[0.98]'
              : 'bg-gray-700 text-gray-500'
              }`}
          >
            {isAdding ? t('product.addingEllipsis') : !isAvailable ? t('product.soldOut') : t('product.addToCart')}
          </button>
        </div>
      </div>

      {/* Size Chart Modal */}
      <AnimatePresence>
        {isSizeChartOpen && sizeChartImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setIsSizeChartOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col items-center"
            >
              {/* Close button */}
              <button
                onClick={() => setIsSizeChartOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 p-2.5 rounded-full transition-colors cursor-pointer hover:bg-white/20"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-white mb-6 pr-8 text-center font-primary">Size Chart - {product.title}</h3>
              <div className="w-full max-h-[70vh] overflow-auto flex justify-center bg-white p-4 rounded-2xl">
                <img
                  src={sizeChartImage}
                  alt={`${product.title} Size Chart`}
                  className="max-w-full max-h-[50vh] object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
