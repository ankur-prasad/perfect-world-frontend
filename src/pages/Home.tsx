import { useEffect, Suspense, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from '../components/Layout/Navigation'
import Footer from '../components/Layout/Footer'
import Scene from '../components/3D/Scene'
import MonochromeOverlay from '../components/ui/MonochromeOverlay'
import { useNavigation } from '../contexts/NavigationContext'
import { GlowingEffect } from '../components/ui/glowing-effect'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const navigate = useNavigate()
  const { setIsScrolled } = useNavigation()
  const heroRef = useRef<HTMLElement>(null)
  const collectionsRef = useRef<HTMLElement>(null)
  const [showHeroText, setShowHeroText] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [collectionsScrollProgress, setCollectionsScrollProgress] = useState(0)
  const [globeHover, setGlobeHover] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
      const heroHeight = window.innerHeight * 5 // Hero section is 500vh
      const transitionHeight = window.innerHeight * 3 // Transition section is 300vh

      // Calculate scroll progress through the hero section (0 to 1)
      const progress = Math.min(window.scrollY / heroHeight, 1)
      setScrollProgress(progress)

      // Hide text when camera starts tilting down (at 15% scroll progress)
      setShowHeroText(progress < 0.15)

      // Calculate star trail progress during transition section
      const transitionStart = heroHeight
      const transitionEnd = heroHeight + transitionHeight

      if (window.scrollY >= transitionStart && window.scrollY <= transitionEnd) {
        const transitionProgress = (window.scrollY - transitionStart) / transitionHeight
        setCollectionsScrollProgress(transitionProgress)
      } else if (window.scrollY > transitionEnd) {
        setCollectionsScrollProgress(1)
      } else {
        setCollectionsScrollProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setIsScrolled])


  const handleSatelliteClick = (projectSlug: string) => {
    navigate(`/project/${projectSlug}`)
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

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
      <MonochromeOverlay reduced={globeHover} />

      {/* Extended Hero Section with 3D Globe and Stars - 5 screens tall */}
      <section ref={heroRef} className="relative -z-10" style={{ height: '500vh' }}>
        {/* Empty section for scroll height */}
      </section>

      {/* Tagline - Right above arrow - Fixed position so it's on top of everything */}
      {showHeroText && (
        <motion.div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <p className="text-xl md:text-2xl lg:text-3xl text-white" style={{ fontFamily: '"Shadows Into Light", "Indie Flower", cursive', fontWeight: 300 }}>
            Together. Not Alone.
          </p>
        </motion.div>
      )}

      {/* Scroll Indicator */}
      {showHeroText && (
        <motion.div
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 1 }}
          animate={{ y: [0, 10, 0], opacity: 1 }}
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

      {/* Transition section for star trails - 3 screens tall */}
      <section className="relative -z-10" style={{ height: '300vh' }}>
        {/* Stars with trails are visible here via the fixed 3D scene */}
      </section>

      {/* Collections Section with Glowing Cards */}
      <section ref={collectionsRef} className="relative min-h-screen py-32 pb-96 bg-transparent flex items-center z-10">
        <div className="container mx-auto px-4 max-w-7xl w-full relative z-10">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-white text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Collections
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 justify-items-center">
            {[
              {
                name: 'SECORE International',
                slug: 'secore-international',
                description: 'Restoring coral reefs and marine ecosystems worldwide',
                image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=2560&auto=format&fit=crop',
                color: '#0077BE'
              },
              {
                name: 'Care in Action',
                slug: 'care-in-action',
                description: 'Supporting humanitarian relief and development',
                image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2560&auto=format&fit=crop',
                color: '#E74C3C'
              },
              {
                name: 'Talk About It',
                slug: 'mental-health-initiative',
                description: 'Breaking the stigma around mental health',
                image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2560&auto=format&fit=crop',
                color: '#9B59B6'
              },
              {
                name: 'Plant for the Planet',
                slug: 'plant-for-the-planet',
                description: 'Fighting climate change through reforestation',
                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2560&auto=format&fit=crop',
                color: '#27AE60'
              },
              {
                name: 'Save the Elephants',
                slug: 'elephant-endangerment',
                description: 'Protecting endangered elephant populations',
                image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=2560&auto=format&fit=crop',
                color: '#95A5A6'
              },
            ].map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer w-full max-w-sm"
                onClick={() => handleSatelliteClick(project.slug)}
              >
                <div className="relative rounded-2xl overflow-hidden bg-black/50 backdrop-blur-sm h-full border border-white/10">
                  <GlowingEffect
                    disabled={false}
                    proximity={300}
                    spread={40}
                    blur={8}
                    borderWidth={3}
                  />

                  <div className="relative p-6 h-full flex flex-col z-10">
                    <div className="relative w-full aspect-[4/5] mb-4 rounded-xl overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      {project.name}
                    </h3>

                    <p className="text-sm text-gray-300 mb-4 flex-grow">
                      {project.description}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSatelliteClick(project.slug);
                        }}
                        className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white text-sm hover:bg-white/10 transition-colors"
                      >
                        Learn More
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/shop');
                        }}
                        className="flex-1 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Shop
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
