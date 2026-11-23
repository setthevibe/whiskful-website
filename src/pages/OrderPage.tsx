import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Check, ChevronDown, MessageCircle, Minus, Pencil, Plus } from 'lucide-react'
import { CinnamonRoll, FlavourArt } from '../components/illustrations'
import { Turnstile } from '../components/Turnstile'
import { useMenu } from '../hooks/useMenu'
import { submitOrder } from '../services/orders'
import type { PlacedOrder } from '../services/orders'
import { site } from '../site'
import { inputClass, labelClass } from '../styles'
import { allergenLabels } from '../types/menu'
import { formatRand } from '../utils/format'
import { groupMenu } from '../utils/menuGroups'
import { orderWindowStatus } from '../utils/orderWindow'
import { normalizePhone } from '../utils/phone'
import { comingWeekend, formatDay, timeSlots } from '../utils/weekend'

type Day = 'saturday' | 'sunday'
type Fulfilment = 'collection' | 'delivery'
type Payment = 'eft' | 'card'
type Step = 1 | 2 | 3 | 4

const MAX_PER_BOX = 20
const steps: { number: Step; label: string }[] = [
  { number: 1, label: 'Treats' },
  { number: 2, label: 'When' },
  { number: 3, label: 'Details' },
  { number: 4, label: 'Review' },
]

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

