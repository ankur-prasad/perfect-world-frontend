import type { ShopifyProduct } from '../../types/shopify.types'
import ProductCardWithColors from './ProductCardWithColors'
import { groupProductsByTypeForCollection, findColorSiblings } from '../../utils/productGrouping'

interface ProductGridProps {
  products: ShopifyProduct[]
  loading?: boolean
  onQuickView?: (product: ShopifyProduct) => void
  themeColor?: string
  isLightMode?: boolean
}

export default function ProductGrid({ products, loading, onQuickView, themeColor, isLightMode = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {[...Array(6)].map((_, i) => (
          <ProductSkeletonCard key={i} isLightMode={isLightMode} />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${isLightMode ? 'bg-gray-100' : 'bg-white/5'
          }`}>
          <svg
            className={`w-10 h-10 ${isLightMode ? 'text-gray-400' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
          No Products Found
        </h3>
        <p className={`max-w-md mx-auto ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    )
  }

  // Group products by type (tshirt, hoodie, tote)
  const { tshirt, hoodie, tote } = groupProductsByTypeForCollection(products)

  // Find color siblings for each product type
  const tshirtSiblings = tshirt ? findColorSiblings(tshirt, products) : []
  const hoodieSiblings = hoodie ? findColorSiblings(hoodie, products) : []
  const toteSiblings = tote ? findColorSiblings(tote, products) : []

  // Create an array of items to render
  const itemsToRender = [
    { product: tshirt, siblings: tshirtSiblings },
    { product: hoodie, siblings: hoodieSiblings },
    { product: tote, siblings: toteSiblings }
  ].filter(item => item.product !== null) as { product: ShopifyProduct, siblings: ShopifyProduct[] }[]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {itemsToRender.map(({ product, siblings }) => (
        <ProductCardWithColors
          key={product.id}
          product={product}
          siblings={siblings}
          onQuickView={onQuickView}
          isLightMode={isLightMode}
        />
      ))}
    </div>
  )
}

function ProductSkeletonCard({ isLightMode = false }: { isLightMode?: boolean }) {
  return (
    <div className={`${isLightMode ? 'bg-white border border-gray-100' : 'bg-white/5 backdrop-blur-sm'} rounded-2xl overflow-hidden animate-pulse`}>
      {/* Image skeleton */}
      <div className={`aspect-[3/4] ${isLightMode ? 'bg-gray-200' : 'bg-gray-700'}`} />

      {/* Content skeleton */}
      <div className="p-6">
        <div className={`h-6 rounded mb-2 w-3/4 ${isLightMode ? 'bg-gray-200' : 'bg-gray-700'}`} />
        <div className={`h-4 rounded mb-4 w-full ${isLightMode ? 'bg-gray-200' : 'bg-gray-700'}`} />
        <div className="flex items-center justify-between">
          <div className={`h-6 rounded w-20 ${isLightMode ? 'bg-gray-200' : 'bg-gray-700'}`} />
          <div className={`h-10 rounded w-28 ${isLightMode ? 'bg-gray-200' : 'bg-gray-700'}`} />
        </div>
      </div>
    </div>
  )
}
