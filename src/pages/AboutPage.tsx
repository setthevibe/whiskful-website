import { Clock, Heart as HeartIcon, Home } from 'lucide-react'
import { CinnamonRoll, Heart, Sparkle, Whisk } from '../components/illustrations'
import { site } from '../site'

const values = [
  { icon: Clock, title: 'Made to order', text: 'Nothing sits on a shelf. Your rolls are baked for the day you chose.' },
  { icon: HeartIcon, title: 'Small batches', text: 'A few trays at a time, so every roll gets proper care.' },
  { icon: Home, title: 'Baked at home', text: 'Made in my own kitchen, the way I’d make them for family.' },
]

export function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative mx-auto w-full max-w-sm">
          {site.photos.about ? (
            <img src={site.photos.about} alt="Robyn baking" className="aspect-square w-full rounded-[2.5rem] object-cover" />
          ) : (
            <div className="relative flex aspect-square w-full items-center justify-center rounded-[2.5rem] bg-blush-100">
              <CinnamonRoll className="h-48 w-48 rotate-6" />
              <Whisk className="absolute bottom-8 right-10 h-28 w-14 rotate-[25deg]" />
              <Heart className="absolute left-10 top-10 h-6 w-6 text-blush-400" />
              <Sparkle className="absolute right-12 top-14 h-5 w-5 text-caramel-200" />
            </div>
          )}
        </div>

        <div>
          {/* ✏️ Rewrite these paragraphs in your own words */}
          <h1 className="text-4xl sm:text-5xl">Hi, I’m Robyn</h1>
          <div className="mt-5 space-y-4 text-lg text-cocoa-500">
            <p>
              Whiskful Moments is my home bakery, where cinnamon rolls take centre stage: soft dough, plenty of cinnamon sugar
              and a generous swirl of icing.
            </p>
            <p>
              Every roll is baked to order in small batches. You order during the week, I bake for the weekend, and your box is
              ready fresh for you to enjoy.
            </p>
            <p>Whether it’s a slow Saturday breakfast or a treat to share, I hope each one makes a little moment sweeter.</p>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blush-100 text-blush-800">
              <value.icon size={22} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-xl">{value.title}</h2>
            <p className="mt-2 text-sm text-cocoa-500">{value.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}