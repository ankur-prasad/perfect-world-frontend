import { motion } from 'framer-motion'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'

export default function InfoFashionTool() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Navigation />

      <main className="pt-40 md:pt-48 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-10 text-center">Fashion as a Tool</h1>
            <p className="text-lg md:text-xl text-gray-300 leading-loose text-center mb-8">
              We believe in the power fashion holds to make a Statement. Giving you a voice, while
              simultaneously aiding and supporting charities on the forefront of our global challenges.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


