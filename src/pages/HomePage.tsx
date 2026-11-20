import { Link } from 'react-router'

export function HomePage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
      <img src="/logo.png" alt="Whiskful Moments" className="mx-auto h-40 w-40" />
      <h1 className="mx-auto mt-8 max-w-2xl text-4xl sm:text-5xl">Homemade cinnamon rolls, baked fresh for your weekend</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-cocoa-400">Classic, Oreo and Biscoff. Soft, gooey and made to order.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/order" className="rounded-full bg-cocoa-500 px-7 py-3 font-semibold text-white transition hover:bg-cocoa-800">
          Order now
        </Link>
        <Link to="/menu" className="rounded-full border border-blush-200 bg-white px-7 py-3 font-semibold text-cocoa-800 transition hover:bg-blush-50">
          See the menu
        </Link>
      </div>
    </section>
  )
}