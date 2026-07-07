import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../contexts/LocaleContext'

const DISMISS_KEY = 'pw-region-notice-dismissed'

// North, Central & South America + the Caribbean. We don't yet have a
// manufacturer serving this region, so visitors here get a "coming soon" note
// (they can still buy — everything ships from Europe for now).
const AMERICAS = new Set([
  // North America
  'US', 'CA', 'MX',
  // Central America & Caribbean
  'GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA', 'CU', 'DO', 'HT', 'JM', 'TT', 'BS', 'BB', 'PR',
  // South America
  'CO', 'VE', 'EC', 'PE', 'BO', 'BR', 'PY', 'UY', 'AR', 'CL', 'GY', 'SR',
])

export default function RegionNotice() {
  const { country } = useLocale()
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!country || !AMERICAS.has(country)) return
    if (localStorage.getItem(DISMISS_KEY)) return
    const timer = setTimeout(() => setIsVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [country])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem(DISMISS_KEY, 'true')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[45] w-[calc(100%-2rem)] max-w-md"
        >
          <div className="relative rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] px-5 py-4 pr-10 text-white">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="text-sm font-bold mb-1">{t('region.comingSoonTitle')}</p>
            <p className="text-xs text-gray-300 leading-relaxed">{t('region.comingSoonBody')}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
