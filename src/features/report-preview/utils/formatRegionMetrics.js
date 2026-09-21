const numberFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 0,
})

const decimalFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 1,
})

export const formatPrice = (value) =>
  Number.isFinite(value) ? numberFormatter.format(value / 1_000_000) : '—'

export const formatRatio = (value) =>
  Number.isFinite(value) ? numberFormatter.format(value * 100) : '—'

export const formatChange = (value, kind) => {
  if (!Number.isFinite(value)) return '—'

  return kind === 'ratio'
    ? decimalFormatter.format(Math.abs(value))
    : numberFormatter.format(Math.abs(value))
}

export const directionFor = (value) =>
  value > 0 ? 'up' : value < 0 ? 'down' : 'neutral'
