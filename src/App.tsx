import { BrowserRouter, Route, Routes } from 'react-router'
import { ScrollToTop } from './components/ScrollToTop'
import { SiteLayout } from './components/SiteLayout'
import { HomePage } from './pages/HomePage'
import { PlaceholderPage } from './pages/PlaceholderPage'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="menu" element={<PlaceholderPage title="Menu" text="Flavours, box sizes and prices are on their way." />} />
          <Route path="about" element={<PlaceholderPage title="About" text="Our story is on its way." />} />
          <Route path="faq" element={<PlaceholderPage title="Questions" text="Answers are on their way." />} />
          <Route path="order" element={<PlaceholderPage title="Order" text="Online ordering opens soon." />} />
          <Route path="*" element={<PlaceholderPage title="Page not found" text="That page doesn’t exist. Try the menu above." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App