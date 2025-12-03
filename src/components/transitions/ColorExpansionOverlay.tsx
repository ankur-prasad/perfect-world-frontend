import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MeshGradient } from '@paper-design/shaders-react'
import { useTransitionStore } from '../../stores/transitionStore'

export default function ColorExpansionOverlay() {
  const { isTransitioning, direction, data } = useTransitionStore()
  const [isMobile, setIsMobile] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia('(max-width: 768px)').matches ||
          'ontouchstart' in window
      )
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Control visibility - keep showing even after transition ends for fade-out
  useEffect(() => {
    if (isTransitioning) {
      setShouldShow(true)
    } else {
      // Delay hiding to allow exit animation
      const timer = setTimeout(() => setShouldShow(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  if (!shouldShow || !data) return null

  const { gradientColors } = data
  const isReverse = direction === 'reverse'

  // MeshGradient settings based on device
  const meshSettings = isMobile
    ? {
        width: 1280,
        height: 720,
        distortion: 0.8,
        swirl: 0.6,
      }
    : {
        width: 1920,
        height: 1080,
        distortion: 1.2,
        swirl: 1.0,
      }

  return (
    <AnimatePresence mode="wait">
      {shouldShow && (
        <motion.div
          key="transition-overlay"
          className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: isTransitioning ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Full gradient mesh expansion from tag shape */}
          <motion.div
            className="absolute inset-0"
            initial={
              isReverse
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            animate={
              isReverse
                ? { opacity: 0 }
                : { opacity: 1 }
            }
            exit={{ opacity: 0 }}
            transition={{
              duration: isReverse ? 0.7 : (isMobile ? 0.8 : 1.1),
              ease: isReverse
                ? [0.4, 0, 0.6, 1]
                : [0.25, 0.1, 0.25, 1],
            }}
          >
            <div className="w-full h-full">
              <MeshGradient
                colors={gradientColors}
                speed={0.4}
                grainMixer={0}
                {...meshSettings}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
