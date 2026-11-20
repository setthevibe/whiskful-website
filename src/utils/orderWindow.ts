import type { MenuBusiness } from '../types/menu'

export const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const weekdayNumber: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }

function minutesOfWeek(day: number, time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return (day - 1) * 1440 + hours * 60 + minutes
}

// Are orders open right now, South African time?
export function orderWindowStatus(business: MenuBusiness, now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Johannesburg',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? ''

  const current = minutesOfWeek(weekdayNumber[get('weekday')] ?? 1, `${get('hour')}:${get('minute')}`)
  const open = minutesOfWeek(business.order_open_day, business.order_open_time)
  const close = minutesOfWeek(business.order_close_day, business.order_close_time)
  const isOpen = open <= close ? current >= open && current <= close : current >= open || current <= close

  const closeText = `${dayNames[business.order_close_day - 1]} at ${business.order_close_time}`
  const openText = `${dayNames[business.order_open_day - 1]} at ${business.order_open_time}`
  return isOpen
    ? { isOpen, text: `Orders are open until ${closeText}` }
    : { isOpen, text: `Orders are closed for this week. They open again on ${openText}.` }
}