import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigation } from '../../contexts/NavigationContext'

gsap.registerPlugin(ScrollTrigger)

interface NavigationProps {
  isDarkContent?: boolean
}

export default function Navigation({ isDarkContent = false }: NavigationProps) {
  const { isMenuOpen, toggleMenu } = useNavigation()
  const aboutUsRef = useRef<HTMLDivElement>(null)
  const shopRef = useRef<HTMLDivElement>(null)
  const transparencyRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!aboutUsRef.current || !transparencyRef.current || !logoRef.current) return

    const ctx = gsap.context(() => {
      // Shrink logo on scroll (0-250px scroll)
      gsap.to(logoRef.current, {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '+=250',
          scrub: 1,
        },
        height: '3rem',
        ease: 'power2.out',
      })

      // Stage 1: Move button containers UP and align vertically (0-250px scroll)
      gsap.to([aboutUsRef.current, transparencyRef.current], {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '+=250',
          scrub: 1,
        },
        top: '1.5rem',
        transform: 'translateY(0)', // Remove vertical centering
        ease: 'power2.out',
      })

      // Stage 1: Shrink the actual link elements inside as scroll progresses (0-250px scroll)
      // Explicitly animate FROM Big TO Small
      gsap.fromTo([aboutUsRef.current?.querySelector('a'), transparencyRef.current?.querySelector('a')],
        {
          fontSize: '1.125rem', // Start: text-lg
          paddingLeft: '2rem', // Start: px-8
          paddingRight: '2rem',
          paddingTop: '0.75rem', // Start: py-3
          paddingBottom: '0.75rem',
        },
        {
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '+=250',
            scrub: 1,
          },
          fontSize: '1rem', // End: text-base
          paddingLeft: '1.5rem', // End: px-6
          paddingRight: '1.5rem',
          paddingTop: '0.5rem', // End: py-2
          paddingBottom: '0.5rem',
          ease: 'power2.out',
        }
      )

      // Stage 2: Move buttons INWARD toward logo (250-500px scroll)
      gsap.to(aboutUsRef.current, {
        scrollTrigger: {
          trigger: 'body',
          start: '+=250',
          end: '+=500',
          scrub: 1,
        },
        left: 'calc(50vw - 300px)',
        ease: 'power2.out',
      })

      gsap.to(transparencyRef.current, {
        scrollTrigger: {
          trigger: 'body',
          start: '+=250',
          end: '+=500',
          scrub: 1,
        },
        right: 'calc(50vw - 300px)',
        ease: 'power2.out',
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Centered Logo */}
      <motion.div
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Link to="/">
          <img
            ref={logoRef}
            src={isDarkContent ? "/assets/LOGOS/perfect-world-logo-black.png" : "/assets/LOGOS/perfect-world-logo-white.png"}
            alt="Perfect World"
            className="h-20 w-auto transition-all duration-300"
          />
        </Link>
      </motion.div>

      {/* Corner Navigation Links (fixed individually to avoid overlay blocking clicks) */}
      {/* Menu - Top Left */}
      <motion.div
        ref={menuRef}
        className="fixed top-6 left-6 z-40"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <button
          onClick={toggleMenu}
          className={`px-8 py-3 rounded-full backdrop-blur-sm transition-colors text-lg font-medium ${isDarkContent
              ? 'bg-black/5 text-black hover:bg-black/10'
              : 'bg-white/5 text-white hover:bg-white/10'
            }`}
        >
          Menu
        </button>
      </motion.div>

      {/* Empty div for animation target (was Shop - Top Right) */}
      <motion.div
        ref={shopRef}
        className="fixed top-6 right-6 z-40 opacity-0 pointer-events-none"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Learn More - Middle Left (starts closer to center) */}
      <motion.div
        ref={aboutUsRef}
        className="fixed top-1/2 z-40"
        style={{ left: 'calc(50vw - 450px)', transform: 'translateY(-50%)' }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <Link
          to="/about"
          className={`px-8 py-3 rounded-full backdrop-blur-sm transition-colors inline-block text-lg font-medium ${isDarkContent
              ? 'bg-black/10 text-black hover:bg-black/20'
              : 'bg-white/10 text-white hover:bg-white/20'
            }`}
        >
          Learn More
        </Link>
      </motion.div>

      {/* Make a Difference - Middle Right (starts closer to center) */}
      <motion.div
        ref={transparencyRef}
        className="fixed top-1/2 z-40"
        style={{ right: 'calc(50vw - 450px)', transform: 'translateY(-50%)' }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <Link
          to="/shop"
          className={`px-8 py-3 rounded-full transition-colors inline-block text-lg font-semibold ${isDarkContent
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-white text-black hover:bg-gray-200'
            }`}
        >
          Make a Difference
        </Link>
      </motion.div>

      {/* Full Screen Menu Overlay */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center"
        initial={{ opacity: 0, pointerEvents: 'none' }}
        animate={{
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? 'auto' : 'none',
        }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-6 right-6 text-white text-4xl hover:scale-110 transition-transform"
        >
          ×
        </button>

        <nav className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to="/"
              onClick={toggleMenu}
              className="text-4xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/about"
              onClick={toggleMenu}
              className="text-4xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              About Us
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/shop"
              onClick={toggleMenu}
              className="text-4xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              Shop
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/transparency"
              onClick={toggleMenu}
              className="text-4xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              Transparency
            </Link>
          </motion.div>

          {/* External links to live site pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
            transition={{ delay: 0.5 }}
          >
            <a
              href="https://www.perfectworld.global/collections"
              target="_blank"
              rel="noreferrer"
              className="text-4xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              Projects
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
            transition={{ delay: 0.6 }}
          >
            <a
              href="https://www.perfectworld.global/pages/faq"
              target="_blank"
              rel="noreferrer"
              className="text-4xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              FAQ
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
            transition={{ delay: 0.7 }}
          >
            <a
              href="https://www.perfectworld.global/pages/podcasts"
              target="_blank"
              rel="noreferrer"
              className="text-4xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              Podcasts
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
            transition={{ delay: 0.8 }}
          >
            <a
              href="https://www.perfectworld.global/pages/contact"
              target="_blank"
              rel="noreferrer"
              className="text-4xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              Contact
            </a>
          </motion.div>
        </nav>
      </motion.div>
    </>
  )
}
