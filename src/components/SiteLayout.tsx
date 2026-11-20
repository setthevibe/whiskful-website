import { Link, NavLink, Outlet } from 'react-router'
import { Camera, Mail, MessageCircle } from 'lucide-react'
import { site } from '../site'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/faq', label: 'FAQ', end: false },
]

function navClass({ isActive }: { isActive: boolean }) {
  return `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-blush-100 text-blush-800' : 'text-cocoa-500 hover:bg-blush-50'
  }`
}

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-blush-100 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-12 w-12" />
            <span className="font-display text-xl text-cocoa-800">Whiskful Moments</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/order"
            className="shrink-0 rounded-full bg-cocoa-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cocoa-800"
          >
            Order now
          </Link>
        </div>

        {/* Phones: the links sit in their own row under the logo */}
        <nav aria-label="Main" className="flex justify-center gap-1 border-t border-blush-100 px-2 py-2 md:hidden">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-blush-100 bg-blush-50">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-lg text-cocoa-800">{site.name}</p>
            <p className="mt-1 text-sm text-cocoa-400">Homemade baking, made with love.</p>
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={site.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-cocoa-500 hover:text-cocoa-800">
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-cocoa-500 hover:text-cocoa-800">
                <Camera size={16} aria-hidden="true" />
                {site.instagramHandle}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-cocoa-500 hover:text-cocoa-800">
                <Mail size={16} aria-hidden="true" />
                {site.email}
              </a>
            </li>
          </ul>
        </div>
        <p className="pb-6 text-center text-xs text-cocoa-400">© {new Date().getFullYear()} {site.name}</p>
      </footer>
    </div>
  )
}