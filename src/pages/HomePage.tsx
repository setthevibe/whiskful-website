import { useState } from 'react'
import { Link } from 'react-router'
import { ClipboardList, Gift, Wallet } from 'lucide-react'
import { CinnamonRoll, FlavourArt, Heart, ScallopEdge, Sparkle, Whisk } from '../components/illustrations'
import { useMenu } from '../hooks/useMenu'
import { formatRand } from '../utils/format'
import { dayNames, orderWindowStatus } from '../utils/orderWindow'

const cardColours = ['bg-blush-100', 'bg-caramel-50', 'bg-lavender-100']

function HeroDecorations() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <CinnamonRoll className="absolute -left-12 top-8 h-36 w-36 -rotate-12 opacity-70 motion-safe:animate-float sm:left-4 sm:h-44 sm:w-44 sm:opacity-100" />
      <CinnamonRoll
        flavour="biscoff"
        className="absolute -right-10 top-28 h-28 w-28 rotate-12 opacity-70 motion-safe:animate-float [animation-delay:-2s] sm:right-6 sm:h-36 sm:w-36 sm:opacity-100"
      />
      <CinnamonRoll
        flavour="oreo"
        className="absolute bottom-10 left-[10%] hidden h-28 w-28 rotate-6 motion-safe:animate-float [animation-delay:-4s] md:block"
      />
      <Whisk className="absolute bottom-6 right-[12%] hidden h-36 w-18 rotate-[25deg] md:block" />
      <Heart className="absolute left-[24%] top-[16%] hidden h-5 w-5 text-blush-300 sm:block" />
      <Heart className="absolute bottom-[22%] right-[26%] hidden h-4 w-4 text-blush-400 sm:block" />
      <Heart className="absolute right-[8%] top-[10%] h-3 w-3 text-blush-300" />
      <Sparkle className="absolute bottom-[28%] left-[6%] h-5 w-5 text-caramel-200" />
      <Sparkle className="absolute right-[32%] top-[8%] hidden h-4 w-4 text-caramel-200 sm:block" />
    </div>
  )
}

export function HomePage() {
  const { menu } = useMenu()
  const [now] = useState(() => new Date())

  const business = menu?.business
  const status = business ? orderWindowStatus(business, now) : null
  const products = menu?.products.filter((product) => product.sizes.length > 0) ?? []
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
          <h1 className="mt-8 text-4xl leading-tight sm:text-6xl">Homemade cinnamon rolls, baked fresh for your weekend</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-cocoa-500">
            Classic, Oreo and Biscoff. Soft, gooey and made to order in small batches.
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
          <h2 className="text-center text-3xl sm:text-4xl">Three flavours, all gooey</h2>
          <p className="mt-2 text-center text-cocoa-400">Pick your favourite, or try them all.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {products.map((product, index) => (
              <Link
                key={product.id}
                to="/menu"
                className={`group rounded-3xl p-6 text-center transition hover:-translate-y-1 hover:shadow-md ${cardColours[index % cardColours.length]}`}
              >
                <FlavourArt name={product.name} className="mx-auto h-32 w-32 transition duration-500 group-hover:rotate-12" />
                <h3 className="mt-4 text-2xl">{product.name}</h3>
                {product.description && <p className="mt-1 text-sm text-cocoa-500">{product.description}</p>}
                <p className="mt-3 font-semibold text-cocoa-800">
                  From {formatRand(Math.min(...product.sizes.map((size) => size.price)))}
                </p>
              </Link>
            ))}
          </div>
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
          <h2 className="text-3xl text-white sm:text-4xl">Weekend plans? Add cinnamon rolls.</h2>
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