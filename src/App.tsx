import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { CartProvider } from './contexts/CartContext'
import { NavigationProvider } from './contexts/NavigationContext'
import Home from './pages/Home'
import ProjectPage from './pages/ProjectPage'
import ProductDetail from './pages/ProductDetail'
import AboutUs from './pages/AboutUs'
import Transparency from './pages/Transparency'
import Shop from './pages/Shop'
import InfoAllProfits from './pages/InfoAllProfits'
import InfoTogether from './pages/InfoTogether'
import InfoFashionTool from './pages/InfoFashionTool'
import ComponentDemo from './pages/ComponentDemo'
import ProjectSelection from './pages/ProjectSelection'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Founders from './pages/Founders'
import VisualEditor from './pages/VisualEditor'
import PrivacyPolicy from './pages/PrivacyPolicy'
import RefundPolicy from './pages/RefundPolicy'
import TermsOfService from './pages/TermsOfService'
import LegalNotice from './pages/LegalNotice'
import ShippingPolicy from './pages/ShippingPolicy'
import CookiePolicy from './pages/CookiePolicy'
import Contact from './pages/Contact'
import Podcasts from './pages/Podcasts'

import CookieConsent from './components/Layout/CookieConsent'
import ColorExpansionOverlay from './components/transitions/ColorExpansionOverlay'
import ScrollToTop from './components/Layout/ScrollToTop'

function App() {
  return (
    <Router>
      <CartProvider>
        <NavigationProvider>
          <ScrollToTop />
          <ColorExpansionOverlay />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectSelection />} />
            <Route path="/project/:slug" element={<ProjectPage />} />
            <Route path="/product/:handle" element={<ProductDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/founders" element={<Founders />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/info/all-profits-donated" element={<InfoAllProfits />} />
            <Route path="/info/together-not-alone" element={<InfoTogether />} />
            <Route path="/info/fashion-as-a-tool" element={<InfoFashionTool />} />
            <Route path="/demo" element={<ComponentDemo />} />
            <Route path="/editor" element={<VisualEditor />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/legal-notice" element={<LegalNotice />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/podcasts" element={<Podcasts />} />
          </Routes>
          <CookieConsent />
          <Analytics />
          <SpeedInsights />
        </NavigationProvider>
      </CartProvider>
    </Router>
  )
}

export default App
