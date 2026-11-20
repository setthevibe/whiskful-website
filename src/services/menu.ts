import type { Menu } from '../types/menu'
import { supabase } from './supabase'

// Ask Supabase for the menu
async function fetchMenu(): Promise<Menu> {
  const { data, error } = await supabase.rpc('website_menu')
  if (error) throw new Error(error.message)
  return data as Menu
}

// Fetched once per visit and shared by every page
let cached: Promise<Menu> | null = null

export function loadMenu(): Promise<Menu> {
  if (cached) return cached
  const request = fetchMenu()
  // If it failed, forget it so the next page can try again
  request.catch(() => {
    cached = null
  })
  cached = request
  return request
}