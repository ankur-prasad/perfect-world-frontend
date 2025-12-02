import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CookiePreferences {
    necessary: boolean
    functionality: boolean
    experience: boolean
    measurement: boolean
    marketing: boolean
}

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Always true, can't be disabled
        functionality: false,
        experience: false,
        measurement: false,
        marketing: false,
    })

    useEffect(() => {
        // Check if user has already consented
        const hasConsented = localStorage.getItem('cookie-consent')
        if (!hasConsented) {
            // Show banner after a short delay
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAcceptAll = () => {
        const allAccepted = {
            necessary: true,
            functionality: true,
            experience: true,
            measurement: true,
            marketing: true,
        }
        localStorage.setItem('cookie-consent', 'accepted')
        localStorage.setItem('cookie-preferences', JSON.stringify(allAccepted))
        setIsVisible(false)
    }

    const handleRejectAll = () => {
        const onlyNecessary = {
            necessary: true,
            functionality: false,
            experience: false,
            measurement: false,
            marketing: false,
        }
        localStorage.setItem('cookie-consent', 'rejected')
        localStorage.setItem('cookie-preferences', JSON.stringify(onlyNecessary))
        setIsVisible(false)
    }

    const togglePreference = (key: keyof CookiePreferences) => {
        if (key === 'necessary') return // Can't disable necessary cookies
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
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
                    <div className="bg-black/95 backdrop-blur-xl border-t border-white/10 p-10 md:p-16">
                        <div className="container mx-auto max-w-6xl">
                            {/* Header */}
                            <div className="mb-12">
                                <h2 className="text-white text-2xl md:text-3xl font-bold mb-8">Notice</h2>
                                <p className="text-gray-300 text-base leading-loose mb-8">
                                    We (www.perfectworld.global) and selected third parties (12) collect personal information as specified in the{' '}
                                    <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
                                        privacy policy
                                    </a>{' '}
                                    and use cookies or similar technologies for technical purposes and, with your consent, for{' '}
                                    <strong>functionality, experience, measurement and "marketing (personalized ads)"</strong> as specified in the{' '}
                                    <a href="/cookie-policy" className="text-blue-400 hover:text-blue-300 underline">
                                        cookie policy
                                    </a>
                                    .
                                </p>
                                <p className="text-gray-400 text-base leading-loose mt-10">
                                    You can freely give, deny, or withdraw your consent at any time by accessing the preferences panel. Denying consent may make related features unavailable.
                                </p>
                                <p className="text-gray-400 text-base leading-loose mt-6">
                                    Use the "Accept all" button to consent. Use the "Reject all" button to continue without accepting.
                                </p>
                            </div>

                            {/* Toggle Switches */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-14">
                                {[
                                    { key: 'necessary' as const, label: 'Necessary' },
                                    { key: 'functionality' as const, label: 'Functionality' },
                                    { key: 'experience' as const, label: 'Experience' },
                                    { key: 'measurement' as const, label: 'Measurement' },
                                    { key: 'marketing' as const, label: 'Marketing' },
                                ].map(({ key, label }) => (
                                    <div key={key} className="flex items-center gap-3">
                                        <button
                                            onClick={() => togglePreference(key)}
                                            disabled={key === 'necessary'}
                                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${preferences[key]
                                                ? 'bg-emerald-500'
                                                : 'bg-gray-600'
                                                } ${key === 'necessary' ? 'opacity-100' : 'cursor-pointer'}`}
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${preferences[key] ? 'translate-x-8' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                        <span className="text-white text-sm font-medium">{label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="px-12 py-4 bg-gray-700 text-white font-semibold rounded-full hover:bg-gray-600 transition-colors"
                                >
                                    Learn more
                                </button>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleRejectAll}
                                        className="px-12 py-4 bg-gray-700 text-white font-semibold rounded-full hover:bg-gray-600 transition-colors"
                                    >
                                        Reject all
                                    </button>
                                    <button
                                        onClick={handleAcceptAll}
                                        className="px-12 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-500 transition-colors"
                                    >
                                        Accept all
                                    </button>
                                </div>
                            </div>

                            {/* Details Panel */}
                            <AnimatePresence>
                                {showDetails && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mt-6 overflow-hidden"
                                    >
                                        <div className="bg-white/5 rounded-xl p-6 space-y-4">
                                            <div>
                                                <h3 className="text-white font-semibold mb-2">Necessary</h3>
                                                <p className="text-gray-400 text-sm">
                                                    These cookies are essential for the website to function and cannot be disabled.
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold mb-2">Functionality</h3>
                                                <p className="text-gray-400 text-sm">
                                                    These cookies enable enhanced functionality and personalization, such as remembering your preferences.
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold mb-2">Experience</h3>
                                                <p className="text-gray-400 text-sm">
                                                    These cookies help us understand how you interact with our website to improve your experience.
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold mb-2">Measurement</h3>
                                                <p className="text-gray-400 text-sm">
                                                    These cookies help us measure traffic and analyze your behavior to improve our service.
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold mb-2">Marketing</h3>
                                                <p className="text-gray-400 text-sm">
                                                    These cookies are used to deliver personalized advertisements relevant to you and your interests.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
