import { useEffect } from 'react'
import { useLocation } from 'react-router'

// Start each page at the top, like a normal website
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}