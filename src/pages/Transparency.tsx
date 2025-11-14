import { motion } from 'framer-motion'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'

export default function Transparency() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Header />
      <Navigation />

      <main className="pt-40 md:pt-48 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-16 text-center">Transparency</h1>

            <div className="space-y-12 md:space-y-16">
              <p className="text-xl md:text-2xl text-gray-300 leading-loose text-center max-w-4xl mx-auto">
                We believe that trust is built through openness, so we provide a clear breakdown of
                all our costs, from production and operations to the donations we make to our partner
                charities.
              </p>

              <div className="bg-white/5 rounded-2xl p-8 md:p-10 lg:p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Financial Breakdown</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span>Product Costs (Materials, Manufacturing)</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span>Operations (Shipping, Storage, Platform)</span>
                    <span className="font-semibold">30%</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span>Marketing & Outreach</span>
                    <span className="font-semibold">10%</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-bold text-white">Donated to Charities</span>
                    <span className="text-xl font-bold text-green-400">100% of Profits</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 md:p-8 lg:p-10">
                <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
                <ol className="list-decimal list-inside space-y-3">
                  <li>You purchase a product from one of our collections</li>
                  <li>We cover all costs of production, shipping, and operations</li>
                  <li>
                    100% of the remaining profit is donated to the charity associated with that
                    collection
                  </li>
                  <li>We provide quarterly reports showing total donations and impact</li>
                </ol>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 md:p-8 lg:p-10">
                <h2 className="text-3xl font-bold text-white mb-4">Donation Tracking</h2>
                <p className="mb-4">
                  Every quarter, we publish detailed reports showing:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Total revenue by collection</li>
                  <li>Cost breakdowns</li>
                  <li>Profit calculations</li>
                  <li>Donation amounts to each charity</li>
                  <li>Impact metrics from our partner organizations</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 md:p-8 lg:p-10">
                <h2 className="text-3xl font-bold text-white mb-4">Our Partner Charities</h2>
                <p className="mb-4">
                  We carefully select established, reputable charitable organizations with proven
                  track records. Each partner provides:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Detailed impact reports</li>
                  <li>Financial transparency</li>
                  <li>Regular updates on project progress</li>
                  <li>Third-party audits and certifications</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 md:p-8 lg:p-10">
                <h2 className="text-3xl font-bold text-white mb-4">Certifications</h2>
                <p>
                  Perfect World is committed to ethical business practices. We maintain:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Fair Trade Certified suppliers</li>
                  <li>Ethical manufacturing partnerships</li>
                  <li>Sustainable material sourcing</li>
                  <li>Carbon-neutral shipping options</li>
                </ul>
              </div>

              <div className="text-center pt-8">
                <p className="text-lg mb-4">
                  Have questions about our transparency practices?
                </p>
                <a
                  href="mailto:transparency@perfectworld.global"
                  className="inline-block px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
