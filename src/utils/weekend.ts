const TIME_ZONE = 'Africa/Johannesburg'

function todayInSouthAfrica(now: Date) {
  return now.toLocaleDateString('en-CA', { timeZone: TIME_ZONE })
}

function addDays(date: string, days: number) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10)
}

// 1 = Monday … 7 = Sunday
function weekdayOf(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return weekday === 0 ? 7 : weekday
}

// The coming Saturday and Sunday, as "2026-11-28"
export function comingWeekend(now: Date) {
  const today = todayInSouthAfrica(now)
  const saturday = addDays(today, (6 - weekdayOf(today) + 7) % 7)
  return { saturday, sunday: addDays(saturday, 1) }
}

// "09:00" to "17:00" → every half hour in between
export function timeSlots(start: string, end: string) {
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
  const slots: string[] = []
  for (let minute = toMinutes(start); minute <= toMinutes(end); minute += 30) {
    slots.push(`${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`)
  }
  return slots
}

// "2026-11-28" → "Saturday 28 November"
export function formatDay(date: string) {
  return new Intl.DateTimeFormat('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    new Date(`${date}T12:00:00Z`),
  )
}