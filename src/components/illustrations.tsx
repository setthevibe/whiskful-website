import { useId } from 'react'
import { site } from '../site'
import { flavourOf } from '../utils/flavour'
import type { Flavour } from '../utils/flavour'

type ArtProps = { className?: string }

// The swirl: a spiral worked out with a little maths, so it's perfectly even
function spiral(turns: number, startRadius: number, endRadius: number) {
  const steps = Math.round(turns * 48)
  const points: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const angle = t * turns * Math.PI * 2
    const radius = startRadius + t * (endRadius - startRadius)
    points.push(`${(50 + radius * Math.cos(angle)).toFixed(1)} ${(50 + radius * Math.sin(angle)).toFixed(1)}`)
  }
  return `M ${points.join(' L ')}`
}

const swirl = spiral(3, 3, 36)
const crumbSpots = [
  [30, 30, 3], [62, 30, 2.5], [72, 50, 3], [40, 62, 2.5],
  [58, 72, 3], [24, 52, 2], [48, 44, 2.2], [78, 66, 2],
]
const toppings: Record<Flavour, { icing: string; crumbs: string | null }> = {
  classic: { icing: '#FFFDF7', crumbs: null },
  oreo: { icing: '#FFFDF7', crumbs: '#2B2222' },
  biscoff: { icing: '#E8A867', crumbs: '#B86B2E' },
}

export function CinnamonRoll({ flavour = 'classic', className }: ArtProps & { flavour?: Flavour }) {
  const topping = toppings[flavour]
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="53" r="44" fill="#3A2E2E" opacity="0.07" />
      <circle cx="50" cy="50" r="44" fill="#EDBE86" stroke="#D29A5C" strokeWidth="3" />
      <path d={swirl} fill="none" stroke="#A8622F" strokeWidth="5" strokeLinecap="round" />
      <g fill="none" stroke={topping.icing} strokeWidth="5" strokeLinecap="round" opacity="0.95">
        <path d="M18 38 C30 28 42 46 54 36 S74 30 84 40" />
        <path d="M14 58 C30 50 40 66 54 56 S76 52 86 60" />
        <path d="M26 76 C38 70 50 82 62 74 S74 72 80 76" />
      </g>
      {topping.crumbs &&
        crumbSpots.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={topping.crumbs ?? undefined} />)}
      {flavour === 'oreo' && (
        <g>
          <circle cx="72" cy="22" r="10" fill="#2B2222" />
          <circle cx="72" cy="22" r="6.5" fill="#3D3333" />
        </g>
      )}
      {flavour === 'biscoff' && (
        <g transform="rotate(-15 70 22)">
          <rect x="58" y="15" width="24" height="15" rx="3" fill="#C8783A" />
          <rect x="60.5" y="17.5" width="19" height="10" rx="2" fill="none" stroke="#A85F28" strokeWidth="1.2" />
        </g>
      )}
    </svg>
  )
}

export function Whisk({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 60 120" className={className} aria-hidden="true">
      <g fill="none" stroke="#B9A6A6" strokeWidth="3">
        <path d="M30 74 C8 60 8 20 30 6 C52 20 52 60 30 74 Z" />
        <path d="M30 74 C18 58 18 22 30 6 C42 22 42 58 30 74" />
        <path d="M30 74 L30 6" />
      </g>
      <rect x="24.5" y="72" width="11" height="46" rx="5.5" fill="#8C3A4C" />
    </svg>
  )
}

export function Heart({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 21s-7-4.6-9.3-9.2C1 8.3 3.1 4.5 6.8 4.5c2.1 0 3.6 1.1 5.2 3 1.6-1.9 3.1-3 5.2-3 3.7 0 5.8 3.8 4.1 7.3C19 16.4 12 21 12 21z"
      />
    </svg>
  )
}

export function Sparkle({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
    </svg>
  )
}

// A scalloped edge, like the border of your logo. Colour it with a text-… class.
export function ScallopEdge({ className }: ArtProps) {
  const id = `scallop${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <svg className={`block h-5 w-full ${className ?? ''}`} aria-hidden="true">
      <defs>
        <pattern id={id} width="28" height="20" patternUnits="userSpaceOnUse">
          <circle cx="14" cy="0" r="14" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="20" fill={`url(#${id})`} />
    </svg>
  )
}

// Your photo if you've added one in site.ts, otherwise the drawing
export function FlavourArt({ name, className }: ArtProps & { name: string }) {
  const flavour = flavourOf(name)
  const photo = site.photos[flavour]
  if (photo) return <img src={photo} alt={name} className={`rounded-full object-cover ${className ?? ''}`} />
  return <CinnamonRoll flavour={flavour} className={className} />
}