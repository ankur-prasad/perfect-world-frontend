import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigation } from '../../contexts/NavigationContext'

gsap.registerPlugin(ScrollTrigger)

export default function Navigation() {
  const { isMenuOpen, toggleMenu } = useNavigation()
  const aboutUsRef = useRef<HTMLDivElement>(null)
  const shopRef = useRef<HTMLDivElement>(null)
  const transparencyRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!aboutUsRef.current || !shopRef.current || !transparencyRef.current || !menuRef.current || !logoRef.current) return

    const ctx = gsap.context(() => {
      // Shrink logo on scroll (0-250px scroll) - animates from h-20 (5rem) to h-12 (3rem)
      // GSAP reads the current computed height from h-20 class and animates to 3rem
      gsap.to(logoRef.current, {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '+=250',
          scrub: 1,
        },
        height: '3rem', // h-12 = 48px = 3rem (final size after scroll)
        ease: 'power2.out',
      })
      // Stage 1: Move Transparency UP to align with About Us (0-250px scroll)
      gsap.to(transparencyRef.current, {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '+=250',
          scrub: 1,
        },
        top: '1.5rem',
        ease: 'power2.out',
      })

      // Stage 1: Move Menu UP to align with Shop (0-250px scroll)
      gsap.to(menuRef.current, {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '+=250',
          scrub: 1,
        },
        top: '1.5rem',
        ease: 'power2.out',
      })

      // Stage 2: Move all four buttons INWARD simultaneously (250-500px scroll)
      const stage2Start = '+=250'
      const stage2End = '+=500'

      gsap.to(aboutUsRef.current, {
        scrollTrigger: {
          trigger: 'body',
          start: stage2Start,
          end: stage2End,
          scrub: 1,
        },
        left: 'calc(50vw - 300px)',
        ease: 'power2.out',
      })

      gsap.to(shopRef.current, {
        scrollTrigger: {
          trigger: 'body',
          start: stage2Start,
          end: stage2End,
          scrub: 1,
        },
        right: 'calc(50vw - 300px)',
        ease: 'power2.out',
      })

      gsap.to(transparencyRef.current, {
        scrollTrigger: {
          trigger: 'body',
          start: stage2Start,
          end: stage2End,
          scrub: 1,
        },
        left: 'calc(50vw - 450px)',
        ease: 'power2.out',
      })

      gsap.to(menuRef.current, {
        scrollTrigger: {
          trigger: 'body',
          start: stage2Start,
          end: stage2End,
          scrub: 1,
        },
        right: 'calc(50vw - 450px)',
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
            src="/assets/LOGOS/perfect-world-logo-white.png"
            alt="Perfect World"
            className="h-20 w-auto"
          />
        </Link>
      </motion.div>

      {/* Corner Navigation Links (fixed individually to avoid overlay blocking clicks) */}
      {/* About Us - Top Left */}
      <motion.div
        ref={aboutUsRef}
        className="fixed top-6 left-6 z-40"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Link
          to="/about"
          className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors inline-block"
        >
          About Us
        </Link>
      </motion.div>

      {/* Shop - Top Right */}
      <motion.div
        ref={shopRef}
        className="fixed top-6 right-6 z-40"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Link
          to="/shop"
          className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors inline-block"
        >
          Shop
        </Link>
      </motion.div>

      {/* Transparency - Bottom Left → Top Left (animated with GSAP) */}
      <motion.div
        ref={transparencyRef}
        className="fixed bottom-6 left-6 z-40"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <Link
          to="/transparency"
          className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors inline-block"
        >
          Transparency
        </Link>
      </motion.div>

      {/* Menu Button - Bottom Right → Top Right (animated with GSAP) */}
      <motion.div
        ref={menuRef}
        className="fixed bottom-6 right-6 z-40"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <button
          onClick={toggleMenu}
          className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors"
        >
          Menu
        </button>
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
