import { useEffect, Suspense, useRef, useState, lazy } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from '../components/Layout/Navigation'
import Footer from '../components/Layout/Footer'

// Lazy: keeps three.js out of the Home chunk so the page shell paints first
const Scene = lazy(() => import('../components/3D/Scene'))
import MonochromeOverlay from '../components/ui/MonochromeOverlay'
import Carousel3D from '../components/Carousel3D'
import { useNavigation } from '../contexts/NavigationContext'
import ImpactSlides from '../components/Home/ImpactSlides'
import FAQ from '../components/Home/FAQ'
import MainVideo from '../components/Home/MainVideo'
import { useTransitionStore } from '../stores/transitionStore'
import { usePageTitle } from '../hooks/usePageTitle'
import { projects } from '../data/projects'


gsap.registerPlugin(ScrollTrigger)

function makeImageTransparent(url: string, threshold = 250): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(url)
        return
      }
      ctx.drawImage(img, 0, 0)
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          if (r >= threshold && g >= threshold && b >= threshold) {
            data[i + 3] = 0
          }
        }
        ctx.putImageData(imageData, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } catch (e) {
        resolve(url)
      }
    }
    img.onerror = () => {
      resolve(url)
    }
    img.src = url
  })
}

export default function Home() {
  usePageTitle()
  const navigate = useNavigate()
  const location = useLocation()
  const { setIsScrolled } = useNavigation()
  const heroRef = useRef<HTMLElement>(null)
  const collectionsRef = useRef<HTMLElement>(null)
  const [showHeroText, setShowHeroText] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [collectionsScrollProgress, setCollectionsScrollProgress] = useState(0)
  const [globeHover, setGlobeHover] = useState(false)
  const [richInLifeImage, setRichInLifeImage] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    import('../utils/shopify').then(({ getCollectionProducts }) => {
      getCollectionProducts('rich-in-life')
        .then((col) => {
          if (col && col.products && col.products.length > 0) {
            const redBrownTee = col.products.find(p => p.handle === 'rich-in-life-organic-t-shirt-red-brown')
            if (redBrownTee && redBrownTee.images && redBrownTee.images.length > 0) {
              makeImageTransparent(redBrownTee.images[0].url).then(transparentUrl => {
                setRichInLifeImage(transparentUrl)
              })
            } else {
              const product = col.products[0]
              if (product && product.images && product.images.length > 0) {
                makeImageTransparent(product.images[0].url).then(transparentUrl => {
                  setRichInLifeImage(transparentUrl)
                })
              }
            }
          }
        })
        .catch((err) => {
          console.warn('Failed to load Rich in Life image from Shopify:', err)
        })
    })
  }, [])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 100)
          const heroHeight = window.innerHeight * (isMobile ? 0.6 : 1.125) // Shortened for mobile
          const transitionHeight = window.innerHeight * (isMobile ? 0.3 : 0.5625) // Shortened for mobile

          // Calculate scroll progress through the hero section (0 to 1)
          const progress = Math.min(window.scrollY / heroHeight, 1)
          setScrollProgress(progress)

          // Hide text when camera starts tilting down (at 15% scroll progress)
          setShowHeroText(progress < 0.15)

          // Calculate star trail progress during transition section
          // Start trails when buttons begin moving inward (at 100px scroll)
          const transitionStart = 100
          // End transition slightly before the physical section ends to ensure full white background
          const transitionEnd = (heroHeight + transitionHeight) - 100

          if (window.scrollY >= transitionStart && window.scrollY <= transitionEnd) {
            const transitionProgress = (window.scrollY - transitionStart) / (transitionEnd - transitionStart)
            setCollectionsScrollProgress(transitionProgress)
          } else if (window.scrollY > transitionEnd) {
            setCollectionsScrollProgress(1)
          } else {
            setCollectionsScrollProgress(0)
          }

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setIsScrolled, isMobile])

  useEffect(() => {
    if (location.hash === '#faq') {
      const element = document.getElementById('faq')
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location])


  const handleSatelliteClick = (projectSlug: string, clickPosition: { x: number; y: number }) => {
    const project = projects.find(p => p.slug === projectSlug)
    if (!project) return

    // Start transition with all data
    useTransitionStore.getState().startTransition({
      clickPosition,
      color: project.theme.primaryColor,
      gradientColors: [
        project.theme.primaryColor,
        '#ffffff',
        project.theme.secondaryColor,
        '#ffffff',
        project.theme.primaryColor
      ],
      projectSlug,
      source: 'globe'
    })

    // Navigate after brief delay to allow animation to start
    setTimeout(() => {
      navigate(`/project/${projectSlug}`)
    }, 200)
  }

  // Calculate background color based on transition progress
  // Interpolate from Black (#000000) to White (#FFFFFF)
  // Start transition earlier (0.15) so background changes with star trails
  const bgLightness = Math.max(0, Math.min(100, (collectionsScrollProgress - 0.15) * 1.5 * 100))
  const backgroundColor = `hsl(0, 0%, ${bgLightness}%)`
  // When background becomes white (lightness > 50), text should be black
  const textColor = bgLightness > 50 ? 'text-black' : 'text-white'

  return (
    <div className="min-h-screen transition-colors duration-100 ease-out" style={{ backgroundColor }}>
      <Navigation isDarkContent={bgLightness > 50} enableScrollAnimations={true} />

      {/* Fixed 3D Scene - spans both hero and collections */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-white text-xl">Loading 3D Experience...</div>
            </div>
          }
        >
          <Scene
            onSatelliteClick={handleSatelliteClick}
            onGlobeHoverChange={(v: boolean) => setGlobeHover(v)}
            scrollProgress={scrollProgress}
            collectionsScrollProgress={collectionsScrollProgress}
          />
        </Suspense>
      </div>

      {/* Monochrome overlay to apply film-like desaturate / grain / vignette */}
      {/* Smoothly fade out overlay as background turns white (bgLightness 0 -> 100 means opacity 1 -> 0) */}
      <MonochromeOverlay reduced={globeHover} opacity={1 - (bgLightness / 100)} />

      {/* Extended Hero Section with 3D Globe and Stars - 1.5 screens tall */}
      <section ref={heroRef} className="relative -z-10" style={{ height: isMobile ? '60vh' : '112.5vh' }}>
        {/* Empty section for scroll height */}
      </section>

      {/* Tagline - Right above arrow - Fixed position so it's on top of everything */}
      {showHeroText && (
        <motion.div
          className="fixed bottom-39 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <p className="text-3xl md:text-4xl lg:text-5xl text-white font-light whitespace-nowrap" style={{ fontFamily: '"Shadows Into Light", "Indie Flower", cursive' }}>
            Together. Not alone.
          </p>
        </motion.div>
      )}

      {/* Subtitle - Between tagline and scroll indicator */}
      {showHeroText && (
        <motion.div
          className="fixed bottom-27 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none px-2 md:px-4 w-[95%] md:max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="text-white/80 text-lg md:text-2xl tracking-widest uppercase font-bold" style={{ fontFamily: '"Shadows Into Light", "Indie Flower", cursive' }}>
            Shop Hope !
          </p>
        </motion.div>
      )}

      {/* Hero CTA - the direct path to buying */}
      {showHeroText && (
        <motion.div
          className="fixed bottom-9 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <button
            onClick={() => navigate('/shop')}
            className="whitespace-nowrap px-8 md:px-10 py-3 md:py-3.5 bg-white text-black rounded-full font-semibold text-sm md:text-lg shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all"
          >
            Shop the Collections
          </button>
        </motion.div>
      )}

      {/* Scroll Indicator */}
      {showHeroText && (
        <motion.div
          className="fixed bottom-1 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
          initial={{ opacity: 1 }}
          animate={{ y: [0, 8, 0], opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg
            className="w-6 h-6 text-white opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      )}

      {/* Transition section for star trails - 0.75 screens tall */}
      <section className="relative -z-10" style={{ height: isMobile ? '30vh' : '56.25vh' }}>
        {/* Stars with trails are visible here via the fixed 3D scene */}
      </section>



      {/* Collections Section with 3D Carousel */}
      <section ref={collectionsRef} className="relative bg-transparent z-10" style={{ minHeight: '100vh', paddingTop: '7rem', paddingBottom: '5rem' }}>
        <div className="w-full relative z-10 flex flex-col items-center">
          <motion.h2
            className={`title-handwritten text-center mb-12 ${textColor}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Collections
          </motion.h2>

          {/* New collection promo banner */}
          <motion.div
            className="w-full max-w-2xl mb-10 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-2xl bg-[#F5F2EB] border border-[#F0EAE1] shadow-lg px-6 py-5 text-center sm:text-left">
              <div className="flex-1">
                <span className="text-[11px] tracking-[0.2em] text-[#A98467] font-bold uppercase block mb-1">
                  New Collection
                </span>
                <p className="text-lg md:text-xl font-bold text-[#2C2621]">
                  Rich in Life — wealth you can't buy
                </p>
              </div>
              <button
                onClick={() => navigate('/rich-in-life')}
                className="shrink-0 px-6 py-3 bg-[#2C2621] text-white rounded-full font-semibold hover:bg-[#473E36] active:scale-[0.98] transition-all shadow-md"
              >
                Pre-order now →
              </button>
            </div>
          </motion.div>

          <div className="w-full max-w-5xl h-[460px] md:h-[600px]">
            <Carousel3D
              rotateSpeed={25}
              pauseOnHover={true}
              translateZ={400}
              itemWidth={340}
              itemHeight={340}
              borderRadius={12}
              showBackface={true}
              labels={[
                'Rich in Life',
                'Endangered Oceans',
                'One World',
                'Talk About It',
                'Cool Down',
                'Wild at Heart',
                'Embroidered',
              ]}
            >
              {[
                {
                  name: 'Mission Positivity',
                  collectionHandle: 'rich-in-life',
                  image: richInLifeImage || '/assets/images/tote-bag-placeholder.png',
                  isNew: true,
                },
                {
                  name: 'SECORE International',
                  collectionHandle: 'endangered-oceans',
                  image: '/assets/images/endangered-oceans-back.webp',
                },
                {
                  name: 'Care in Action',
                  collectionHandle: 'one-world',
                  image: '/assets/images/hoodie-back-one-world.webp',
                },
                {
                  name: 'Talk About It',
                  collectionHandle: 'talk-about-it',
                  image: '/assets/images/talk-about-it-back.webp',
                },
                {
                  name: 'Plant-For-The-Planet',
                  collectionHandle: 'frontpage',
                  image: '/assets/images/hoodie-cool-down.webp',
                },
                {
                  name: 'Wild at Heart',
                  collectionHandle: 'wild-at-heart',
                  image: '/assets/images/wild-at-heart-back.webp',
                },
                {
                  name: 'Embroidered',
                  collectionHandle: 'perfect-world',
                  image: '/assets/images/embriodered-hoodie.webp',
                },
              ].map((project: { name: string; collectionHandle: string; image: string; isNew?: boolean }, index) => (
                <div
                  key={project.collectionHandle}
                  onClick={() => {
                    // Navigate to the specific collection on the shop page
                    navigate(`/shop#${project.collectionHandle}`)
                  }}
                  className="relative w-full h-full cursor-pointer group"
                >
                  {/* Card backdrop */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-gray-50 to-gray-200/80 border border-gray-200/70 shadow-2xl" />

                  {/* "NEW" badge for the newest collection */}
                  {project.isNew && (
                    <span
                      className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md"
                      style={{ backgroundColor: '#A98467' }}
                    >
                      New
                    </span>
                  )}

                  {/* Ground shadow under the floating shirt */}
                  <div
                    className="absolute left-1/2 bottom-[7%] w-3/5 h-[6%] rounded-[100%] bg-black/40 blur-md"
                    style={{
                      animation: 'shadow-pulse 5s ease-in-out infinite',
                      animationDelay: `${index * 0.6}s`,
                    }}
                  />

                  {/* Floating shirt */}
                  <div
                    className="absolute inset-0"
                    style={{
                      animation: 'shirt-float 5s ease-in-out infinite',
                      animationDelay: `${index * 0.6}s`,
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain p-5 pb-8 transition-transform duration-300 group-hover:scale-105"
                      style={{ filter: 'drop-shadow(0 16px 22px rgba(0,0,0,0.28))' }}
                    />
                  </div>
                </div>
              ))}
            </Carousel3D>
          </div>
        </div>
      </section>

      <MainVideo />
      <ImpactSlides />
      <FAQ />
      <Footer />
    </div>
  )
}
