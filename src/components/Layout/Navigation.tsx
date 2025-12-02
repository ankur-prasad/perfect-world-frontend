import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigation } from '../../contexts/NavigationContext'
import { useCart } from '../../contexts/CartContext'
import CartDrawer from '../Cart/CartDrawer'

gsap.registerPlugin(ScrollTrigger)

interface NavigationProps {
  isDarkContent?: boolean
  enableScrollAnimations?: boolean
}

export default function Navigation({ isDarkContent = false, enableScrollAnimations = false }: NavigationProps) {
  const { isMenuOpen, toggleMenu } = useNavigation()
  const { cartCount } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const aboutUsRef = useRef<HTMLDivElement>(null)
  const shopRef = useRef<HTMLDivElement>(null)
  const transparencyRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // Only run scroll animations on home page
    if (!enableScrollAnimations) return
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
      gsap.fromTo([
        aboutUsRef.current?.querySelector('a'),
        transparencyRef.current?.querySelector('a'),
        menuRef.current?.querySelector('button'),
        shopRef.current?.querySelector('a'), // Shop button
        shopRef.current?.querySelector('button') // Cart button
      ],
        {
          fontSize: '1.125rem', // Start: text-lg
          paddingLeft: '3rem', // Start: px-12
          paddingRight: '3rem',
          paddingTop: '1rem', // Start: py-4
          paddingBottom: '1rem',
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
  }, [enableScrollAnimations])

  // Common Components
  const MenuButton = ({ isStatic = false }) => (
    <button
      onClick={toggleMenu}
      className={`rounded-full transition-colors font-semibold flex items-center gap-3 ${isStatic ? 'px-6 py-2 text-base' : 'px-12 py-4 text-lg'
        } ${isMenuOpen || (!isDarkContent && !isStatic) || (isStatic && !isDarkContent)
          ? 'bg-white/10 text-white hover:bg-white/20'
          : 'bg-gray-100 text-black hover:bg-gray-200'
        }`}
    >
      <div className="relative w-4 h-4 flex flex-col justify-center items-center">
        <motion.span
          animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 0 : -5 }}
          className={`absolute h-0.5 w-full rounded-full transition-colors ${isMenuOpen || (!isDarkContent && !isStatic) || (isStatic && !isDarkContent) ? 'bg-white' : 'bg-black'
            }`}
        />
        <motion.span
          animate={{ opacity: isMenuOpen ? 0 : 1 }}
          className={`absolute h-0.5 w-full rounded-full transition-colors ${isMenuOpen || (!isDarkContent && !isStatic) || (isStatic && !isDarkContent) ? 'bg-white' : 'bg-black'
            }`}
        />
        <motion.span
          animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? 0 : 5 }}
          className={`absolute h-0.5 w-full rounded-full transition-colors ${isMenuOpen || (!isDarkContent && !isStatic) || (isStatic && !isDarkContent) ? 'bg-white' : 'bg-black'
            }`}
        />
      </div>
      <span>{isMenuOpen ? 'Close' : 'Menu'}</span>
    </button>
  )

  const ShopButton = ({ isStatic = false }) => (
    <Link
      to="/shop"
      className={`rounded-full transition-colors font-semibold ${isStatic ? 'px-6 py-2 text-base' : 'px-12 py-4 text-lg'
        } ${isDarkContent
          ? 'bg-gray-100 text-black hover:bg-gray-200'
          : 'bg-white/10 text-white hover:bg-white/20'
        }`}
    >
      Shop
    </Link>
  )

  const CartButton = ({ isStatic = false }) => (
    <button
      onClick={() => setIsCartOpen(true)}
      className={`relative rounded-full transition-colors font-semibold flex items-center gap-3 ${isStatic ? 'px-6 py-2 text-base' : 'px-12 py-4 text-lg'
        } ${isDarkContent
          ? 'bg-black text-white hover:bg-gray-800'
          : 'bg-white text-black hover:bg-gray-200'
        }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      Cart
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  )

  const LearnMoreButton = ({ isStatic = false }) => (
    <Link
      to="/projects"
      className={`rounded-full transition-colors inline-block font-semibold ${isStatic ? 'px-6 py-2 text-base' : 'px-12 py-4 text-lg'
        } ${isDarkContent
          ? 'bg-gray-100 text-black hover:bg-gray-200'
          : 'bg-white/10 text-white hover:bg-white/20'
        }`}
    >
      Learn More
    </Link>
  )

  const MakeDifferenceButton = ({ isStatic = false }) => (
    <Link
      to="/shop"
      className={`rounded-full transition-colors inline-block font-semibold ${isStatic ? 'px-6 py-2 text-base' : 'px-12 py-4 text-lg'
        } ${isDarkContent
          ? 'bg-black text-white hover:bg-gray-800'
          : 'bg-white text-black hover:bg-gray-200'
        }`}
    >
      Make a Difference
    </Link>
  )

  // Render for Static Header (Non-Home Pages)
  if (!enableScrollAnimations) {
    return (
      <>
        <header className={`fixed top-0 left-0 right-0 z-50 ${isDarkContent ? 'bg-white border-b border-gray-200' : 'bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-md border-b border-white/10'}`}>
          <div className="h-28 px-16 flex items-center justify-between relative">

            {/* Left: Menu */}
            <div className="flex-shrink-0 z-50">
              <MenuButton isStatic={true} />
            </div>

            {/* Center Group: Learn More - Logo - Make a Difference */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8 z-40">
              <LearnMoreButton isStatic={true} />

              <Link to="/">
                <img
                  src={isDarkContent ? "/assets/LOGOS/perfect-world-logo-black.png" : "/assets/LOGOS/perfect-world-logo-white.png"}
                  alt="Perfect World"
                  className="h-12 w-auto"
                />
              </Link>

              <MakeDifferenceButton isStatic={true} />
            </div>

            {/* Right: Shop & Cart */}
            <div className="flex items-center gap-3 flex-shrink-0 z-50">
              <ShopButton isStatic={true} />
              <CartButton isStatic={true} />
            </div>

          </div>
        </header>
        {/* Spacer to prevent content from going behind fixed header */}
        <div className="h-28" aria-hidden="true" />

        <MenuOverlay isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </>
    )
  }

  // Render for Animated Header (Home Page)
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

      {/* Menu - Top Left */}
      <motion.div
        ref={menuRef}
        className="fixed top-6 left-6 z-[60]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <MenuButton />
      </motion.div>

      {/* Cart and Shop - Top Right */}
      <motion.div
        ref={shopRef}
        className="fixed top-6 right-6 z-40 flex items-center gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <ShopButton />
        <CartButton />
      </motion.div>

      {/* Learn More - Middle Left */}
      <motion.div
        ref={aboutUsRef}
        className="fixed top-1/2 z-40"
        style={{ left: 'calc(50vw - 450px)', transform: 'translateY(-50%)' }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <LearnMoreButton />
      </motion.div>

      {/* Make a Difference - Middle Right */}
      <motion.div
        ref={transparencyRef}
        className="fixed top-1/2 z-40"
        style={{ right: 'calc(50vw - 450px)', transform: 'translateY(-50%)' }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <MakeDifferenceButton />
      </motion.div>

      <MenuOverlay isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

// Helper component for Menu Overlay to reduce duplication
function MenuOverlay({ isMenuOpen, toggleMenu }: { isMenuOpen: boolean, toggleMenu: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center"
      initial={{ opacity: 0, pointerEvents: 'none' }}
      animate={{
        opacity: isMenuOpen ? 1 : 0,
        pointerEvents: isMenuOpen ? 'auto' : 'none',
      }}
      transition={{ duration: 0.4 }}
    >
      <nav className="flex flex-col items-center gap-8">
        {[
          { to: "/", label: "Home" },
          { to: "/projects", label: "Projects" },
          { to: "/about", label: "About Us" },
          { to: "/shop", label: "Shop" },
          { to: "/transparency", label: "Transparency" },
        ].map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Link
              to={item.to}
              onClick={toggleMenu}
              className="text-4xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              {item.label}
            </Link>
          </motion.div>
        ))}

        {/* External Links */}
        {[
          { href: "https://www.perfectworld.global/collections", label: "Projects" },
          { href: "https://www.perfectworld.global/pages/faq", label: "FAQ" },
          { href: "https://www.perfectworld.global/pages/podcasts", label: "Podcasts" },
          { href: "https://www.perfectworld.global/pages/contact", label: "Contact" },
        ].map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : 20 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="text-4xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              {item.label}
            </a>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  )
}
