// 35 → "R35", 37.5 → "R37.50"
export function formatRand(amount: number) {
  return Number.isInteger(amount) ? `R${amount}` : `R${amount.toFixed(2)}`
}