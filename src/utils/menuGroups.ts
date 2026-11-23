import type { Menu, MenuCategory, MenuProduct } from '../types/menu'

export type MenuGroup = { category: MenuCategory; products: MenuProduct[] }

// The menu split into categories, skipping any category with nothing on sale yet
export function groupMenu(menu: Menu): MenuGroup[] {
  const products = menu.products.filter((product) => product.sizes.length > 0)
  const categories = menu.categories ?? []
  if (categories.length === 0) {
    const all: MenuCategory = { id: 'all', name: 'Menu', unit_singular: 'item', unit_plural: 'items' }
    return products.length > 0 ? [{ category: all, products }] : []
  }
  return categories
    .map((category) => ({ category, products: products.filter((product) => product.category_id === category.id) }))
    .filter((group) => group.products.length > 0)
}

// "cinnamon rolls and cookies"
export function menuWords(groups: MenuGroup[]) {
  const names = groups.map((group) => group.category.name.toLowerCase())
  if (names.length <= 1) return names[0] ?? 'treats'
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}
