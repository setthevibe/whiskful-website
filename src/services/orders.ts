import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from './supabase'

export type WebsiteOrder = {
  full_name: string
  phone: string
  fulfilment: 'collection' | 'delivery'
  delivery_address: string | null
  payment_method: 'eft' | 'card'
  notes: string | null
  requested_for: string
  items: { product_id: string; pack_size_id: string; quantity: number }[]
}

export type PlacedOrder = {
  order_number: string
  subtotal: number
  fulfilment: 'collection' | 'delivery'
}

export async function submitOrder(order: WebsiteOrder, token: string): Promise<PlacedOrder> {
  const { data, error } = await supabase.functions.invoke('website-order', { body: { order, token } })
  if (error) {
    // The function answered with a message for the customer, like "Please enter your name."
    if (error instanceof FunctionsHttpError) {
      const body = (await error.context.json().catch(() => null)) as { error?: string } | null
      throw new Error(body?.error ?? 'Something went wrong. Please try again.')
    }
    throw new Error('We couldn’t reach the bakery. Check your connection and try again.')
  }
  return (data as { order: PlacedOrder }).order
}