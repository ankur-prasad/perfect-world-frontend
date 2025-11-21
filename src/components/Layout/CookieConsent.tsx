import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if user has already consented
        const hasConsented = localStorage.getItem('cookie-consent')
        if (!hasConsented) {
            // Show banner after a short delay
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted')
        setIsVisible(false)
    }

    const handleReject = () => {
        localStorage.setItem('cookie-consent', 'rejected')
        setIsVisible(false)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="fixed bottom-0 left-0 right-0 z-50 w-full"
                >
                    <div className="bg-black/60 backdrop-blur-xl border-t border-white/10 p-12 md:p-16">
                        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
                                    We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                                    <button className="ml-2 text-white underline decoration-white/30 hover:decoration-white underline-offset-4 transition-all">
                                        Privacy Policy
                                    </button>
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleReject}
                                    className="px-8 py-3 bg-transparent border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-colors text-sm tracking-wide"
                                >
                                    DECLINE
                                </button>
                                <button
                                    onClick={handleAccept}
                                    className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors text-sm tracking-wide"
                                >
                                    ACCEPT
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
