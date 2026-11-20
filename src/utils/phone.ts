// "072 101 1269" or "+27 72 101 1269" → "+27721011269" (null if it isn't a valid SA number)
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, '')
  if (digits.length === 10 && digits.startsWith('0')) return `+27${digits.slice(1)}`
  if (digits.length === 11 && digits.startsWith('27')) return `+${digits}`
  return null
}