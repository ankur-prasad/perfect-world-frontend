import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Layout/Footer'
import ProductCard from '../components/Product/ProductCard'
import { getProduct, getCollectionProducts } from '../utils/shopify'
import type { ShopifyProduct } from '../types/shopify.types'
import { useCart } from '../contexts/CartContext'
import { sanitizeHtml } from '../utils/sanitize'

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<ShopifyProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return

      setLoading(true)
      setError(null)

      try {
        const fetchedProduct = await getProduct(handle)
        if (fetchedProduct) {
          setProduct(fetchedProduct)

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
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedVariant.price.currencyCode,
  }).format(price)

  const isAvailable = selectedVariant.availableForSale
  const currentImage = product.images[selectedImageIndex]

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
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">

      <main className="pt-40 md:pt-48 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="w-full max-w-[1200px]">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
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
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 mb-4">
                  <img
                    src={currentImage?.url || '/placeholder-product.jpg'}
                    alt={currentImage?.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-8 py-4 bg-red-500 text-white text-2xl font-bold rounded-full">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-3">
                    {product.images.map((image, index) => (
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

                <div className="text-4xl font-bold text-white mb-8">{formattedPrice}</div>

                {product.description && (
                  <div
                    className="text-gray-300 text-lg leading-relaxed mb-8"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                  />
                )}

                {/* Variant Selector */}
                {product.variants.length > 1 && (
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-white mb-3">
                      Select {selectedVariant.selectedOptions?.[0]?.name || 'Option'}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((variant, index) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariantIndex(index)}
                          disabled={!variant.availableForSale}
                          className={`px-10 py-4 rounded-full font-semibold transition-all ${selectedVariantIndex === index
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
                  <label className="block text-sm font-bold text-white mb-3">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-xl font-bold"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-white w-16 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-xl font-bold"
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
                    className={`w-full py-5 rounded-full font-bold text-xl transition-all ${isAvailable && !isAdding
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
                        Adding to Cart...
                      </span>
                    ) : !isAvailable ? (
                      'Sold Out'
                    ) : (
                      'Add to Cart'
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-full py-5 rounded-full font-bold text-xl bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    Share Product
                  </button>
                </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <Footer />
    </div>
  )
}
