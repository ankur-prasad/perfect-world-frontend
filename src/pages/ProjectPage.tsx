import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Footer from '../components/Layout/Footer'
import ProductGrid from '../components/Product/ProductGrid'
import QuickViewModal from '../components/Product/QuickViewModal'
import ScrollExpandMedia from '../components/ScrollExpandMedia'
import { getProjectBySlug, projects } from '../data/projects'
import { getCollectionProducts } from '../utils/shopify'
import type { ShopifyProduct } from '../types/shopify.types'

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [view, setView] = useState<'mission' | 'shop'>('mission')
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<ShopifyProduct | null>(null)

  const project = slug ? getProjectBySlug(slug) : null

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Get current project index for carousel
  const currentProjectIndex = project ? projects.findIndex(p => p.slug === project.slug) : -1
  const prevProject = currentProjectIndex > 0 ? projects[currentProjectIndex - 1] : projects[projects.length - 1]
  const nextProject = currentProjectIndex < projects.length - 1 ? projects[currentProjectIndex + 1] : projects[0]

  // Fetch products when switching to shop view
  useEffect(() => {
    if (project && view === 'shop' && products.length === 0) {
      const fetchProducts = async () => {
        setLoading(true)
        try {
          const collection = await getCollectionProducts(project.shopifyCollection.handle)
          if (collection && collection.products) {
            setProducts(collection.products)
          }
        } catch (error) {
          console.error('Failed to fetch products:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchProducts()
    }
  }, [project, view, products.length])

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-12 py-4 bg-white text-black rounded-full hover:bg-gray-200 transition-colors font-semibold"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={project.mission.heroImage || 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=2560&auto=format&fit=crop'}
        bgImageSrc={project.mission.heroImage || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop'}
        title={project.name}
        scrollToExpand="Scroll to explore"
        textBlend={false}
      >
        {/* Header with Notch Design */}
        <div className="fixed top-0 left-0 right-0 z-50">
          {/* Main Header Bar */}
          <div className="relative">
            {/* Left Section with Border */}
            <div className="absolute top-0 left-0 h-16 bg-black/80 backdrop-blur-md border-b border-white/10" style={{ width: 'calc(50% - 200px)', borderBottomRightRadius: '24px', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div className="relative h-full">
                {/* Back Button - Left aligned */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  <button
                    onClick={() => navigate('/')}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                </div>

                {/* Mission Button - Top Left (after back button) */}
                <div className="absolute left-20 top-1/2 -translate-y-1/2">
                  <button
                    onClick={() => setView('mission')}
                    className={`px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors font-semibold ${view === 'mission' ? 'bg-white/10' : ''
                      }`}
                  >
                    Mission
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section with Border */}
            <div className="absolute top-0 right-0 h-16 bg-black/80 backdrop-blur-md border-b border-white/10" style={{ width: 'calc(50% - 200px)', borderBottomLeftRadius: '24px', borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div className="relative h-full">
                {/* Shop Button - Top Right */}
                <div className="absolute right-20 top-1/2 -translate-y-1/2">
                  <button
                    onClick={() => setView('shop')}
                    className={`px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors font-semibold ${view === 'shop' ? 'bg-white/10' : ''
                      }`}
                  >
                    Shop
                  </button>
                </div>

                {/* Cart - Right aligned */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <button
                    onClick={() => navigate('/cart')}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Center Notch Section */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] bg-black/80 backdrop-blur-md border border-white/10 rounded-b-3xl pt-6 pb-6">
              <div className="flex flex-col items-center justify-center gap-3">
                {/* Perfect World Logo */}
                <button
                  onClick={() => {
                    window.scrollTo(0, 0)
                    navigate('/')
                  }}
                  className="hover:opacity-80 transition-opacity"
                >
                  <img
                    src="/assets/LOGOS/perfect-world-logo-white.png"
                    alt="Perfect World"
                    className="h-12 w-auto mb-2"
                  />
                </button>

                <span className="text-xs text-gray-400 whitespace-nowrap">in partnership with</span>

                {/* Charity Logo with Arrows - Fixed width container */}
                <div className="relative w-[200px] flex items-center justify-center my-2">
                  {/* Left Arrow - Fixed position */}
                  <button
                    onClick={() => navigate(`/project/${prevProject.slug}`)}
                    className="absolute left-[-60px] p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <img
                    src={project.mission.partnerCharity.logo}
                    alt={project.mission.partnerCharity.name}
                    className="h-12 md:h-14 w-auto object-contain max-w-full"
                  />

                  {/* Right Arrow - Fixed position */}
                  <button
                    onClick={() => navigate(`/project/${nextProject.slug}`)}
                    className="absolute right-[-60px] p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Dot Indicators */}
                <div className="flex items-center gap-2 mt-2">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(`/project/${projects[index].slug}`)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentProjectIndex
                          ? 'bg-white w-3 h-3'
                          : 'bg-white/30 hover:bg-white/50'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {view === 'mission' ? (
          <div className="space-y-32">
            <div className="text-center mb-24 py-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{project.tagline}</h2>
            </div>

            {/* Problem */}
            <div className="bg-white/5 rounded-2xl p-16 border border-white/10 min-h-[40vh] flex flex-col justify-center">
              <h3 className="text-4xl font-bold text-white mb-8">The Problem</h3>
              <p className="text-gray-300 text-xl leading-relaxed">{project.mission.problem}</p>
            </div>

            {/* Solution */}
            <div className="bg-white/5 rounded-2xl p-16 border border-white/10 min-h-[40vh] flex flex-col justify-center">
              <h3 className="text-4xl font-bold text-white mb-8">Our Solution</h3>
              <p className="text-gray-300 text-xl leading-relaxed">{project.mission.solution}</p>
            </div>

            {/* Impact */}
            <div className="bg-white/5 rounded-2xl p-16 border border-white/10 min-h-[50vh] flex flex-col justify-center">
              <h3 className="text-4xl font-bold text-white mb-16 text-center">Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {project.mission.impact.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-6xl md:text-7xl font-bold mb-4" style={{ color: project.theme.primaryColor }}>
                      {stat.split(' ').slice(0, -1).join(' ')}
                    </p>
                    <p className="text-gray-400 text-lg">{stat.split(' ').slice(-1)[0]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Charity */}
            <div className="bg-white/5 rounded-2xl p-16 border border-white/10 min-h-[40vh] flex flex-col justify-center">
              <h3 className="text-4xl font-bold text-white mb-12">Our Partner</h3>
              <div className="flex flex-col md:flex-row items-center gap-12">
                <img
                  src={project.mission.partnerCharity.logo}
                  alt={project.mission.partnerCharity.name}
                  className="h-40 w-auto object-contain bg-white/5 rounded-xl p-8"
                />
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-3xl font-semibold text-white mb-6">
                    {project.mission.partnerCharity.name}
                  </h4>
                  <p className="text-gray-300 text-xl leading-relaxed mb-8">
                    {project.mission.partnerCharity.description}
                  </p>
                  <a
                    href={project.mission.partnerCharity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold text-lg"
                  >
                    Visit Website
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center py-16">
              <button
                onClick={() => setView('shop')}
                className="px-12 py-5 bg-white text-black rounded-full font-semibold text-xl hover:bg-gray-200 transition-colors"
              >
                Support This Cause - Shop Collection
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-4xl font-bold text-white mb-6 text-center">
              Shop {project.name} Collection
            </h2>
            <p className="text-xl text-gray-300 mb-12 text-center">
              100% of profits support {project.mission.partnerCharity.name}
            </p>

            <ProductGrid
              products={products}
              loading={loading}
              onQuickView={setQuickViewProduct}
              themeColor={project.theme.primaryColor}
            />
          </div>
        )}
      </ScrollExpandMedia>

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
