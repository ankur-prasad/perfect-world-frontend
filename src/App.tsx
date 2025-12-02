import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

import CookieConsent from './components/Layout/CookieConsent'

function App() {
  return (
    <Router>
      <CartProvider>
        <NavigationProvider>
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
          </Routes>
          <CookieConsent />
        </NavigationProvider>
      </CartProvider>
    </Router>
  )
}

export default App
