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

function App() {
  return (
    <Router>
      <CartProvider>
        <NavigationProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:slug" element={<ProjectPage />} />
            <Route path="/product/:handle" element={<ProductDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/info/all-profits-donated" element={<InfoAllProfits />} />
            <Route path="/info/together-not-alone" element={<InfoTogether />} />
            <Route path="/info/fashion-as-a-tool" element={<InfoFashionTool />} />
            <Route path="/demo" element={<ComponentDemo />} />
          </Routes>
        </NavigationProvider>
      </CartProvider>
    </Router>
  )
}

export default App
