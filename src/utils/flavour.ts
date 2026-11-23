export type Flavour = 'classic' | 'oreo' | 'biscoff' | 'cookie'

// Works out which drawing to show from the product's name (and its category, if known)
export function flavourOf(name: string, categoryName = ''): Flavour {
  const lower = `${name} ${categoryName}`.toLowerCase()
  if (lower.includes('cookie')) return 'cookie'
  if (lower.includes('oreo')) return 'oreo'
  if (lower.includes('biscoff')) return 'biscoff'
  return 'classic'
}

// Cookie colours from the flavour name: red velvet, chocolate or golden
export function cookieLookOf(name: string): 'red_velvet' | 'chocolate' | 'golden' {
  const lower = name.toLowerCase()
  if (lower.includes('red velvet')) return 'red_velvet'
  if (lower.includes('double choc') || lower.includes('chocolate') || lower.includes('brownie')) return 'chocolate'
  return 'golden'
}
