import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { MessageCircle, Minus, Plus } from 'lucide-react'
import { CinnamonRoll, FlavourArt } from '../components/illustrations'
import { Turnstile } from '../components/Turnstile'
import { useMenu } from '../hooks/useMenu'
import { submitOrder } from '../services/orders'
import type { PlacedOrder } from '../services/orders'
import { site } from '../site'
import { inputClass, labelClass } from '../styles'
import { allergenLabels } from '../types/menu'
import { formatRand } from '../utils/format'
import { orderWindowStatus } from '../utils/orderWindow'
import { normalizePhone } from '../utils/phone'
import { comingWeekend, formatDay, timeSlots } from '../utils/weekend'

type Day = 'saturday' | 'sunday'
type Fulfilment = 'collection' | 'delivery'
type Payment = 'eft' | 'card'

const MAX_PER_BOX = 20

function Section({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-blush-100 bg-white p-5 sm:p-6">
      <h2 className="flex items-center gap-3 text-xl">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blush-100 font-sans text-sm font-bold text-blush-800">
          {number}
        </span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        selected ? 'border-cocoa-500 bg-cocoa-500 text-white' : 'border-blush-200 bg-white text-cocoa-800 hover:bg-blush-50'
      }`}
    >
      {children}
    </button>
  )
}

function OrderPlaced({ order, name }: { order: PlacedOrder; name: string }) {
  const firstName = name.trim().split(' ')[0]
  const message = `Hi Whiskful Moments! I’ve just placed order ${order.order_number} on your website.`
  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center">
      <CinnamonRoll className="mx-auto h-28 w-28 motion-safe:animate-float" />
      <h1 className="mt-6 text-4xl">Thank you, {firstName}!</h1>
      <p className="mt-3 text-lg text-cocoa-500">
        Your order number is <strong className="text-cocoa-800">{order.order_number}</strong>.
      </p>
      <div className="mt-8 rounded-3xl bg-white p-6 text-left shadow-sm">
        <h2 className="text-xl">What happens next</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-cocoa-500">
          <li>
            We’ll WhatsApp you a quote{order.fulfilment === 'delivery' ? ', including the delivery fee,' : ''} soon.
          </li>
          <li>Pay by EFT or card to book your spot. Quotes are held for a limited time.</li>
          <li>We’ll confirm your {order.fulfilment === 'delivery' ? 'delivery' : 'collection'} time. Then it’s cinnamon roll time!</li>
        </ol>
      </div>
      <a
        href={`${site.whatsappUrl}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-cocoa-500 px-7 py-3 font-semibold text-white transition hover:bg-cocoa-800"
      >
        <MessageCircle size={18} aria-hidden="true" />
        Message us on WhatsApp
      </a>
    </section>
  )
}

