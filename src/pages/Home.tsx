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
import ImpactSlides from '../components/Home/ImpactSlides'
import FAQ from '../components/Home/FAQ'
import MainVideo from '../components/Home/MainVideo'

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
          // Start trails when camera starts panning (at 30% of hero height)
          const transitionStart = heroHeight * 0.3
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


  const handleSatelliteClick = (projectSlug: string) => {
    navigate(`/project/${projectSlug}`)
  }

  // Calculate background color based on transition progress
  // Interpolate from Black (#000000) to White (#FFFFFF)
  // Start transition later (0.4) to let star trails build up and "create" the white
  const bgLightness = Math.max(0, Math.min(100, (collectionsScrollProgress - 0.4) * 2 * 100))
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



      {/* Collections Section with Glowing Cards */}
      <section ref={collectionsRef} className="relative min-h-screen py-32 pb-32 bg-transparent z-10">
        <div className="container mx-auto px-4 max-w-[1600px] w-full relative z-10">
          <motion.h2
            className={`text-5xl md:text-6xl font-bold text-center mb-[280px] ${textColor}`}
            style={{ marginBottom: '100px' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Collections
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
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
                name: 'Plant-For-The-Planet',
                slug: 'plant-for-the-planet',
                description: 'Fighting climate change through reforestation',
                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2560&auto=format&fit=crop',
                color: '#27AE60'
              },
              {
                name: 'Wild at Heart',
                slug: 'wild-at-heart',
                description: 'Protecting endangered elephant populations',
                image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=2560&auto=format&fit=crop',
                color: '#95A5A6'
              },
              {
                name: 'Support All',
                slug: 'support-all',
                description: 'Support all our initiatives with the Embroidered Collection',
                image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2560&auto=format&fit=crop',
                color: '#ffffff'
              },
            ].map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer w-full max-w-sm h-full"
                onClick={() => handleSatelliteClick(project.slug)}
              >
                <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 transform hover:-translate-y-2">

                  {/* Full Bleed Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

                    {/* Overlay Text on Image (Optional, or keep it below) - Let's keep it clean and put text below */}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>

                    <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex gap-3 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSatelliteClick(project.slug);
                        }}
                        className="px-12 py-4 rounded-full bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition-colors text-lg"
                      >
                        Learn More
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/shop');
                        }}
                        className="px-12 py-4 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors text-lg"
                      >
                        Shop Collection
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
