import { BrowserRouter, Route, Routes } from 'react-router'
import { ScrollToTop } from './components/ScrollToTop'
import { SiteLayout } from './components/SiteLayout'
import { AboutPage } from './pages/AboutPage'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { FaqPage } from './pages/FaqPage'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import { OrderPage } from './pages/OrderPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { site } from './site'

// Before launch, you can still see the real website on your own phone or computer:
// visit /?preview once and this browser remembers it. /?endpreview switches it off.
function isPreviewing() {
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.has('preview')) localStorage.setItem('whiskful-preview', 'yes')
    if (params.has('endpreview')) localStorage.removeItem('whiskful-preview')
    return localStorage.getItem('whiskful-preview') === 'yes'
  } catch {
    return false
  }
}

const showComingSoon = site.comingSoon && !isPreviewing()

function App() {
  if (showComingSoon) return <ComingSoonPage />

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="*" element={<PlaceholderPage title="Page not found" text="That page doesn’t exist. Try the menu above." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
