import { Camera, MessageCircle } from 'lucide-react'
import { HeroDecorations } from '../components/HeroDecorations'
import { site } from '../site'

// Shown to everyone until launch day (see comingSoon in site.ts)
export function ComingSoonPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-blush-50 px-4 py-16">
      <HeroDecorations />

      <div className="relative mx-auto max-w-2xl text-center">
        <img src="/logo.png" alt="Whiskful Moments" className="mx-auto h-36 w-36 motion-safe:animate-float sm:h-44 sm:w-44" />

        <p className="mt-8 font-semibold uppercase tracking-widest text-blush-800">Coming soon</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-6xl">Something sweet is in the oven</h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-cocoa-500">
          Swirly cinnamon rolls and golden cookies, baked to order in small batches. We’re putting on the finishing
          sprinkles and opening our doors very soon.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-cocoa-500 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-cocoa-800"
          >
            <Camera size={18} aria-hidden="true" />
            Follow for launch news
          </a>
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-blush-200 bg-white px-7 py-3 font-semibold text-cocoa-800 transition hover:bg-blush-100"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Say hello
          </a>
        </div>

        <p className="mt-10 text-sm text-cocoa-400">
          {site.instagramHandle} · {site.email}
        </p>
      </div>
    </main>
  )
}