export function OrderPage() {
  const { menu, failed } = useMenu()
  const [searchParams] = useSearchParams()
  const highlight = searchParams.get('flavour')
  const [now] = useState(() => new Date())

  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [fulfilment, setFulfilment] = useState<Fulfilment>('collection')
  const [address, setAddress] = useState('')
  const [day, setDay] = useState<Day | ''>('')
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [payment, setPayment] = useState<Payment | ''>('')
  const [notes, setNotes] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [turnstileKey, setTurnstileKey] = useState(0)
  const [sending, setSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)

  if (failed) {
    return (
      <p className="mx-auto mt-16 max-w-md rounded-2xl bg-blush-100 p-5 text-center text-blush-800">
        The order form didn’t load. Please refresh the page, or WhatsApp us your order.
      </p>
    )
  }
  if (!menu) return <p className="mt-16 text-center text-cocoa-400">Loading…</p>
  if (placed) return <OrderPlaced order={placed} name={name} />

  const business = menu.business
  const status = orderWindowStatus(business, now)

  if (!status.isOpen) {
    return (
      <section className="mx-auto max-w-xl px-4 py-16 text-center">
        <CinnamonRoll className="mx-auto h-28 w-28" />
        <h1 className="mt-6 text-4xl">See you next week!</h1>
        <p className="mt-3 text-lg text-cocoa-500">{status.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/menu" className="rounded-full border border-blush-200 bg-white px-7 py-3 font-semibold text-cocoa-800 transition hover:bg-blush-50">
            See the menu
          </Link>
          <a href={site.whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full bg-cocoa-500 px-7 py-3 font-semibold text-white transition hover:bg-cocoa-800">
            WhatsApp us
          </a>
        </div>
      </section>
    )
  }

  const products = menu.products.filter((product) => product.sizes.length > 0)
  const weekend = comingWeekend(now)
  const date = day ? weekend[day] : ''
  const slots =
    day === 'saturday'
      ? timeSlots(business.saturday_start, business.saturday_end)
      : day === 'sunday'
        ? timeSlots(business.sunday_collection_start, business.sunday_collection_end)
        : []
  const availableSlots = slots.filter((slot) => new Date(`${date}T${slot}:00+02:00`) > now)

  const lines = products
    .flatMap((product) =>
      product.sizes.map((size) => ({
        product,
        size,
        quantity: quantities[`${product.id}:${size.pack_size_id}`] ?? 0,
      })),
    )
    .filter((line) => line.quantity > 0)
  const total = lines.reduce((sum, line) => sum + line.quantity * line.size.price, 0)

  function changeQuantity(key: string, change: number) {
    setQuantities((current) => ({
      ...current,
      [key]: Math.min(MAX_PER_BOX, Math.max(0, (current[key] ?? 0) + change)),
    }))
  }

  async function submit() {
    setErrorMessage('')
    if (lines.length === 0) return setErrorMessage('Add at least one box.')
    if (fulfilment === 'delivery' && !address.trim()) return setErrorMessage('Enter your delivery address.')
    if (!date || !time) return setErrorMessage('Choose a day and time.')
    if (!name.trim()) return setErrorMessage('Enter your name.')
    if (!normalizePhone(phone)) return setErrorMessage('Enter a valid South African cellphone number, like 072 123 4567.')
    if (!payment) return setErrorMessage('Choose how you’d like to pay.')
    if (!token) return setErrorMessage('Just a moment, we’re still checking your connection. Try again in a few seconds.')

    setSending(true)
    try {
      const result = await submitOrder(
        {
          full_name: name.trim(),
          phone,
          fulfilment,
          delivery_address: fulfilment === 'delivery' ? address.trim() : null,
          payment_method: payment,
          notes: notes.trim() || null,
          requested_for: `${date}T${time}:00+02:00`,
          items: lines.map((line) => ({
            product_id: line.product.id,
            pack_size_id: line.size.pack_size_id,
            quantity: line.quantity,
          })),
        },
        token,
      )
      setPlaced(result)
      window.scrollTo(0, 0)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      setToken(null)
      setTurnstileKey((count) => count + 1)
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-center text-4xl sm:text-5xl">Place your order</h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-cocoa-400">
        Pick your boxes and a day. We’ll WhatsApp you a quote, and your order is booked once it’s paid.
      </p>
      <p className="mx-auto mt-5 w-fit rounded-full bg-mint-100 px-4 py-1.5 text-sm font-semibold text-mint-800">{status.text}</p>

      <form
        className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <div className="space-y-6">
          <Section number={1} title="Your rolls">
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className={`rounded-2xl bg-cream p-4 ${product.id === highlight ? 'ring-2 ring-blush-400' : ''}`}>
                  <div className="flex items-center gap-3">
                    <FlavourArt name={product.name} className="h-12 w-12 shrink-0" />
                    <div>
                      <h3 className="text-lg">{product.name}</h3>
                      {product.allergens.length > 0 && (
                        <p className="text-xs text-cocoa-400">
                          Contains: {product.allergens.map((allergen) => allergenLabels[allergen]).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <ul className="mt-3 divide-y divide-blush-100">
                    {product.sizes.map((size) => {
                      const key = `${product.id}:${size.pack_size_id}`
                      const quantity = quantities[key] ?? 0
                      return (
                        <li key={key} className="flex items-center justify-between gap-3 py-2.5">
                          <div>
                            <p className="font-semibold text-cocoa-800">{size.name}</p>
                            <p className="text-sm text-cocoa-400">{formatRand(size.price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => changeQuantity(key, -1)}
                              disabled={quantity === 0}
                              aria-label={`One less ${product.name}, ${size.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-blush-200 bg-white text-cocoa-800 transition hover:bg-blush-50 disabled:opacity-40"
                            >
                              <Minus size={16} aria-hidden="true" />
                            </button>
                            <span className="w-6 text-center font-semibold text-cocoa-800" aria-live="polite">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => changeQuantity(key, 1)}
                              disabled={quantity >= MAX_PER_BOX}
                              aria-label={`One more ${product.name}, ${size.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-cocoa-500 text-white transition hover:bg-cocoa-800 disabled:opacity-40"
                            >
                              <Plus size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section number={2} title="Collection or delivery">
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice selected={fulfilment === 'collection'} onClick={() => setFulfilment('collection')}>
                <span className="block font-semibold">Collect</span>
                <span className="block text-sm opacity-80">
                  {business.collection_area ? `In ${business.collection_area}` : 'Address sent once you’ve paid'}
                </span>
              </Choice>
              <Choice selected={fulfilment === 'delivery'} onClick={() => setFulfilment('delivery')}>
                <span className="block font-semibold">Delivery</span>
                <span className="block text-sm opacity-80">Free within {business.free_delivery_radius_km} km</span>
              </Choice>
            </div>
            {fulfilment === 'delivery' && (
              <div className="mt-4">
                <label htmlFor="address" className={labelClass}>Delivery address</label>
                <textarea
                  id="address"
                  rows={2}
                  maxLength={300}
                  autoComplete="street-address"
                  className={`mt-1 ${inputClass}`}
                  value={address}
                  placeholder="Street, suburb, and any gate or complex details"
                  onChange={(event) => setAddress(event.target.value)}
                />
                <p className="mt-1 text-xs text-cocoa-400">We’ll add any delivery fee to your quote.</p>
              </div>
            )}
          </Section>

          <Section number={3} title="When would you like them?">
            <div className="grid gap-3 sm:grid-cols-2">
              {(['saturday', 'sunday'] as Day[]).map((option) => (
                <Choice
                  key={option}
                  selected={day === option}
                  onClick={() => {
                    setDay(option)
                    setTime('')
                  }}
                >
                  <span className="block font-semibold">{formatDay(weekend[option])}</span>
                  <span className="block text-sm opacity-80">
                    {option === 'saturday'
                      ? `${business.saturday_start} – ${business.saturday_end}`
                      : `${business.sunday_collection_start} – ${business.sunday_collection_end}`}
                  </span>
                </Choice>
              ))}
            </div>
            {day && (
              <div className="mt-4">
                <label htmlFor="time" className={labelClass}>Time</label>
                {availableSlots.length === 0 ? (
                  <p className="mt-1 text-sm text-blush-800">There are no times left that day. Please choose the other day.</p>
                ) : (
                  <select id="time" className={`mt-1 ${inputClass}`} value={time} onChange={(event) => setTime(event.target.value)}>
                    <option value="">Choose a time…</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                )}
                <p className="mt-1 text-xs text-cocoa-400">We’ll confirm the exact time with you on WhatsApp.</p>
              </div>
            )}
          </Section>

          <Section number={4} title="Your details">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>Your name</label>
                <input
                  id="name"
                  autoComplete="name"
                  maxLength={80}
                  className={`mt-1 ${inputClass}`}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>WhatsApp number</label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className={`mt-1 ${inputClass}`}
                  value={phone}
                  placeholder="072 123 4567"
                  onChange={(event) => setPhone(event.target.value)}
                />
                <p className="mt-1 text-xs text-cocoa-400">We’ll send your quote here.</p>
              </div>
            </div>

            <fieldset className="mt-5">
              <legend className={labelClass}>How would you like to pay?</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <Choice selected={payment === 'eft'} onClick={() => setPayment('eft')}>
                  <span className="block font-semibold">EFT / bank transfer</span>
                  <span className="block text-sm opacity-80">Bank details on your quote</span>
                </Choice>
                <Choice selected={payment === 'card'} onClick={() => setPayment('card')}>
                  <span className="block font-semibold">Card</span>
                  <span className="block text-sm opacity-80">We’ll send a secure payment link</span>
                </Choice>
              </div>
            </fieldset>

            <div className="mt-5">
              <label htmlFor="notes" className={labelClass}>Anything we should know?</label>
              <textarea
                id="notes"
                rows={2}
                maxLength={500}
                className={`mt-1 ${inputClass}`}
                value={notes}
                placeholder="A birthday, allergies, a gate code…"
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
          </Section>
        </div>

        <aside className="rounded-3xl bg-blush-50 p-5 sm:p-6 lg:sticky lg:top-28">
          <h2 className="text-xl">Your order</h2>
          {lines.length === 0 ? (
            <p className="mt-3 text-sm text-cocoa-400">Nothing yet. Add a box or two.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-cocoa-800">
              {lines.map((line) => (
                <li key={`${line.product.id}:${line.size.pack_size_id}`} className="flex justify-between gap-3">
                  <span>
                    {line.quantity} × {line.product.name}, {line.size.name}
                  </span>
                  <span className="shrink-0 font-semibold">{formatRand(line.quantity * line.size.price)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex items-baseline justify-between border-t border-blush-200 pt-4">
            <span className="font-semibold text-cocoa-800">Total</span>
            <span className="font-display text-2xl text-cocoa-800">{formatRand(total)}</span>
          </div>
          {fulfilment === 'delivery' && <p className="mt-1 text-xs text-cocoa-400">Plus any delivery fee, shown on your quote.</p>}
          {date && time && (
            <p className="mt-3 text-sm text-cocoa-500">
              {fulfilment === 'delivery' ? 'Delivery' : 'Collection'}: {formatDay(date)} at {time}
            </p>
          )}

          <div className="mt-5">
            <Turnstile resetKey={turnstileKey} onToken={setToken} />
          </div>

          {errorMessage && (
            <p role="alert" className="mt-4 rounded-xl bg-blush-100 px-4 py-3 text-sm text-blush-800">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="mt-4 w-full rounded-full bg-cocoa-500 px-6 py-3 font-semibold text-white transition hover:bg-cocoa-800 disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Place order'}
          </button>
          <p className="mt-3 text-center text-xs text-cocoa-400">Nothing is charged now. You’ll pay once you’ve seen your quote.</p>
        </aside>
      </form>
    </section>
  )
}