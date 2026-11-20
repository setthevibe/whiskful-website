import { BrowserRouter, Route, Routes } from 'react-router'
import { ScrollToTop } from './components/ScrollToTop'
import { SiteLayout } from './components/SiteLayout'
import { HomePage } from './pages/HomePage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { MenuPage } from './pages/MenuPage'
import { AboutPage } from './pages/AboutPage'
import { FaqPage } from './pages/FaqPage'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="menu" element={<MenuPage />} />
         <Route path="about" element={<AboutPage />} />
         <Route path="faq" element={<FaqPage />} />
          <Route path="order" element={<PlaceholderPage title="Order" text="Online ordering opens soon." />} />
          <Route path="*" element={<PlaceholderPage title="Page not found" text="That page doesn’t exist. Try the menu above." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App