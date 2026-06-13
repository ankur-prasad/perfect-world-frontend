import { motion } from 'framer-motion'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'

export default function InfoTogether() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Navigation />

      <main className="pt-10 md:pt-48 pb-32 px-6 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-10 md:mb-16 text-center">Together. Not Alone.</h1>
            <p className="text-lg md:text-xl text-gray-300 leading-loose text-center mb-8">
              More than a slogan, it's a Promise for Change and Improvement. Make a difference!
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


