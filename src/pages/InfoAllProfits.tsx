import { motion } from 'framer-motion'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'

export default function InfoAllProfits() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Navigation />

      <main className="pt-40 md:pt-48 pb-32" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-16 text-center">All Profits Donated</h1>
            <p className="text-lg md:text-xl text-gray-300 leading-loose text-center mb-8">
              A brand built on creating tangible hope. With 100% of profits donated, Perfect World
              exists to help, not to exploit.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


