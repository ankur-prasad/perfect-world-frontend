import { useEffect, Suspense, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from '../components/Layout/Navigation'
import Footer from '../components/Layout/Footer'
import Scene from '../components/3D/Scene'
import MonochromeOverlay from '../components/ui/MonochromeOverlay'
import Carousel3D from '../components/Carousel3D'
import { useNavigation } from '../contexts/NavigationContext'
import ImpactSlides from '../components/Home/ImpactSlides'
import FAQ from '../components/Home/FAQ'
import MainVideo from '../components/Home/MainVideo'
import { useTransitionStore } from '../stores/transitionStore'
import { projects } from '../data/projects'


gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setIsScrolled } = useNavigation()
  const heroRef = useRef<HTMLElement>(null)
  const collectionsRef = useRef<HTMLElement>(null)
  const [showHeroText, setShowHeroText] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [collectionsScrollProgress, setCollectionsScrollProgress] = useState(0)
  const [globeHover, setGlobeHover] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 100)
          const heroHeight = window.innerHeight * 1.5 // Reduced from 300vh to 150vh
          const transitionHeight = window.innerHeight * 0.75 // Reduced from 150vh to 75vh

          // Calculate scroll progress through the hero section (0 to 1)
          const progress = Math.min(window.scrollY / heroHeight, 1)
          setScrollProgress(progress)

          // Hide text when camera starts tilting down (at 15% scroll progress)
          setShowHeroText(progress < 0.15)

          // Calculate star trail progress during transition section
          // Start trails when buttons begin moving inward (at 250px scroll)
          const transitionStart = 250
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
  }, [setIsScrolled])

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
      <section ref={heroRef} className="relative -z-10" style={{ height: '150vh' }}>
        {/* Empty section for scroll height */}
      </section>

      {/* Tagline - Right above arrow - Fixed position so it's on top of everything */}
      {showHeroText && (
        <motion.div
          className="fixed bottom-40 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <p className="text-3xl md:text-4xl lg:text-5xl text-white font-light">
            Together. Not Alone.
          </p>
        </motion.div>
      )}

      {/* Subtitle - Between tagline and scroll indicator */}
      {showHeroText && (
        <motion.div
          className="fixed bottom-28 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="text-white/80 text-sm tracking-widest uppercase font-bold">
            More than a slogan, it's a Promise for Change and Improvement.
          </p>
        </motion.div>
      )}

      {/* Scroll Indicator */}
      {showHeroText && (
        <motion.div
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          initial={{ opacity: 1 }}
          animate={{ y: [0, 10, 0], opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white/80 text-sm tracking-widest uppercase font-light">Scroll to learn more</span>
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
      <section className="relative -z-10" style={{ height: '75vh' }}>
        {/* Stars with trails are visible here via the fixed 3D scene */}
      </section>



      {/* Collections Section with 3D Carousel */}
      <section ref={collectionsRef} className="relative bg-transparent z-10" style={{ minHeight: '100vh', paddingTop: '8rem', paddingBottom: '8rem' }}>
        <div className="w-full relative z-10 flex flex-col items-center">
          <motion.h2
            className={`text-5xl md:text-6xl font-bold text-center mb-20 ${textColor}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Collections
          </motion.h2>

          <div className="w-full max-w-5xl" style={{ height: '600px' }}>
            <Carousel3D
              rotateSpeed={25}
              pauseOnHover={true}
              translateZ={400}
              itemWidth={340}
              itemHeight={340}
              borderRadius={12}
              showBackface={true}
              labels={[
                'Endangered Oceans',
                'One World',
                'Talk About It',
                'Cool Down',
                'Wild at Heart',
                'Embroidered',
                'Tote Bag Collection',
              ]}
            >
              {[
                {
                  name: 'SECORE International',
                  collectionHandle: 'endangered-oceans',
                  image: '/assets/images/endangered oceans back.png',
                },
                {
                  name: 'Care in Action',
                  collectionHandle: 'one-world',
                  image: '/assets/images/hoodie back one world.png',
                },
                {
                  name: 'Talk About It',
                  collectionHandle: 'talk-about-it',
                  image: '/assets/images/talk about it back.png',
                },
                {
                  name: 'Plant-For-The-Planet',
                  collectionHandle: 'cool-down',
                  image: '/assets/images/hoodie cool down.png',
                },
                {
                  name: 'Wild at Heart',
                  collectionHandle: 'wild-at-heart',
                  image: '/assets/images/wild at heart back.png',
                },
                {
                  name: 'Embroidered',
                  collectionHandle: 'embroidered-logo',
                  image: '/assets/images/embriodered hoodie.png',
                },
                {
                  name: 'Tote Bag Collection',
                  collectionHandle: 'tote-bags',
                  image: '/assets/images/tote-bag-placeholder.png',
                },
              ].map((project) => (
                <div
                  key={project.collectionHandle}
                  onClick={() => {
                    // Only filter by collection if it has products loaded
                    if (['endangered-oceans', 'one-world', 'talk-about-it'].includes(project.collectionHandle)) {
                      navigate(`/shop?collection=${project.collectionHandle}`)
                    } else {
                      // Navigate to shop without filter for collections not yet in Shopify
                      navigate('/shop')
                    }
                  }}
                  className="w-full h-full cursor-pointer overflow-hidden transition-transform hover:scale-110"
                  style={{ borderRadius: '12px' }}
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-contain"
                    style={{
                      imageRendering: 'auto',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
                      WebkitTransform: 'translateZ(0)',
                    }}
                  />
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