function Card({ title, onEdit, children }: { title: string; onEdit?: () => void; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-blush-100 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl">{title}</h2>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-blush-800 transition hover:bg-blush-50"
          >
            <Pencil size={14} aria-hidden="true" />
            Change
          </button>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </div>
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
          <li>We’ll confirm your {order.fulfilment === 'delivery' ? 'delivery' : 'collection'} time. Then it’s treat time!</li>
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

  const [step, setStep] = useState<Step>(1)
  const [furthestStep, setFurthestStep] = useState<Step>(1)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [openProductId, setOpenProductId] = useState<string | null | undefined>(undefined)
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

  // The menu, by category. Start on the category of a flavour picked from the Menu page.
  const groups = groupMenu(menu)
  const group =
    groups.find((item) => item.category.id === categoryId) ??
    groups.find((item) => item.products.some((product) => product.id === highlight)) ??
    groups[0]
  const openId = openProductId === undefined ? (highlight ?? group?.products[0]?.id ?? null) : openProductId

  // Everything in the order so far
  const lines = groups.flatMap((item) =>
    item.products.flatMap((product) =>
      product.sizes.map((size) => ({
        category: item.category,
        product,
        size,
        quantity: quantities[`${product.id}:${size.pack_size_id}`] ?? 0,
      })),
    ),
  ).filter((line) => line.quantity > 0)
  const boxes = lines.reduce((sum, line) => sum + line.quantity, 0)
  const total = lines.reduce((sum, line) => sum + line.quantity * line.size.price, 0)
  const orderAllergens = [...new Set(lines.flatMap((line) => line.product.allergens))].sort()
  const boxesIn = (filter: (line: (typeof lines)[number]) => boolean) =>
    lines.filter(filter).reduce((sum, line) => sum + line.quantity, 0)

  // When
  const weekend = comingWeekend(now)
  const date = day ? weekend[day] : ''
  const slots =
    day === 'saturday'
      ? timeSlots(business.saturday_start, business.saturday_end)
      : day === 'sunday'
        ? timeSlots(business.sunday_collection_start, business.sunday_collection_end)
        : []
  const availableSlots = slots.filter((slot) => new Date(`${date}T${slot}:00+02:00`) > now)

  function changeQuantity(key: string, change: number) {
    setQuantities((current) => ({
      ...current,
      [key]: Math.min(MAX_PER_BOX, Math.max(0, (current[key] ?? 0) + change)),
    }))
    setErrorMessage('')
  }

  // What's missing on a step, or '' if it's complete
  function problemOn(number: Step) {
    if (number === 1 && lines.length === 0) return 'Add at least one box.'
    if (number === 2) {
      if (fulfilment === 'delivery' && !address.trim()) return 'Enter your delivery address.'
      if (!date || !time) return 'Choose a day and time.'
    }
    if (number === 3) {
      if (!name.trim()) return 'Enter your name.'
      if (!normalizePhone(phone)) return 'Enter a valid South African cellphone number, like 072 123 4567.'
      if (!payment) return 'Choose how you’d like to pay.'
    }
    return ''
  }

  function goTo(number: Step) {
    setStep(number)
    setErrorMessage('')
    window.scrollTo(0, 0)
  }

  function next() {
    const problem = problemOn(step)
    if (problem) return setErrorMessage(problem)
    const following = (step + 1) as Step
    setFurthestStep((current) => (following > current ? following : current))
    goTo(following)
  }

  async function submit() {
    for (const number of [1, 2, 3] as Step[]) {
      const problem = problemOn(number)
      if (problem) {
        goTo(number)
        return setErrorMessage(problem)
      }
    }
    if (!token) return setErrorMessage('Just a moment, we’re still checking your connection. Try again in a few seconds.')

    setSending(true)
    setErrorMessage('')
    try {
      const result = await submitOrder(
        {
          full_name: name.trim(),
          phone,
          fulfilment,
          delivery_address: fulfilment === 'delivery' ? address.trim() : null,
          payment_method: payment as Payment,
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
    <section className="mx-auto max-w-3xl px-4 pb-44 pt-10">
      <h1 className="text-center text-4xl sm:text-5xl">Place your order</h1>
      <p className="mx-auto mt-4 w-fit rounded-full bg-mint-100 px-4 py-1.5 text-center text-sm font-semibold text-mint-800">{status.text}</p>

      {/* Progress: tap a step you've already done to go back to it */}
      <ol className="mx-auto mt-8 flex max-w-md items-start justify-between">
        {steps.map((item) => {
          const current = item.number === step
          const done = item.number < step
          return (
            <li key={item.number} className="flex flex-1 flex-col items-center gap-1.5">
              <button
                type="button"
                disabled={current || item.number > furthestStep}
                onClick={() => goTo(item.number)}
                aria-current={current ? 'step' : undefined}
                aria-label={`Step ${item.number}: ${item.label}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                  current
                    ? 'bg-cocoa-500 text-white'
                    : done
                      ? 'bg-mint-100 text-mint-800 hover:bg-mint-800 hover:text-white'
                      : 'bg-blush-50 text-cocoa-400'
                }`}
              >
                {done ? <Check size={16} aria-hidden="true" /> : item.number}
              </button>
              <span className={`text-xs ${current ? 'font-semibold text-cocoa-800' : 'text-cocoa-400'}`}>{item.label}</span>
            </li>
          )
        })}
      </ol>

      <div className="mt-8">
        {/* Step 1: treats */}
        {step === 1 && !group && (
          <p className="rounded-2xl bg-butter-100 p-5 text-center text-butter-800">
            There’s nothing on the menu right now. Please WhatsApp us.
          </p>
        )}
        {step === 1 && group && (
          <div>
            <h2 className="text-center text-2xl">What would you like?</h2>
            {groups.length > 1 && (
              <div className="mt-5 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Categories">
                {groups.map((item) => {
                  const selected = item.category.id === group.category.id
                  const chosen = boxesIn((line) => line.category.id === item.category.id)
                  return (
                    <button
                      key={item.category.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => {
                        setCategoryId(item.category.id)
                        setOpenProductId(item.products[0]?.id ?? null)
                      }}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold transition ${
                        selected ? 'bg-cocoa-500 text-white' : 'border border-blush-200 bg-white text-cocoa-800 hover:bg-blush-50'
                      }`}
                    >
                      {item.category.name}
                      {chosen > 0 && (
                        <span className={`rounded-full px-2 text-xs ${selected ? 'bg-white text-cocoa-800' : 'bg-mint-100 text-mint-800'}`}>
                          {chosen}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            <ul className="mt-6 space-y-3">
              {group.products.map((product) => {
                const isOpen = openId === product.id
                const chosen = boxesIn((line) => line.product.id === product.id)
                const from = Math.min(...product.sizes.map((size) => size.price))
                return (
                  <li key={product.id} className="overflow-hidden rounded-2xl border border-blush-100 bg-white">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenProductId(isOpen ? null : product.id)}
                      className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-blush-50"
                    >
                      <FlavourArt name={product.name} categoryName={group.category.name} className="h-12 w-12 shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-lg text-cocoa-800">{product.name}</span>
                        <span className="block text-sm text-cocoa-400">
                          {chosen > 0 ? `${chosen} ${chosen === 1 ? 'box' : 'boxes'} added` : `From ${formatRand(from)}`}
                        </span>
                      </span>
                      {chosen > 0 && (
                        <span className="rounded-full bg-mint-100 px-2.5 py-0.5 text-xs font-bold text-mint-800">{chosen}</span>
                      )}
                      <ChevronDown size={20} aria-hidden="true" className={`shrink-0 text-cocoa-400 transition ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="border-t border-blush-100 bg-cream px-4 pb-2">
                        {product.description && <p className="pt-3 text-sm text-cocoa-500">{product.description}</p>}
                        {product.allergens.length > 0 && (
                          <p className="pt-2 text-xs font-semibold text-blush-800">
                            Contains: {product.allergens.map((allergen) => allergenLabels[allergen]).join(', ')}
                          </p>
                        )}
                        {product.ingredients && product.ingredients.length > 0 && (
                          <p className="pt-1 text-xs text-cocoa-400">Ingredients: {product.ingredients.join(', ')}</p>
                        )}
                        <ul className="divide-y divide-blush-100">
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
                    )}
                  </li>
                )
              })}
            </ul>
            <p className="mt-4 text-center text-xs text-cocoa-400">Each box holds one flavour. Add as many boxes as you like.</p>
          </div>
        )}

        {/* Step 2: when, and collection or delivery */}
        {step === 2 && (
          <div className="space-y-6">
            <Card title="Collection or delivery">
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
            </Card>

            <Card title="When would you like it?">
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
            </Card>
          </div>
        )}

        {/* Step 3: details */}
        {step === 3 && (
          <Card title="Your details">
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
          </Card>
        )}

        {/* Step 4: review and send */}
        {step === 4 && (
          <div className="space-y-4">
            <Card title="Your treats" onEdit={() => goTo(1)}>
              {groups.map((item) => {
                const groupLines = lines.filter((line) => line.category.id === item.category.id)
                if (groupLines.length === 0) return null
                return (
                  <div key={item.category.id} className="mb-3 last:mb-0">
                    {groups.length > 1 && (
                      <p className="text-xs font-bold uppercase tracking-wide text-lavender-800">{item.category.name}</p>
                    )}
                    <ul className="mt-1 space-y-1.5 text-cocoa-800">
                      {groupLines.map((line) => (
                        <li key={`${line.product.id}:${line.size.pack_size_id}`} className="flex justify-between gap-3">
                          <span>
                            {line.quantity} × {line.product.name}, {line.size.name}
                          </span>
                          <span className="shrink-0 font-semibold">{formatRand(line.quantity * line.size.price)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
              <div className="mt-4 flex items-baseline justify-between border-t border-blush-100 pt-3">
                <span className="font-semibold text-cocoa-800">Total</span>
                <span className="font-display text-2xl text-cocoa-800">{formatRand(total)}</span>
              </div>
              {fulfilment === 'delivery' && <p className="text-xs text-cocoa-400">Plus any delivery fee, shown on your quote.</p>}
            </Card>

            <Card title="When" onEdit={() => goTo(2)}>
              <p className="text-cocoa-800">
                {fulfilment === 'delivery' ? 'Delivery' : 'Collection'} · {date ? formatDay(date) : ''} at {time}
              </p>
              <p className="mt-1 text-sm text-cocoa-500">
                {fulfilment === 'delivery'
                  ? address
                  : business.collection_area
                    ? `In ${business.collection_area}. We’ll send the address once you’ve paid.`
                    : 'We’ll send the address once you’ve paid.'}
              </p>
            </Card>

            <Card title="Your details" onEdit={() => goTo(3)}>
              <p className="text-cocoa-800">{name}</p>
              <p className="text-sm text-cocoa-500">{phone}</p>
              <p className="mt-1 text-sm text-cocoa-500">{payment === 'card' ? 'Paying by card' : 'Paying by EFT'}</p>
              {notes.trim() && <p className="mt-1 text-sm italic text-cocoa-500">“{notes.trim()}”</p>}
            </Card>

            {orderAllergens.length > 0 && (
              <div className="rounded-3xl border border-butter-100 bg-butter-100/60 p-5 text-butter-800">
                <p className="font-semibold">Allergy check</p>
                <p className="mt-1 text-sm">
                  Your order contains: <strong>{orderAllergens.map((allergen) => allergenLabels[allergen]).join(', ')}</strong>.
                  Everything is made in a home kitchen that also uses gluten, so we can’t promise anything is free of it.
                  Allergies? Mention them in your notes, or{' '}
                  <a href={site.whatsappUrl} target="_blank" rel="noreferrer" className="font-semibold underline">
                    WhatsApp us
                  </a>{' '}
                  before you order.
                </p>
              </div>
            )}

            <Turnstile resetKey={turnstileKey} onToken={setToken} />
            <p className="text-center text-xs text-cocoa-400">Nothing is charged now. You’ll pay once you’ve seen your quote.</p>
          </div>
        )}
      </div>

      {/* The bar along the bottom: total, Back and Next */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-blush-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        {errorMessage && (
          <p role="alert" className="mx-auto max-w-3xl px-4 pt-3 text-sm font-semibold text-blush-800">
            {errorMessage}
          </p>
        )}
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="font-display text-xl text-cocoa-800">{formatRand(total)}</p>
            <p className="text-xs text-cocoa-400">
              {boxes === 0 ? 'Nothing added yet' : `${boxes} ${boxes === 1 ? 'box' : 'boxes'}`}
              {boxes > 0 && fulfilment === 'delivery' && step > 1 ? ' + delivery' : ''}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => goTo((step - 1) as Step)}
                className="rounded-full border border-blush-200 bg-white px-5 py-3 font-semibold text-cocoa-800 transition hover:bg-blush-50"
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={next}
                className="rounded-full bg-cocoa-500 px-7 py-3 font-semibold text-white transition hover:bg-cocoa-800"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={sending}
                className="rounded-full bg-cocoa-500 px-7 py-3 font-semibold text-white transition hover:bg-cocoa-800 disabled:opacity-60"
              >
                {sending ? 'Sending…' : 'Place order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
