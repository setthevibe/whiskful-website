export type Allergen = 'gluten' | 'milk' | 'egg' | 'soy' | 'peanuts' | 'tree_nuts' | 'sesame'

export const allergenLabels: Record<Allergen, string> = {
  gluten: 'Gluten',
  milk: 'Milk',
  egg: 'Egg',
  soy: 'Soy',
  peanuts: 'Peanuts',
  tree_nuts: 'Tree nuts',
  sesame: 'Sesame',
}

export type MenuSize = {
  pack_size_id: string
  name: string
  units: number
  price: number
}

export type MenuProduct = {
  id: string
  name: string
  description: string | null
  allergens: Allergen[]
  sizes: MenuSize[]
}

export type MenuBusiness = {
  name: string
  instagram_handle: string | null
  collection_area: string | null
  saturday_start: string
  saturday_end: string
  sunday_collection_start: string
  sunday_collection_end: string
  order_open_day: number
  order_open_time: string
  order_close_day: number
  order_close_time: string
  free_delivery_radius_km: number
  delivery_fee_per_km: number | null
  minimum_delivery_fee: number | null
}

export type Menu = {
  business: MenuBusiness
  products: MenuProduct[]
}