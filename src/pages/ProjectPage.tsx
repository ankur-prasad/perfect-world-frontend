import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'
import ProductGrid from '../components/Product/ProductGrid'
import QuickViewModal from '../components/Product/QuickViewModal'
import ScrollExpandMedia from '../components/ScrollExpandMedia'
import { getProjectBySlug, projects } from '../data/projects'
import { getCollectionProducts } from '../utils/shopify'
import type { ShopifyProduct } from '../types/shopify.types'
import { MeshGradient } from '@paper-design/shaders-react'
import GlassyButton from '../components/ui/GlassyButton'

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [view, setView] = useState<'mission' | 'shop'>('mission')
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<ShopifyProduct | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)

  const project = slug ? getProjectBySlug(slug) : null

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Detect scroll position and freeze gradient when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolling(scrollPosition > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Set initial state
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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

  // Custom colors based on project theme
  const gradientColors = project ? [
    project.theme.primaryColor,
    '#ffffff',
    project.theme.secondaryColor || '#000000',
    '#ffffff',
    project.theme.primaryColor
  ] : []

  // Custom Background (MeshGradient only)
  const CustomBackground = project ? (
    <div className="relative w-full h-full">
      {/* Background Shader */}
      <div className="absolute inset-0 z-0">
        <MeshGradient
          width={1920}
          height={1080}
          colors={gradientColors}
          distortion={1.2}
          swirl={1.0}
          speed={0.4}
          grainMixer={0}
        />
      </div>
    </div>
  ) : null

  // Custom Header Renderer for Animations
  const renderHeader = (progress: number) => {
    if (!project) return null

    // Animation calculations
    const logoOpacity = Math.max(0, 1 - progress * 2)
    const logoY = -progress * 100

    // Split text animation
    const textTranslateX = progress * 150 // Similar to ScrollExpandMedia default
    const firstWord = project.name.split(' ')[0]
    const restOfTitle = project.name.split(' ').slice(1).join(' ')

    return (
      <div className="flex flex-col items-center justify-center text-center relative z-20 w-full h-full pointer-events-none">

        {/* Project Logo - Fades out and moves up */}
        <div
          className="mb-8 transition-transform duration-100 ease-out"
          style={{
            opacity: logoOpacity,
            transform: `translateY(${logoY}px)`
          }}
        >
          <img
            src={project.mission.partnerCharity.logo}
            alt={`${project.name} logo`}
            className="h-32 w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Title - Splits and slides out */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-4 w-full">
            <h2
              className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg font-primary transition-transform duration-100 ease-out"
              style={{ transform: `translateX(-${textTranslateX}vw)` }}
            >
              {firstWord}
            </h2>
            <h2
              className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg font-primary transition-transform duration-100 ease-out"
              style={{ transform: `translateX(${textTranslateX}vw)` }}
            >
              {restOfTitle}
            </h2>
          </div>

          {/* Tagline - Fades out */}
          <p
            className="text-2xl md:text-3xl text-white font-light drop-shadow-md mt-4 transition-opacity duration-100"
            style={{ opacity: Math.max(0, 1 - progress * 3) }}
          >
            {project.tagline}
          </p>

          {/* Partner Info - Fades out */}
          <div
            className="mt-8 flex items-center justify-center gap-4 transition-opacity duration-100"
            style={{ opacity: Math.max(0, 1 - progress * 3) }}
          >
            <span className="text-white/80 text-sm uppercase tracking-widest">In partnership with</span>
            <img
              src={project.mission.partnerCharity.logo}
              alt={project.mission.partnerCharity.name}
              className="h-8 w-auto brightness-0 invert opacity-80"
            />
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
          <GlassyButton
            label="Return Home"
            onClick={() => navigate('/')}
            variant="light"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Full Page Background with MeshGradient */}
      <div className="fixed inset-0 z-0">
        <MeshGradient
          width={1920}
          height={1080}
          colors={gradientColors}
          distortion={1.2}
          swirl={1.0}
          speed={isScrolling ? 0 : 0.4}
          grainMixer={0}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <ScrollExpandMedia
          mediaType="image"
          mediaSrc={project.mission.heroImage || 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=2560&auto=format&fit=crop'}
          bgImageSrc="" // Overridden by customBackground
          customBackground={CustomBackground}
          renderHeader={renderHeader}
          title={project.name}
          scrollToExpand="Scroll to explore"
          textBlend={false}
        >
          {/* Standard Navigation */}
          <div className="relative z-50">
            <Navigation isDarkContent={false} />
          </div>

          {/* Project Controls & Navigation */}
          <div className="container mx-auto px-4 pt-8 pb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* View Toggle */}
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 gap-1">
                <GlassyButton
                  label="Mission"
                  onClick={() => setView('mission')}
                  variant={view === 'mission' ? 'light' : 'dark'}
                  background={view === 'mission' ? undefined : 'rgba(255, 255, 255, 0.05)'}
                  hoverBackground={view === 'mission' ? undefined : 'rgba(255, 255, 255, 0.1)'}
                  borderRadius={24}
                  blur={view === 'mission' ? 18 : 8}
                />
                <GlassyButton
                  label="Shop"
                  onClick={() => setView('shop')}
                  variant={view === 'shop' ? 'light' : 'dark'}
                  background={view === 'shop' ? undefined : 'rgba(255, 255, 255, 0.05)'}
                  hoverBackground={view === 'shop' ? undefined : 'rgba(255, 255, 255, 0.1)'}
                  borderRadius={24}
                  blur={view === 'shop' ? 18 : 8}
                />
              </div>

              {/* Project Navigation */}
              <div className="flex items-center gap-4">
                <GlassyButton
                  onClick={() => navigate(`/project/${prevProject.slug}`)}
                  variant="dark"
                  background="rgba(255, 255, 255, 0.05)"
                  hoverBackground="rgba(255, 255, 255, 0.1)"
                  borderRadius={24}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden md:inline">Prev Project</span>
                  </div>
                </GlassyButton>

                <div className="h-8 w-[1px] bg-white/20 hidden md:block" />

                <GlassyButton
                  onClick={() => navigate(`/project/${nextProject.slug}`)}
                  variant="dark"
                  background="rgba(255, 255, 255, 0.05)"
                  hoverBackground="rgba(255, 255, 255, 0.1)"
                  borderRadius={24}
                >
                  <div className="flex items-center gap-2">
                    <span className="hidden md:inline">Next Project</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </GlassyButton>
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
                <GlassyButton
                  label="Support This Cause - Shop Collection"
                  onClick={() => setView('shop')}
                  variant="light"
                />
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
    </div>
  )
}
