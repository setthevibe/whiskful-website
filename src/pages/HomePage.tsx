import { useState } from 'react'
import { Link } from 'react-router'
import { ClipboardList, Gift, Wallet } from 'lucide-react'
import { HeroDecorations } from '../components/HeroDecorations'
import { FlavourArt, Heart, ScallopEdge } from '../components/illustrations'
import { useMenu } from '../hooks/useMenu'
import { formatRand } from '../utils/format'
import { groupMenu, menuWords } from '../utils/menuGroups'
import { dayNames, orderWindowStatus } from '../utils/orderWindow'

const cardColours = ['bg-blush-100', 'bg-caramel-50', 'bg-lavender-100']

export function HomePage() {
  const { menu } = useMenu()
  const [now] = useState(() => new Date())

  const business = menu?.business
  const status = business ? orderWindowStatus(business, now) : null
  const groups = menu ? groupMenu(menu) : []
  const allProducts = groups.flatMap((group) => group.products.map((product) => ({ product, categoryName: group.category.name })))
  const products = allProducts.slice(0, 6)
  const words = menu ? menuWords(groups) : 'cinnamon rolls'
  const openText = business ? `${dayNames[business.order_open_day - 1]} at ${business.order_open_time}` : 'Monday'
  const closeText = business ? `${dayNames[business.order_close_day - 1]} at ${business.order_close_time}` : 'Thursday'

  const steps = [
    {
      icon: ClipboardList,
      title: 'Order online',
      text: `Orders open ${openText} and close ${closeText}. Pick your flavours, box sizes and day.`,
    },
    {
      icon: Wallet,
      title: 'Pay to confirm',
      text: 'We’ll WhatsApp you a quote. Pay by EFT or card and your order is booked.',
    },
    {
      icon: Gift,
      title: 'Enjoy',
      text: 'Collect your box, or have it delivered, on the day you chose. Sharing is optional.',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-blush-50">
        <HeroDecorations />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
          <img src="/logo.png" alt="Whiskful Moments" className="mx-auto h-32 w-32 sm:h-36 sm:w-36" />
          <h1 className="mt-8 text-4xl leading-tight sm:text-6xl">Homemade {words}, baked fresh for your weekend</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-cocoa-500">
            Made to order in small batches, with plenty of flavours to choose from.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/order" className="rounded-full bg-cocoa-500 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-cocoa-800">
              Order now
            </Link>
            <Link to="/menu" className="rounded-full border border-blush-200 bg-white px-7 py-3 font-semibold text-cocoa-800 transition hover:bg-blush-100">
              See the menu
            </Link>
          </div>
          {status && (
            <p
              className={`mx-auto mt-6 w-fit rounded-full px-4 py-1.5 text-sm font-semibold ${
                status.isOpen ? 'bg-mint-100 text-mint-800' : 'bg-butter-100 text-butter-800'
              }`}
            >
              {status.text}
            </p>
          )}
        </div>
      </section>
      <ScallopEdge className="text-blush-50" />

      {/* Flavours */}
      {products.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-3xl sm:text-4xl">Our flavours</h2>
          <p className="mt-2 text-center text-cocoa-400">Pick your favourite, or try them all.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {products.map(({ product, categoryName }, index) => (
              <Link
                key={product.id}
                to="/menu"
                className={`group rounded-3xl p-6 text-center transition hover:-translate-y-1 hover:shadow-md ${cardColours[index % cardColours.length]}`}
              >
                <FlavourArt name={product.name} categoryName={categoryName} className="mx-auto h-32 w-32 transition duration-500 group-hover:rotate-12" />
                <h3 className="mt-4 text-2xl">{product.name}</h3>
                {product.description && <p className="mt-1 text-sm text-cocoa-500">{product.description}</p>}
                <p className="mt-3 font-semibold text-cocoa-800">
                  From {formatRand(Math.min(...product.sizes.map((size) => size.price)))}
                </p>
              </Link>
            ))}
          </div>
          {allProducts.length > products.length && (
            <p className="mt-8 text-center">
              <Link to="/menu" className="font-semibold text-blush-800 underline">
                See all {allProducts.length} flavours on the menu
              </Link>
            </p>
          )}
        </section>
      )}

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="rounded-3xl bg-caramel-50 p-8 sm:p-12">
          <h2 className="text-center text-3xl sm:text-4xl">How it works</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-caramel-800 shadow-sm">
                  <step.icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-2 text-sm text-cocoa-500">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Order band */}
      <section className="relative overflow-hidden bg-cocoa-500">
        <Heart className="absolute left-[8%] top-6 h-6 w-6 text-blush-300/40" />
        <Heart className="absolute bottom-6 right-[10%] h-8 w-8 text-blush-300/40" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-3xl text-white sm:text-4xl">Weekend plans? Add something sweet.</h2>
          <Link
            to="/order"
            className="mt-6 inline-block rounded-full bg-cream px-7 py-3 font-semibold text-cocoa-800 transition hover:bg-blush-100"
          >
            Order now
          </Link>
        </div>
      </section>
    </>
  )
}