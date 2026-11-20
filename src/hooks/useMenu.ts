import { useEffect, useState } from 'react'
import { loadMenu } from '../services/menu'
import type { Menu } from '../types/menu'

export function useMenu() {
  const [menu, setMenu] = useState<Menu | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let ignore = false
    loadMenu()
      .then((result) => {
        if (!ignore) setMenu(result)
      })
      .catch(() => {
        if (!ignore) setFailed(true)
      })
    return () => {
      ignore = true
    }
  }, [])

  return { menu, failed }
}