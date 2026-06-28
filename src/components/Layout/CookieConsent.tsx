import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import GlassyButton from '../ui/GlassyButton'

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
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-4rem)] max-w-max"
                >
                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-8 sm:p-10 md:p-12 lg:px-20 lg:py-16 xl:px-32 xl:py-20">
                        <div className="flex flex-col gap-10 items-center">
                            {/* Content */}
                            <div className="flex-1">
                                <h2 className="text-white text-2xl font-bold mb-4">Notice</h2>
                                <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-4xl">
                                    We (www.perfectworld.global) and selected third parties (12) collect personal information as specified in the{' '}
                                    <Link to="/privacy-policy" className="text-white hover:text-gray-300 underline decoration-white/30 underline-offset-4 transition-colors">
                                        privacy policy
                                    </Link>{' '}
                                    and use cookies or similar technologies for technical purposes and, with your consent, for{' '}
                                    <strong>functionality, experience, measurement and "marketing (personalized ads)"</strong> as specified in the{' '}
                                    <Link to="/cookie-policy" className="text-white hover:text-gray-300 underline decoration-white/30 underline-offset-4 transition-colors">
                                        cookie policy
                                    </Link>
                                    .
                                </p>
                                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-400">
                                    <p>You can freely give, deny, or withdraw your consent at any time.</p>
                                    <p>Denying consent may make related features unavailable.</p>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col gap-8 w-full max-w-2xl">
                                {/* Toggle Switches */}
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4 justify-items-center">
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
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences[key]
                                                    ? 'bg-white'
                                                    : 'bg-white/20'
                                                    } ${key === 'necessary' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${preferences[key] ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                            <span className="text-gray-300 text-sm">{label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                                    <GlassyButton
                                        onClick={() => setShowDetails(!showDetails)}
                                        label="Learn more"
                                        variant="secondary"
                                        textColor="#ffffff"
                                        paddingX="24px"
                                        paddingY="10px"
                                        fontSize="14px"
                                    />
                                    <GlassyButton
                                        onClick={handleRejectAll}
                                        label="Reject all"
                                        variant="secondary"
                                        textColor="#ffffff"
                                        paddingX="24px"
                                        paddingY="10px"
                                        fontSize="14px"
                                    />
                                    <GlassyButton
                                        onClick={handleAcceptAll}
                                        label="Accept all"
                                        background="rgba(255, 255, 255, 0.9)"
                                        hoverBackground="rgba(255, 255, 255, 1)"
                                        textColor="#000000"
                                        paddingX="32px"
                                        paddingY="10px"
                                        fontSize="14px"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Details Panel */}
                        <AnimatePresence>
                            {showDetails && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { title: 'Necessary', desc: 'Essential for the website to function and cannot be disabled.' },
                                            { title: 'Functionality', desc: 'Enable enhanced functionality and personalization.' },
                                            { title: 'Experience', desc: 'Help us understand how you interact with our website.' },
                                            { title: 'Measurement', desc: 'Help us measure traffic and analyze behavior.' },
                                            { title: 'Marketing', desc: 'Used to deliver personalized advertisements.' },
                                        ].map((item) => (
                                            <div key={item.title} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                                                <p className="text-gray-400 text-sm">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
