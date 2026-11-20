import { useState } from 'react'
import { Link } from 'react-router'
import { useMenu } from '../hooks/useMenu'
import { allergenLabels } from '../types/menu'
import { formatRand } from '../utils/format'
import { orderWindowStatus } from '../utils/orderWindow'
import { FlavourArt } from '../components/illustrations'

const cardColours = ['bg-blush-100', 'bg-caramel-50', 'bg-lavender-100']

export function MenuPage() {
  const { menu, failed } = useMenu()
  const [now] = useState(() => new Date())

  if (failed) {
    return (
      <p className="mx-auto mt-16 max-w-md rounded-2xl bg-blush-100 p-5 text-center text-blush-800">
        The menu didn’t load. Please refresh the page, or message us on WhatsApp.
      </p>
    )
  }
  if (!menu) return <p className="mt-16 text-center text-cocoa-400">Loading the menu…</p>

  const products = menu.products.filter((product) => product.sizes.length > 0)
  const window = orderWindowStatus(menu.business, now)

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <h1 className="text-center text-4xl sm:text-5xl">The menu</h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-cocoa-400">
        Soft, gooey cinnamon rolls, baked to order. Every flavour comes in the same box sizes.
      </p>

      <p
        className={`mx-auto mt-6 w-fit rounded-full px-4 py-2 text-center text-sm font-semibold ${
          window.isOpen ? 'bg-mint-100 text-mint-800' : 'bg-butter-100 text-butter-800'
        }`}
      >
        {window.text}
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {products.map((product, index) => (
          <article key={product.id} className={`flex flex-col rounded-3xl p-6 ${cardColours[index % cardColours.length]}`}>
           <FlavourArt name={product.name} className="mb-4 h-20 w-20" />
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
              <p className="mt-4 text-xs text-cocoa-500">
                <span className="font-semibold">Contains: </span>
                {product.allergens.map((allergen) => allergenLabels[allergen]).join(', ')}
              </p>
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

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-cocoa-400">
        Everything is made in a home kitchen that also uses gluten, milk, egg and soy, so we can’t promise any roll is free of
        them. Message us if you have an allergy and we’ll help you choose.
      </p>
    </section>
  )
}