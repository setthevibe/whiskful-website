import { useState } from 'react'
import { Link } from 'react-router'
import { FlavourArt } from '../components/illustrations'
import { useMenu } from '../hooks/useMenu'
import { allergenLabels } from '../types/menu'
import { formatRand } from '../utils/format'
import { groupMenu } from '../utils/menuGroups'
import { orderWindowStatus } from '../utils/orderWindow'

const cardColours = ['bg-blush-100', 'bg-caramel-50', 'bg-lavender-100']

export function MenuPage() {
  const { menu, failed } = useMenu()
  const [now] = useState(() => new Date())
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (failed) {
    return (
      <p className="mx-auto mt-16 max-w-md rounded-2xl bg-blush-100 p-5 text-center text-blush-800">
        The menu didn’t load. Please refresh the page, or message us on WhatsApp.
      </p>
    )
  }
  if (!menu) return <p className="mt-16 text-center text-cocoa-400">Loading the menu…</p>

  const groups = groupMenu(menu)
  const group = groups.find((item) => item.category.id === selectedId) ?? groups[0]
  const status = orderWindowStatus(menu.business, now)

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <h1 className="text-center text-4xl sm:text-5xl">The menu</h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-cocoa-400">
        Everything is baked to order. Pick a flavour, then a box size.
      </p>

      <p
        className={`mx-auto mt-6 w-fit rounded-full px-4 py-2 text-center text-sm font-semibold ${
          status.isOpen ? 'bg-mint-100 text-mint-800' : 'bg-butter-100 text-butter-800'
        }`}
      >
        {status.text}
      </p>

      {groups.length > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Menu categories">
          {groups.map((item) => (
            <button
              key={item.category.id}
              type="button"
              role="tab"
              aria-selected={item.category.id === group?.category.id}
              onClick={() => setSelectedId(item.category.id)}
              className={`rounded-full px-5 py-2.5 font-semibold transition ${
                item.category.id === group?.category.id
                  ? 'bg-cocoa-500 text-white'
                  : 'border border-blush-200 bg-white text-cocoa-800 hover:bg-blush-50'
              }`}
            >
              {item.category.name}
            </button>
          ))}
        </div>
      )}

      {!group && <p className="mt-10 text-center text-cocoa-400">The menu is being updated. Please check back soon.</p>}

      {group && (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {group.products.map((product, index) => (
            <article key={product.id} className={`flex flex-col rounded-3xl p-6 ${cardColours[index % cardColours.length]}`}>
              <FlavourArt name={product.name} categoryName={group.category.name} className="mb-4 h-20 w-20" />
              <h2 className="text-2xl">{product.name}</h2>
              {product.description && <p className="mt-2 text-sm text-cocoa-500">{product.description}</p>}

              <ul className="mt-5 space-y-2">
                {product.sizes.map((size) => (
                  <li key={size.pack_size_id} className="flex items-baseline justify-between gap-3 rounded-xl bg-white/70 px-4 py-2.5">
                    <span className="text-cocoa-800">{size.name}</span>
                    <span className="font-display text-lg text-cocoa-800">{formatRand(size.price)}</span>
                  </li>
                ))}
              </ul>

              {product.allergens.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-cocoa-800">Contains:</span>
                  {product.allergens.map((allergen) => (
                    <span key={allergen} className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-blush-800">
                      {allergenLabels[allergen]}
                    </span>
                  ))}
                </div>
              )}

              {product.ingredients && product.ingredients.length > 0 && (
                <details className="mt-3 text-xs text-cocoa-500">
                  <summary className="cursor-pointer font-semibold text-cocoa-800">Ingredients</summary>
                  <p className="mt-1">{product.ingredients.join(', ')}</p>
                </details>
              )}

              <div className="mt-auto pt-6">
                <Link
                  to={`/order?flavour=${product.id}`}
                  className="block rounded-full bg-cocoa-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-cocoa-800"
                >
                  Order {product.name}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-cocoa-400">
        Everything is made in a home kitchen that also uses gluten, milk, egg and soy, so we can’t promise anything is free
        of them. Message us if you have an allergy and we’ll help you choose.
      </p>
    </section>
  )
}
