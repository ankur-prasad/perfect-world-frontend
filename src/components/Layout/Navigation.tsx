import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigation } from '../../contexts/NavigationContext'
import { useCart } from '../../contexts/CartContext'
import CartDrawer from '../Cart/CartDrawer'
import GlassyButton from '../ui/GlassyButton'
import logoBlack from '../../assets/logos/perfect-world-logo-black.png'
import logoWhite from '../../assets/logos/perfect-world-logo-white.png'

gsap.registerPlugin(ScrollTrigger)

interface NavigationProps {
  isDarkContent?: boolean
  enableScrollAnimations?: boolean
}

export default function Navigation({ isDarkContent = false, enableScrollAnimations = false }: NavigationProps) {
  const { isMenuOpen, toggleMenu } = useNavigation()
  const { cartCount, isCartOpen, openCart, closeCart } = useCart()
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
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const endValue = `+=${scrollHeight * 0.05}`

      // Shrink logo on scroll (0-5% scroll)
      gsap.to(logoRef.current, {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: endValue,
          scrub: 1,
        },
        height: '3rem',
        ease: 'power2.out',
      })

      // Stage 1: Move button containers UP and align vertically (0-5% scroll)
      gsap.to([aboutUsRef.current, transparencyRef.current], {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: endValue,
          scrub: 1,
        },
        top: '1.5rem',
        transform: 'translateY(0)', // Remove vertical centering
        ease: 'power2.out',
      })

      // Stage 1: Shrink the actual link elements inside as scroll progresses (0-5% scroll)
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
            end: endValue,
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

      // Stage 2: Move buttons INWARD toward logo (5-10% scroll)
      const stage2EndValue = `+=${scrollHeight * 0.1}` // Another 5%

      gsap.to(aboutUsRef.current, {
        scrollTrigger: {
          trigger: 'body',
          start: endValue,
          end: stage2EndValue,
          scrub: 1,
        },
        left: 'calc(50vw - 300px)',
        ease: 'power2.out',
      })

      gsap.to(transparencyRef.current, {
        scrollTrigger: {
          trigger: 'body',
          start: endValue,
          end: stage2EndValue,
          scrub: 1,
        },
        right: 'calc(50vw - 300px)',
        ease: 'power2.out',
      })

      // Animate Button Styles (Glow & Color -> Standard)
      // Learn More Button
      const learnMoreBtn = aboutUsRef.current?.querySelector('.learn-more-btn')
      if (learnMoreBtn) {
        gsap.fromTo(learnMoreBtn,
          {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            boxShadow: '0 0 30px 5px rgba(255, 255, 255, 0.3)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          },
          {
            scrollTrigger: {
              trigger: 'body',
              start: 'top top',
              end: endValue,
              scrub: 1,
            },
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Standard light variant bg
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)', // Standard shadow
            borderColor: 'rgba(255, 255, 255, 0.22)', // Standard border
            ease: 'power2.out'
          }
        )
      }

      // Make a Difference Button
      const makeDiffBtn = transparencyRef.current?.querySelector('.make-diff-btn')
      if (makeDiffBtn) {
        gsap.fromTo(makeDiffBtn,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0 0 30px 5px rgba(255, 255, 255, 0.3)',
            borderColor: 'rgba(255, 255, 255, 0.6)'
          },
          {
            scrollTrigger: {
              trigger: 'body',
              start: 'top top',
              end: endValue,
              scrub: 1,
            },
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Standard light variant bg
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)', // Standard shadow
            borderColor: 'rgba(255, 255, 255, 0.22)', // Standard border
            ease: 'power2.out'
          }
        )
      }
    })

    return () => ctx.revert()
  }, [enableScrollAnimations])

  // Common Components
  const MenuButton = () => {
    const iconColor = (isMenuOpen || !isDarkContent) ? 'bg-white' : 'bg-black'

    return (
      <GlassyButton
        onClick={toggleMenu}
        variant={(isMenuOpen || !isDarkContent) ? 'light' : 'secondary'}
        textColor={isDarkContent ? '#000000' : '#ffffff'}
      >
        <div className="relative w-4 h-4 flex flex-col justify-center items-center">
          <motion.span
            animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 0 : -5 }}
            className={`absolute h-0.5 w-full rounded-full transition-colors ${iconColor}`}
          />
          <motion.span
            animate={{ opacity: isMenuOpen ? 0 : 1 }}
            className={`absolute h-0.5 w-full rounded-full transition-colors ${iconColor}`}
          />
          <motion.span
            animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? 0 : 5 }}
            className={`absolute h-0.5 w-full rounded-full transition-colors ${iconColor}`}
          />
        </div>
      </GlassyButton>
    )
  }

  const ShopButton = ({ isMobile = false }: { isMobile?: boolean }) => (
    <GlassyButton
      to="/shop"
      variant={isDarkContent ? 'secondary' : 'light'}
      textColor={isDarkContent ? '#000000' : '#ffffff'}
      paddingX={isMobile ? "20px" : "32px"}
      paddingY={isMobile ? "6px" : undefined}
    >
      <span className={isMobile ? "text-xs font-semibold" : "text-sm font-semibold"}>Shop</span>
    </GlassyButton>
  )

  const CartButton = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="relative">
      <GlassyButton
        onClick={() => (isCartOpen ? closeCart() : openCart())}
        variant={isDarkContent ? 'primary' : 'light'}
        textColor={isDarkContent ? '#000000' : '#ffffff'}
        paddingX={isMobile ? "20px" : "32px"}
        paddingY={isMobile ? "6px" : undefined}
      >
        {isCartOpen ? (
          // X icon when cart is open
          <svg className={isMobile ? "w-4 h-4" : "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Cart icon when cart is closed
          <svg className={isMobile ? "w-4 h-4" : "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )}
      </GlassyButton>
      {!isCartOpen && cartCount > 0 && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center z-50">
          {cartCount}
        </span>
      )}
    </div>
  )

  const LearnMoreButton = () => (
    <GlassyButton
      label="Learn More"
      to="/projects"
      variant={isDarkContent ? 'secondary' : 'light'}
      textColor={isDarkContent ? '#000000' : '#ffffff'}
      className="learn-more-btn"
    />
  )

  const MakeDifferenceButton = () => (
    <GlassyButton
      label="Make a Difference"
      to="/shop"
      variant={isDarkContent ? 'primary' : 'light'}
      textColor={isDarkContent ? '#000000' : '#ffffff'}
      className="make-diff-btn"
    />
  )

  // Render for Static Header (Non-Home Pages)
  if (!enableScrollAnimations) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-[60]">
          {/* Desktop Layout */}
          <div className="hidden md:flex h-20 px-6 items-center justify-between relative">
            {/* Left: Menu */}
            <div className="flex-shrink-0 z-[60]">
              <MenuButton />
            </div>

            {/* Center Group: Learn More - Logo - Make a Difference */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8 z-40">
              <LearnMoreButton />

              <Link to="/">
                <img
                  src={isDarkContent ? logoBlack : logoWhite}
                  alt="Perfect World"
                  className="h-12 w-auto"
                />
              </Link>

              <MakeDifferenceButton />
            </div>

            {/* Right: Shop & Cart */}
            <div className="flex items-center gap-3 flex-shrink-0 z-50">
              <ShopButton />
              <CartButton />
            </div>
          </div>

          {/* Mobile Layout - Same as Home Page */}
          <div className="md:hidden h-20 px-3 relative">
            <div className="absolute left-3 top-6 z-[60]">
              {/* Left: Menu */}
              <MenuButton />
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 top-6 -translate-x-1/2 z-40">
              <Link to="/">
                <img
                  src={isDarkContent ? logoBlack : logoWhite}
                  alt="Perfect World"
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Right: Cart & Shop (stacked) */}
            <div className="absolute right-3 top-6 flex flex-col items-end gap-1.5 z-50">
              <CartButton isMobile={true} />
              <ShopButton isMobile={true} />
            </div>
          </div>
        </header>
        {/* Spacer to prevent content from going behind fixed header */}
        <div className="h-20" aria-hidden="true" />

        <MenuOverlay isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
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
            src={isDarkContent ? logoBlack : logoWhite}
            alt="Perfect World"
            className="h-14 md:h-20 w-auto transition-all duration-300"
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

      {/* Cart and Shop - Top Right (Stack vertically on mobile with smaller buttons) */}
      <motion.div
        ref={shopRef}
        className="fixed top-6 right-3 md:right-6 z-40 flex flex-col md:flex-row items-end md:items-center gap-1.5 md:gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="md:hidden">
          <CartButton isMobile={true} />
        </div>
        <div className="md:hidden">
          <ShopButton isMobile={true} />
        </div>
        <div className="hidden md:block">
          <CartButton isMobile={false} />
        </div>
        <div className="hidden md:block">
          <ShopButton isMobile={false} />
        </div>
      </motion.div>

      {/* Learn More - Middle Left (Hidden on mobile) */}
      <motion.div
        ref={aboutUsRef}
        className="fixed top-1/2 z-40 hidden md:block"
        style={{ left: 'calc(50vw - 450px)', transform: 'translateY(-50%)' }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <LearnMoreButton />
      </motion.div>

      {/* Make a Difference - Middle Right (Hidden on mobile) */}
      <motion.div
        ref={transparencyRef}
        className="fixed top-1/2 z-40 hidden md:block"
        style={{ right: 'calc(50vw - 450px)', transform: 'translateY(-50%)' }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <MakeDifferenceButton />
      </motion.div>

      <MenuOverlay isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}

// Helper component for Menu Overlay to reduce duplication
function MenuOverlay({ isMenuOpen, toggleMenu }: { isMenuOpen: boolean, toggleMenu: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col overflow-y-auto"
      initial={{ opacity: 0, pointerEvents: 'none' }}
      animate={{
        opacity: isMenuOpen ? 1 : 0,
        pointerEvents: isMenuOpen ? 'auto' : 'none',
      }}
      transition={{ duration: 0.4 }}
    >
      {/* m-auto centers when content fits and allows scrolling when it doesn't */}
      <nav className="flex flex-col items-center gap-5 md:gap-8 m-auto py-24">
        {[
          { to: "/", label: "Home" },
          { to: "/projects", label: "Projects" },
          { to: "/about", label: "About Us" },
          { to: "/shop", label: "Shop" },
          { to: "/transparency", label: "Transparency" },
          { to: "/#faq", label: "FAQ" },
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
              className="text-3xl md:text-4xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              {item.label}
            </Link>
          </motion.div>
        ))}

        {/* External Links */}
        {[
          { href: "https://shop.perfectworld.global/pages/podcasts", label: "Podcasts" },
          { href: "https://shop.perfectworld.global/pages/contact", label: "Contact" },
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
              className="text-3xl md:text-4xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              {item.label}
            </a>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  )
}
