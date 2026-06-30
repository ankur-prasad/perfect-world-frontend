import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DiscountPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    // Check local storage to see if user has already dismissed or subscribed
    const isDismissed = localStorage.getItem('perfectworld-discount-dismissed')
    const hasSubscribed = localStorage.getItem('perfectworld-discount-subscribed')

    if (!isDismissed && !hasSubscribed) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 3000) // 3-second delay

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('perfectworld-discount-dismissed', 'true')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    // Save subscription status
    localStorage.setItem('perfectworld-discount-subscribed', 'true')
    setIsSubscribed(true)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText('HOPE10')
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 z-50 w-auto sm:w-full max-w-[400px] p-6 rounded-3xl bg-black/85 backdrop-blur-xl border border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close popup"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {!isSubscribed ? (
            <div>
              <span className="text-xs tracking-widest text-gray-400 uppercase font-semibold block mb-1">
                WELCOME GIFT
              </span>
              <h3 
                className="text-2xl font-bold mb-3 tracking-wide"
                style={{ fontFamily: '"Shadows Into Light", cursive' }}
              >
                Join A Perfect World
              </h3>
              <p className="text-sm text-gray-300 mb-5 leading-relaxed">
                Be the first to hear about new charity releases and get <strong className="text-white">10% off</strong> your first order.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 text-sm transition-all"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 active:scale-[0.98] transition-all text-sm"
                >
                  Get 10% Off
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 
                className="text-2xl font-bold mb-2 tracking-wide"
                style={{ fontFamily: '"Shadows Into Light", cursive' }}
              >
                Welcome to the movement!
              </h3>
              <p className="text-sm text-gray-300 mb-5">
                Use code <strong className="text-white text-base">HOPE10</strong> at checkout for 10% off your first piece.
              </p>
              <button
                onClick={handleCopyCode}
                className="w-full py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
              >
                {isCopied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
