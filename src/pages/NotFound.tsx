import { Link } from 'react-router-dom'
import Navigation from '../components/Layout/Navigation'
import Footer from '../components/Layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation isDarkContent={true} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-28 pb-20 text-center">
        <h1 className="text-7xl md:text-9xl font-bold text-gray-900 font-primary">404</h1>
        <p className="mt-4 text-xl md:text-2xl text-gray-600">
          This page doesn't exist — but a perfect world might.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/shop"
            className="px-10 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors"
          >
            Shop the Collections
          </Link>
          <Link
            to="/"
            className="px-10 py-4 border border-gray-300 text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
