import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'
import ProductGrid from '../components/Product/ProductGrid'
import QuickViewModal from '../components/Product/QuickViewModal'
import { projects } from '../data/projects'
import { getCollectionProducts } from '../utils/shopify'
import type { ShopifyProduct } from '../types/shopify.types'
import GlassyButton from '../components/ui/GlassyButton'

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name-asc'

export default function Shop() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState<string>('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 1000])
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<ShopifyProduct | null>(null)

  // Check URL parameters for collection filter
  useEffect(() => {
    const collectionParam = searchParams.get('collection')
    if (collectionParam) {
      setSelectedCollection(collectionParam)
    }
  }, [searchParams])

  // Fetch all products from all collections
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        const allProducts: ShopifyProduct[] = []

        // Fetch products from each project collection
        await Promise.all([
          ...projects.map(async (project) => {
            try {
              const collection = await getCollectionProducts(project.shopifyCollection.handle)
              if (collection && collection.products) {
                const taggedProducts = collection.products.map((product) => ({
                  ...product,
                  collectionHandle: project.shopifyCollection.handle,
                  collectionName: project.name,
                  collectionColor: project.theme.primaryColor,
                }))
                allProducts.push(...taggedProducts)
              }
            } catch (err) {
              console.warn(`Failed to fetch products for ${project.name}(${project.shopifyCollection.handle}): `, err)
            }
          }),
          // Fetch Embroidered Logo collection
          (async () => {
            try {
              const collection = await getCollectionProducts('embroidered-logo')
              if (collection && collection.products) {
                const taggedProducts = collection.products.map((product) => ({
                  ...product,
                  collectionHandle: 'embroidered-logo',
                  collectionName: 'Embroidered Logo',
                  collectionColor: '#FFFFFF', // White for neutral
                }))
                allProducts.push(...taggedProducts)
              }
            } catch (err) {
              console.warn('Failed to fetch Embroidered Logo collection:', err)
            }
          })(),
          // Fetch Color Collection
          (async () => {
            try {
              const collection = await getCollectionProducts('color-collection')
              if (collection && collection.products) {
                const taggedProducts = collection.products.map((product) => ({
                  ...product,
                  collectionHandle: 'color-collection',
                  collectionName: 'Color Collection',
                  collectionColor: '#FFFFFF', // White for neutral
                }))
                allProducts.push(...taggedProducts)
              }
            } catch (err) {
              console.warn('Failed to fetch Color Collection:', err)
            }
          })()
        ])

        setProducts(allProducts)
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAllProducts()
  }, [])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      )
    }

    // Collection filter
    if (selectedCollection !== 'all') {
      filtered = filtered.filter((product) => product.collectionHandle === selectedCollection)
    }

    // Price range filter
    filtered = filtered.filter((product) => {
      const price = parseFloat(product.priceRange.minVariantPrice.amount)
      return price >= selectedPriceRange[0] && price <= selectedPriceRange[1]
    })

    // Availability filter
    if (showAvailableOnly) {
      filtered = filtered.filter((product) => product.availableForSale)
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort(
          (a, b) =>
            parseFloat(a.priceRange.minVariantPrice.amount) -
            parseFloat(b.priceRange.minVariantPrice.amount)
        )
        break
      case 'price-high':
        filtered.sort(
          (a, b) =>
            parseFloat(b.priceRange.minVariantPrice.amount) -
            parseFloat(a.priceRange.minVariantPrice.amount)
        )
        break
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      // 'featured' - keep original order
    }

    return filtered
  }, [products, searchQuery, selectedCollection, selectedPriceRange, sortBy, showAvailableOnly])

  // Group products by collection for display
  const productsByCollection = useMemo(() => {
    if (selectedCollection !== 'all') {
      // If a specific collection is selected, return all products in one group
      return [{
        collectionName: filteredAndSortedProducts[0]?.collectionName || 'Products',
        collectionHandle: selectedCollection,
        products: filteredAndSortedProducts
      }]
    }

    // Group by collection handle
    const grouped = filteredAndSortedProducts.reduce((acc, product) => {
      const handle = product.collectionHandle || 'other'
      if (!acc[handle]) {
        acc[handle] = {
          collectionName: product.collectionName || 'Other',
          collectionHandle: handle,
          products: []
        }
      }
      acc[handle].products.push(product)
      return acc
    }, {} as Record<string, { collectionName: string; collectionHandle: string; products: ShopifyProduct[] }>)

    return Object.values(grouped)
  }, [filteredAndSortedProducts, selectedCollection])

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCollection('all')
    setSelectedPriceRange([0, 1000])
    setShowAvailableOnly(false)
    setSortBy('featured')
  }

  const activeFiltersCount = [
    searchQuery,
    selectedCollection !== 'all',
    selectedPriceRange[0] !== 0 || selectedPriceRange[1] !== 1000,
    showAvailableOnly,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-white">
      <Navigation isDarkContent={true} />

      <main className="pt-40 md:pt-48 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="w-full max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 text-center font-primary">
                Shop All Products
              </h1>
              <p className="text-xl text-gray-600 text-center mb-12">
                Every purchase supports a charitable cause
              </p>

              {/* Search and Filters */}
              <div className="mb-12 space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pl-14 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  />
                  <svg
                    className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  {/* Collection Filter */}
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer"
                  >
                    <option value="all">All Collections</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.shopifyCollection.handle}>
                        {project.name}
                      </option>
                    ))}
                    <option value="embroidered-logo">Embroidered Logo</option>
                    <option value="color-collection">Color Collection</option>
                  </select>

                  {/* Price Range */}
                  <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <span className="text-gray-700 text-sm">Price:</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={selectedPriceRange[0]}
                      onChange={(e) =>
                        setSelectedPriceRange([parseInt(e.target.value), selectedPriceRange[1]])
                      }
                      className="w-20 px-2 py-1 bg-white border border-gray-200 text-gray-900 rounded text-sm focus:outline-none"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={selectedPriceRange[1]}
                      onChange={(e) =>
                        setSelectedPriceRange([selectedPriceRange[0], parseInt(e.target.value)])
                      }
                      className="w-20 px-2 py-1 bg-white border border-gray-200 text-gray-900 rounded text-sm focus:outline-none"
                    />
                  </div>

                  {/* Availability */}
                  <label className="flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={showAvailableOnly}
                      onChange={(e) => setShowAvailableOnly(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-gray-700 text-sm">In Stock Only</span>
                  </label>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer"
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                  </select>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <GlassyButton
                      label={`Clear All (${activeFiltersCount})`}
                      onClick={handleClearFilters}
                      variant="secondary"
                      background="rgba(239, 68, 68, 0.2)"
                      hoverBackground="rgba(239, 68, 68, 0.3)"
                      textColor="rgb(252, 165, 165)"
                    />
                  )}
                </div>

                {/* Results Count */}
                <div className="text-center text-gray-400">
                  Showing {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6">
                    <svg
                      className="w-10 h-10 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Oops!</h3>
                  <p className="text-gray-400 mb-6">{error}</p>
                  <GlassyButton
                    label="Try Again"
                    onClick={() => window.location.reload()}
                    variant="light"
                  />
                </div>
              )}

              {/* Product Grid - Organized by Collection */}
              {!error && (
                <div className="space-y-16">
                  {productsByCollection.map((collection) => (
                    <div key={collection.collectionHandle}>
                      {/* Collection Header - only show when viewing all collections */}
                      {selectedCollection === 'all' && (
                        <motion.h2
                          className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                        >
                          {collection.collectionName}
                        </motion.h2>
                      )}

                      <ProductGrid
                        products={collection.products}
                        loading={loading}
                        onQuickView={setQuickViewProduct}
                        isLightMode={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  )
}
