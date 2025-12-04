import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useNavigation } from '../../contexts/NavigationContext'
import { useCart } from '../../contexts/CartContext'
import CartDrawer from '../Cart/CartDrawer'

interface HeaderProps {
  showBackButton?: boolean
  onBackClick?: () => void
  centerContent?: React.ReactNode
  hideMainLogo?: boolean
}

export default function Header({ showBackButton = false, onBackClick, centerContent, hideMainLogo = false }: HeaderProps) {
  const { isScrolled } = useNavigation()
  const { cartCount } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-md border-b border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-8 py-8">
          <div className="flex items-center justify-between gap-12">
            {/* Left: Back Button */}
            <div className="flex-shrink-0 min-w-fit">
              {showBackButton && (
                <motion.button
                  onClick={onBackClick}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span>Back</span>
                </motion.button>
              )}
            </div>

            {/* Center Content or Logo */}
            <div className="flex-1 flex items-center justify-center min-w-0">
              {centerContent ? (
                <div className="flex flex-col items-center justify-center gap-3">
                  {centerContent}
                </div>
              ) : (
                <motion.div
                  className={`text-center transition-all duration-600 ${hideMainLogo ? 'hidden' : ''
                    }`}
                  animate={{
                    scale: isScrolled ? 0.6 : 1,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <Link to="/">
                    <h1 className="text-4xl font-bold text-white tracking-wider font-primary">
                      PERFECT WORLD
                    </h1>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Right: Cart Icon */}
            <div className="flex-shrink-0 min-w-fit">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={cartCount}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Cart Drawer */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </motion.header>

      {/* Spacer to prevent page content from going behind fixed header */}
      <div aria-hidden className="h-28 md:h-32 lg:h-36" />
    </>
  )
}
