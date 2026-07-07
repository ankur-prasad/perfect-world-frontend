import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { CartProvider } from './contexts/CartContext'
import { NavigationProvider } from './contexts/NavigationContext'
import { LocaleProvider } from './contexts/LocaleContext'

import CookieConsent from './components/Layout/CookieConsent'
import ColorExpansionOverlay from './components/transitions/ColorExpansionOverlay'
import ScrollToTop from './components/Layout/ScrollToTop'
import DiscountPopup from './components/ui/DiscountPopup'

// Route-level code splitting: each page loads on demand so the initial
// bundle stays small (three.js in particular only loads with Home's scene)
const Home = lazy(() => import('./pages/Home'))
const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const Shop = lazy(() => import('./pages/Shop'))
const RichInLifePreOrder = lazy(() => import('./pages/RichInLifePreOrder'))
const InfoAllProfits = lazy(() => import('./pages/InfoAllProfits'))
const InfoTogether = lazy(() => import('./pages/InfoTogether'))
const InfoFashionTool = lazy(() => import('./pages/InfoFashionTool'))
const ProjectSelection = lazy(() => import('./pages/ProjectSelection'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const Founders = lazy(() => import('./pages/Founders'))
const NotFound = lazy(() => import('./pages/NotFound'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const LegalNotice = lazy(() => import('./pages/LegalNotice'))
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const Contact = lazy(() => import('./pages/Contact'))
const ComponentDemo = lazy(() => import('./pages/ComponentDemo'))
const VisualEditor = lazy(() => import('./pages/VisualEditor'))

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" aria-label="Loading page" />
    </div>
  )
}

function App() {
  return (
    <Router>
      <LocaleProvider>
      <CartProvider>
        <NavigationProvider>
          <ScrollToTop />
          <ColorExpansionOverlay />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<ProjectSelection />} />
              <Route path="/project/:slug" element={<ProjectPage />} />
              <Route path="/product/:handle" element={<ProductDetail />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/transparency" element={<AboutUs />} />
              <Route path="/founders" element={<Founders />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/rich-in-life" element={<RichInLifePreOrder />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/info/all-profits-donated" element={<InfoAllProfits />} />
              <Route path="/info/together-not-alone" element={<InfoTogether />} />
              <Route path="/info/fashion-as-a-tool" element={<InfoFashionTool />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/legal-notice" element={<LegalNotice />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/contact" element={<Contact />} />
              {/* Dev-only tooling pages, excluded from production */}
              {import.meta.env.DEV && <Route path="/demo" element={<ComponentDemo />} />}
              {import.meta.env.DEV && <Route path="/editor" element={<VisualEditor />} />}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CookieConsent />
          <DiscountPopup />
          <Analytics />
          <SpeedInsights />
        </NavigationProvider>
      </CartProvider>
      </LocaleProvider>
    </Router>
  )
}

export default App
