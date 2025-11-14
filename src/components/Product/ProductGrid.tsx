import type { ShopifyProduct } from '../../types/shopify.types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: ShopifyProduct[]
  loading?: boolean
  onQuickView?: (product: ShopifyProduct) => void
  themeColor?: string
}

export default function ProductGrid({ products, loading, onQuickView, themeColor }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {[...Array(6)].map((_, i) => (
          <ProductSkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
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
        <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
          themeColor={themeColor}
        />
      ))}
    </div>
  )
}

function ProductSkeletonCard() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[3/4] bg-gray-700" />

      {/* Content skeleton */}
      <div className="p-6">
        <div className="h-6 bg-gray-700 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-700 rounded mb-4 w-full" />
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-700 rounded w-20" />
          <div className="h-10 bg-gray-700 rounded w-28" />
        </div>
      </div>
    </div>
  )
}
