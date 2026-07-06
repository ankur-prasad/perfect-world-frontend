import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'
import CollectionRow from '../components/Shop/CollectionRow'
import { projects } from '../data/projects'
import { getAllProducts } from '../utils/shopify'
import type { ShopifyProduct } from '../types/shopify.types'
import SustainabilityPromise from '../components/Shop/SustainabilityPromise'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Shop() {
  usePageTitle('Shop')
  const { t } = useTranslation()
  const location = useLocation()
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all products in one request and distribute them to projects
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        const allFetchedProducts = await getAllProducts()
        const taggedProducts: ShopifyProduct[] = []

        allFetchedProducts.forEach((product) => {
          // Find matching project
          let matchingProject = projects.find((project) =>
            // Match by collection handle in product collections
            product.collections?.some((col) => col.handle === project.shopifyCollection.handle) ||
            // Match by project name in title (case-insensitive)
            product.title.toLowerCase().includes(project.name.toLowerCase()) ||
            // Match by slug in title
            product.title.toLowerCase().includes(project.slug.replace(/-/g, ' ').toLowerCase())
          )

          if (matchingProject) {
            taggedProducts.push({
              ...product,
              collectionHandle: matchingProject.shopifyCollection.handle,
              collectionName: matchingProject.name,
              collectionColor: matchingProject.theme.primaryColor,
            })
          } else if (
            product.collections?.some((col) => col.handle === 'perfect-world') ||
            product.title.toLowerCase().includes('embroidered')
          ) {
            taggedProducts.push({
              ...product,
              collectionHandle: 'perfect-world',
              collectionName: 'Embroidered Logo',
              collectionColor: '#000000',
            })
          }
        })

        // Deduplicate products by product ID
        const uniqueProducts = taggedProducts.filter((product, index, self) =>
          self.findIndex((p) => p.id === product.id) === index
        )

        setProducts(uniqueProducts)
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setError(t('shop.error'))
      } finally {
        setLoading(false)
      }
    }

    fetchAllProducts()
  }, [])

  // Handle hash navigation to scroll to specific collection
  useEffect(() => {
    if (location.hash && !loading) {
      const collectionHandle = location.hash.replace('#', '')
      const element = document.getElementById(collectionHandle)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [location.hash, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation isDarkContent={true} />
        <main className="pt-6 md:pt-10 pb-20 md:pb-24 px-6 sm:px-8 lg:px-12">
          <div className="max-w-[1400px] mx-auto">
            {/* Heading skeletons */}
            <div className="h-10 md:h-14 w-64 md:w-96 bg-gray-200 rounded-xl mx-auto animate-pulse" />
            <div className="h-4 w-72 bg-gray-100 rounded-full mx-auto mt-6 animate-pulse" />

            {/* Collection row skeletons */}
            <div className="mt-16 space-y-20">
              {[0, 1].map((row) => (
                <div key={row}>
                  <div className="h-7 w-52 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 md:gap-8 mt-8 max-w-6xl mx-auto">
                    {[0, 1, 2].map((card) => (
                      <div key={card} className={`rounded-2xl border border-gray-100 overflow-hidden ${card === 2 ? 'hidden md:block' : ''}`}>
                        <div className="aspect-[4/5] bg-gray-100 animate-pulse" />
                        <div className="p-3 md:p-5 space-y-3">
                          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation isDarkContent={true} />
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center">
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('shop.oops')}</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {t('shop.tryAgain')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation isDarkContent={true} />

      <main className="pt-3 md:pt-4 pb-16 md:pb-20">
        <SustainabilityPromise />

        <div className="px-6 sm:px-8 lg:px-12 flex justify-center">
          <div className="w-full max-w-[1400px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-3 md:mb-4 text-center font-primary py-1">
                {t('shop.title')}
              </h1>
              <p className="text-base md:text-lg text-gray-600 text-center mb-6 md:mb-8">
                {t('shop.subtitle')}
              </p>

              {/* Collection Rows - Each project gets one row with 3 products */}
              <div className="space-y-12 md:space-y-16">
                {/* Render projects in order from projects.ts */}
                {projects.map((project) => {
                  const collectionProducts = products.filter(
                    (p) => p.collectionHandle === project.shopifyCollection.handle
                  )

                  if (collectionProducts.length === 0) return null

                  return (
                    <CollectionRow
                      key={project.id}
                      collectionName={project.name}
                      collectionHandle={project.shopifyCollection.handle}
                      collectionColor={project.theme.primaryColor}
                      products={collectionProducts}
                      allProducts={products}
                      isNew={project.shopifyCollection.handle === 'rich-in-life'}
                    />
                  )
                })}

                {/* Embroidered Logo Collection */}
                {products.filter((p) => p.collectionHandle === 'perfect-world').length > 0 && (
                  <CollectionRow
                    collectionName="Embroidered Logo"
                    collectionHandle="perfect-world"
                    collectionColor="#000000"
                    products={products.filter((p) => p.collectionHandle === 'perfect-world')}
                    allProducts={products}
                  />
                )}

              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
