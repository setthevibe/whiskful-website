import { useState } from 'react'
import { Link } from 'react-router'
import { Clock, Gift, Heart as HeartIcon, Home } from 'lucide-react'
import { CinnamonRoll, Cookie, Heart, MixingBowl, Sparkle, Sprinkles, Whisk } from '../components/illustrations'
import { useMenu } from '../hooks/useMenu'
import { site } from '../site'
import { orderWindowStatus } from '../utils/orderWindow'

const values = [
  { icon: Clock, title: 'Baked to order', text: 'Nothing waits on a shelf. Your treats are baked for the day you choose.', tint: 'bg-blush-100 text-blush-800' },
  { icon: HeartIcon, title: 'Small batches', text: 'A few trays at a time, so every bake gets proper love and attention.', tint: 'bg-lavender-100 text-lavender-800' },
  { icon: Home, title: 'Made at home', text: 'From my kitchen to yours, the way I’d bake for the people I love.', tint: 'bg-mint-100 text-mint-800' },
  { icon: Gift, title: 'Made for sharing', text: 'Birthdays, thank-yous, Sunday visits. A box of treats says it best.', tint: 'bg-caramel-50 text-caramel-800' },
]

export function AboutPage() {
  const { menu } = useMenu()
  const [now] = useState(() => new Date())
  const status = menu ? orderWindowStatus(menu.business, now) : null

  return (
    <>
      <section className="relative overflow-hidden">
        <Sprinkles className="pointer-events-none absolute right-[6%] top-10 hidden h-12 w-12 md:block" />
        <Sparkle className="pointer-events-none absolute left-[4%] top-24 hidden h-5 w-5 text-caramel-200 md:block" />

        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-12 sm:py-16 md:grid-cols-2">
          <div className="relative mx-auto w-full max-w-sm">
            {site.photos.about ? (
              <img src={site.photos.about} alt="Robyn baking" className="aspect-square w-full rounded-[2.5rem] object-cover" />
            ) : (
              <div className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] bg-blush-100">
                <MixingBowl className="absolute bottom-6 left-1/2 w-44 -translate-x-1/2" />
                <CinnamonRoll className="absolute left-8 top-10 h-28 w-28 -rotate-6 motion-safe:animate-float" />
                <Cookie className="absolute right-8 top-16 h-24 w-24 rotate-12 motion-safe:animate-float [animation-delay:-3s]" />
                <Whisk className="absolute right-6 bottom-16 h-24 w-12 rotate-25 motion-safe:animate-sway" />
                <Sprinkles className="absolute left-1/2 top-6 h-10 w-10 -translate-x-1/2" />
                <Heart className="absolute bottom-20 left-8 h-6 w-6 text-blush-400" />
                <Sparkle className="absolute right-1/3 top-1/2 h-5 w-5 text-caramel-200" />
              </div>
            )}
          </div>

          <div>
            {/* ✏️ Make these words your own: your story always sells best */}
            <p className="font-semibold text-blush-800">The baker behind Whiskful Moments</p>
            <h1 className="mt-2 text-4xl sm:text-5xl">Hi, I’m Robyn</h1>
            <div className="mt-5 space-y-4 text-lg text-cocoa-500">
              <p>
                I believe there’s a little bit of magic in baking. A spoonful of this, a pinch of that, a warm oven, and
                suddenly the whole house smells like a hug.
              </p>
              <p>
                Whiskful Moments is where I get to share that magic with you. Swirly cinnamon rolls, golden cookies and
                whatever sweet idea comes next, all baked to order in small batches in my home kitchen, so they reach you
                fresh.
              </p>
              <p>
                Bring a box to a birthday, surprise someone on a Monday, or keep one all to yourself for a slow Saturday
                morning. However you enjoy it, I hope it makes the moment a little sweeter.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/order" className="rounded-full bg-cocoa-500 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-cocoa-800">
                Order for this weekend
              </Link>
              <Link to="/menu" className="rounded-full border border-blush-200 bg-white px-7 py-3 font-semibold text-cocoa-800 transition hover:bg-blush-50">
                See the menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-center text-3xl sm:text-4xl">What goes into every box</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div key={value.title} className="rounded-3xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1">
              <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${value.tint}`}>
                <value.icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-xl">{value.title}</h3>
              <p className="mt-2 text-sm text-cocoa-500">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-cocoa-500">
        <Heart className="absolute left-[8%] top-6 h-6 w-6 text-blush-300/40" />
        <Sprinkles className="absolute bottom-6 right-[10%] h-10 w-10 opacity-60" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-3xl text-white sm:text-4xl">Treat yourself, or someone special</h2>
          {status && <p className="mt-3 text-blush-100">{status.text}</p>}
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
