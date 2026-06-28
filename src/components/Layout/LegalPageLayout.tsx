import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import Footer from './Footer'
import Navigation from './Navigation'

interface LegalPageLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function LegalPageLayout({ title, subtitle, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Navigation />

      <main className="pt-8 md:pt-12 pb-20 md:pb-24" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">{title}</h1>
            {subtitle && (
              <p className="text-gray-400 text-sm text-center mb-16">{subtitle}</p>
            )}
            {!subtitle && <div className="mb-16" />}

            <div className="prose prose-invert prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white max-w-none space-y-6 text-gray-300 leading-relaxed">
              {children}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
