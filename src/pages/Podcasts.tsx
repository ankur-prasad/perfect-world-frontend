import { motion } from 'framer-motion'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'

export default function Podcasts() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Navigation />

      <main className="pt-40 md:pt-48 pb-32" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 text-center">Podcasts</h1>

            <p className="text-lg md:text-xl text-gray-300 leading-relaxed text-center mb-6">
              Welcome to the "Perfect World Broadcast" — your gateway to impactful conversations
              and meaningful change. Perfect World is more than a brand; it's a catalyst for
              positive transformation.
            </p>
            <p className="text-gray-400 leading-relaxed text-center mb-6">
              Our podcast raises awareness about social, environmental, and humanitarian
              challenges while fostering support for our partner charities. Join our host and
              Perfect World's Founder, Nico, as they sit down with inspiring charity founders,
              along with visionary world changers and thought leaders.
            </p>
            <p className="text-gray-400 leading-relaxed text-center mb-16">
              Episodes explore the motivations, successes, and challenges faced by our guests,
              covering topics from sustainability and social justice to mental health advocacy.
              By listening, you not only gain valuable perspectives but also contribute to
              meaningful change. Together. Not alone.
            </p>

            <div className="border border-white/10 rounded-2xl p-8 bg-white/5 text-center">
              <p className="text-sm uppercase tracking-wider text-gray-400 mb-2">Episode 1</p>
              <h2 className="text-2xl font-semibold text-white">Let's Talk About It</h2>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
