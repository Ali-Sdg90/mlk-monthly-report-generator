const decimalFormatter = new Intl.NumberFormat('fa-IR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const integerFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 0,
})

export const formatPrice = (value) => {
  if (!Number.isFinite(value)) return '—'

  const valueInMillions = value / 1_000_000
  const formatter =
    Math.abs(valueInMillions) < 10 ? decimalFormatter : integerFormatter

  return formatter.format(valueInMillions)
}

export const formatRatio = (value) => {
  if (!Number.isFinite(value)) return '—'

  const percentageValue = value * 100
  const formatter =
    Math.abs(percentageValue) < 10 ? decimalFormatter : integerFormatter

  return formatter.format(percentageValue)
}

export const formatChange = (value) => {
  if (!Number.isFinite(value)) return '—'

  const absoluteValue = Math.abs(value)
  const formatter = absoluteValue < 10 ? decimalFormatter : integerFormatter

  return formatter.format(absoluteValue)
}

export const directionFor = (value) =>
  value > 0 ? 'up' : value < 0 ? 'down' : 'neutral'
