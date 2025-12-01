import { motion } from 'framer-motion'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Header />
      <Navigation />

      <main className="pt-40 md:pt-48 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="w-full max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-16 text-center">About Us</h1>

              <div className="space-y-12 md:space-y-16">
                <p className="text-xl md:text-2xl text-gray-300 leading-loose text-center max-w-4xl mx-auto">
                  Together. Not Alone. More than a slogan, it's a Promise for Change and Improvement.
                </p>

                <div className="bg-white/5 rounded-2xl p-8 md:p-10 lg:p-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                    All Profits Donated
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300 leading-loose text-center">
                    A Brand built on creating tangible hope. With 100% of profits donated, Perfect
                    World exists to help, not to exploit.
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-8 md:p-10 lg:p-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                    Fashion as a Tool
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300 leading-loose text-center">
                    We believe in the power fashion holds to make a Statement. Giving you a voice,
                    while simultaneously aiding and supporting charities on the forefront of our
                    global challenges.
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-8 md:p-10 lg:p-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                    Why We Exist
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300 leading-loose text-center">
                    Perfect World is a brand built to create tangible hope and make a real difference
                    by supporting partner charities tackling our biggest global challenges.
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-8 md:p-10 lg:p-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                    Together. Not Alone.
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300 leading-loose text-center">
                    More than a slogan, it's our promise for change and improvement. Join the
                    movement and help us create hope.
                  </p>
                </div>

                <div className="text-center pt-12">
                  <p className="text-2xl md:text-3xl text-white font-semibold mb-8">
                    Join us in making a difference.
                  </p>
                  <a
                    href="/shop"
                    className="inline-block px-10 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-200 transition-colors"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
