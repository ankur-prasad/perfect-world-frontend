import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'
import CollectionRow from '../components/Shop/CollectionRow'
import ProductCardWithColors from '../components/Product/ProductCardWithColors'
import { projects } from '../data/projects'
import { getCollectionProducts, getProduct } from '../utils/shopify'
import type { ShopifyProduct } from '../types/shopify.types'
import SustainabilityPromise from '../components/Shop/SustainabilityPromise'

export default function Shop() {
  const location = useLocation()
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [testProduct, setTestProduct] = useState<ShopifyProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all products from all collections
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        const allProducts: ShopifyProduct[] = []


        // 0. Fetch Test Product (tote bag for testing checkout flow) - Store separately
        try {
          const fetchedTestProduct = await getProduct('test')
          if (fetchedTestProduct) {
            // Store test product separately, not in main products array
            setTestProduct({
              ...fetchedTestProduct,
              collectionHandle: 'test',
              collectionName: 'Test Product',
              collectionColor: '#000000',
            })
          }
        } catch (err) {
          console.warn('Failed to fetch test product:', err)
        }

        // 1. Fetch products from each project collection
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
          // Fetch Organic Tote Bags collection and distribute to matching projects
          (async () => {
            try {
              // Try different possible collection handles for tote bags
              const possibleHandles = ['organic-tote-bags', 'tote-bags', 'organic-totes', 'totes']
              let toteCollection = null

              for (const handle of possibleHandles) {
                try {
                  toteCollection = await getCollectionProducts(handle)
                  if (toteCollection && toteCollection.products && toteCollection.products.length > 0) {
                    console.log(`Found tote bags in collection '${handle}':`, toteCollection.products.map(p => p.title))
                    break
                  }
                } catch {
                  continue
                }
              }

              if (toteCollection && toteCollection.products) {
                // Distribute totes to matching projects
                toteCollection.products.forEach(tote => {
                  // Try to match tote to a project by name
                  const matchingProject = projects.find(project =>
                    tote.title.toLowerCase().includes(project.name.toLowerCase()) ||
                    tote.title.toLowerCase().includes(project.slug.replace(/-/g, ' ').toLowerCase())
                  )

                  if (matchingProject) {
                    allProducts.push({
                      ...tote,
                      collectionHandle: matchingProject.shopifyCollection.handle,
                      collectionName: matchingProject.name,
                      collectionColor: matchingProject.theme.primaryColor,
                    })
                  } else {
                    console.warn(`No matching project found for tote: ${tote.title}`)
                  }
                })
              } else {
                console.warn('Could not find tote bags collection with any known handle')
              }
            } catch (err) {
              console.warn('Failed to fetch Tote Bags:', err)
            }
          })(),
          // Fetch Embroidered Logo collection
          (async () => {
            try {
              const collection = await getCollectionProducts('perfect-world')
              if (collection && collection.products) {
                const taggedProducts = collection.products.map((product) => ({
                  ...product,
                  collectionHandle: 'perfect-world',
                  collectionName: 'Embroidered Logo',
                  collectionColor: '#FFFFFF', // White for neutral
                }))
                allProducts.push(...taggedProducts)
              }
            } catch (err) {
              console.warn('Failed to fetch Embroidered Logo collection:', err)
            }
          })(),
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-900 text-2xl">Loading products...</div>
        </div>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation isDarkContent={true} />

      <main className="pt-40 md:pt-48 pb-32">
        <SustainabilityPromise />

        <div className="px-6 sm:px-8 lg:px-12 flex justify-center">
          <div className="w-full max-w-[1400px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-12 text-center font-primary">
                Shop Our Products
              </h1>
              <p className="text-l text-gray-600 text-center mb-16">
                Every purchase supports a charitable cause
              </p>

              {/* Collection Rows - Each project gets one row with 3 products */}
              <div className="space-y-32">
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

                {/* Test Product at the bottom */}
                {testProduct && (
                  <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-primary">
                        Test Product
                      </h2>
                      <div className="w-24 h-1 mt-4 rounded-full bg-gray-900" />
                      <p className="text-sm text-gray-500 mt-2">
                        For testing checkout and payment flow
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <ProductCardWithColors
                        product={testProduct}
                        siblings={[]}
                        isLightMode={true}
                      />
                    </div>
                  </motion.div>
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
