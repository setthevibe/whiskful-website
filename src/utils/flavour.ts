export type Flavour = 'classic' | 'oreo' | 'biscoff'

// Works out which drawing to show from the product's name
export function flavourOf(name: string): Flavour {
  const lower = name.toLowerCase()
  if (lower.includes('oreo')) return 'oreo'
  if (lower.includes('biscoff')) return 'biscoff'
  return 'classic'
}