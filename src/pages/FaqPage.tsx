import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { useMenu } from '../hooks/useMenu'
import { site } from '../site'
import { allergenLabels } from '../types/menu'
import type { MenuBusiness } from '../types/menu'
import { formatRand } from '../utils/format'
import { dayNames } from '../utils/orderWindow'

function FaqItem({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details className="group rounded-2xl border border-blush-100 bg-white p-5 transition open:bg-blush-50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-cocoa-800 [&::-webkit-details-marker]:hidden">
        {question}
        <Plus size={18} aria-hidden="true" className="shrink-0 text-blush-800 transition group-open:rotate-45" />
      </summary>
      <div className="mt-3 space-y-2 text-cocoa-500">{children}</div>
    </details>
  )
}

function deliveryText(business: MenuBusiness) {
  const free = `Delivery is free within ${business.free_delivery_radius_km} km.`
  if (business.delivery_fee_per_km) {
    const minimum = business.minimum_delivery_fee ? ` (minimum ${formatRand(business.minimum_delivery_fee)})` : ''
    return `${free} Further away, it’s ${formatRand(business.delivery_fee_per_km)} per km${minimum}. Choose delivery on the order page and add your address.`
  }
  return `${free} Further away, we’ll quote delivery on WhatsApp.`
}

export function FaqPage() {
  const { menu } = useMenu()
  const business = menu?.business
  const products = menu?.products.filter((product) => product.sizes.length > 0) ?? []

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="text-center text-4xl sm:text-5xl">Questions</h1>
      <p className="mt-3 text-center text-cocoa-400">
        Can’t find your answer?{' '}
        <a href={site.whatsappUrl} target="_blank" rel="noreferrer" className="font-semibold text-blush-800 underline">
          WhatsApp us
        </a>
        .
      </p>

      <div className="mt-10 space-y-3">
        <FaqItem question="How do I order?">
          <p>
            Use the Order page: pick your flavours and box sizes, choose a day and time, and send it. We’ll reply on WhatsApp
            with your quote.
          </p>
        </FaqItem>

        <FaqItem question="When can I order?">
          <p>
            {business
              ? `Orders open ${dayNames[business.order_open_day - 1]} at ${business.order_open_time} and close ${dayNames[business.order_close_day - 1]} at ${business.order_close_time}, for that weekend.`
              : 'Orders open early in the week and close on Thursday, for that weekend.'}
          </p>
        </FaqItem>

        <FaqItem question="When do I get my rolls?">
          <p>
            {business
              ? `You choose Saturday, or Sunday between ${business.sunday_collection_start} and ${business.sunday_collection_end}, and we confirm the time with you on WhatsApp.`
              : 'You choose a day over the weekend, and we confirm the time with you on WhatsApp.'}
          </p>
        </FaqItem>

        <FaqItem question="How do I pay?">
          <p>
            By EFT or card. Your quote includes our bank details or a secure card payment link. Your order is booked once
            payment is in, and quotes are held for a limited time, so pay soon to keep your spot.
          </p>
        </FaqItem>

        <FaqItem question="Where do I collect?">
          <p>
            {business?.collection_area
              ? `Collection is in ${business.collection_area}. You’ll get the exact address on WhatsApp once you’ve paid.`
              : 'You’ll get the collection address on WhatsApp once you’ve paid.'}
          </p>
        </FaqItem>

        <FaqItem question="Do you deliver?">
          <p>{business ? deliveryText(business) : 'Yes. Choose delivery on the order page and we’ll confirm the cost.'}</p>
        </FaqItem>

        <FaqItem question="Can I mix flavours in a box?">
          <p>Each box holds one flavour, but you can order as many boxes as you like.</p>
        </FaqItem>

        {/* ✏️ Check this matches your own recipe and how long yours keep */}
        <FaqItem question="How do I store and reheat them?">
          <p>
            They’re best on the day. Because of the cream cheese icing, keep leftovers covered in the fridge and enjoy them
            within 2 days. Warm one for 15 to 20 seconds in the microwave and it’s soft and gooey again.
          </p>
        </FaqItem>

        <FaqItem question="What about allergens?">
          {products.map((product) => (
            <p key={product.id}>
              <span className="font-semibold text-cocoa-800">{product.name}:</span>{' '}
              {product.allergens.length > 0
                ? product.allergens.map((allergen) => allergenLabels[allergen]).join(', ')
                : 'no listed allergens'}
            </p>
          ))}
          <p>
            Everything is made in a home kitchen that also uses these ingredients, so we can’t promise any roll is free of
            them. Message us if you have an allergy and we’ll help you choose.
          </p>
        </FaqItem>

        <FaqItem question="Can I order for a party or event?">
          <p>Yes! For big orders, WhatsApp us before you order so we can make sure there’s space in the oven.</p>
        </FaqItem>
      </div>
    </section>
  )
}