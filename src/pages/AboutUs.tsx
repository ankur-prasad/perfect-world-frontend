import { motion } from 'framer-motion'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Navigation />

      <main className="pt-40 md:pt-48 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="w-full max-w-[900px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 md:space-y-10"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-12 text-center">About Us</h1>

              <div className="prose prose-invert prose-lg md:prose-xl max-w-none">
                <p className="text-gray-300 leading-relaxed mb-6">
                  You care.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  You see what's happening in the world — the hurt, the chaos, the things that shouldn't be normal.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  And maybe sometimes you feel powerless, because… where do you even start?
                </p>

                <p className="text-white font-semibold text-xl md:text-2xl leading-relaxed my-8">
                  Perfect World exists for exactly that moment.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Here, what you buy becomes something meaningful.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Here, your hoodie supports mental health.<br />
                  Your t-shirt protects elephants.<br />
                  Your purchase helps plant trees and supports kids in crisis areas.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Because 100% of the profits go to NGOs.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Not as a marketing trick.<br />
                  Not as "charity branding".
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  But because you deserve to live in a world where business isn't built on greed —<br />
                  where your everyday choices can actually help someone else breathe a little easier.
                </p>

                <p className="text-white font-semibold text-xl md:text-2xl leading-relaxed my-8">
                  You don't have to be perfect to make a difference.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  You just have to begin — with the things you already do.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  With the clothes you wear.<br />
                  With the values you carry.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Perfect World is here to give you a way to make that impact real.<br />
                  To turn your voice into action.<br />
                  To show that hope isn't naive —<br />
                  hope is necessary.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  This isn't just clothing.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  This is you saying:<br />
                  <span className="text-white italic">"I want my life to mean something good."</span>
                </p>

                <p className="text-white font-semibold text-xl md:text-2xl leading-relaxed my-8">
                  Perfect World isn't a brand you buy from.<br />
                  It's a movement you're part of.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  A community built on honesty, compassion, and the belief that the world changes when you choose to care.
                </p>

                <p className="text-white font-bold text-2xl md:text-3xl leading-relaxed mt-12 mb-6">
                  Welcome to Perfect World.
                </p>

                <p className="text-white font-bold text-2xl md:text-3xl leading-relaxed mb-12">
                  Welcome to a better way of doing things.
                </p>

                <div className="text-center pt-8">
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
