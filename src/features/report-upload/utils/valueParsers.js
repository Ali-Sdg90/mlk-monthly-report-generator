import { normalizeDigits } from './textNormalization'

export const isValidPrice = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0
  if (value === null || value === undefined || value === '') return false

  const normalized = normalizeDigits(value)
    .replace(/[٬,،\s]/g, '')
    .replace(/میلیون/gi, 'm')
    .trim()
  const match = normalized.match(/^([+-]?\d+(?:\.\d+)?)(m)?$/i)

  if (!match) return false

  const amount = Number(match[1]) * (match[2] ? 1_000_000 : 1)
  return Number.isFinite(amount) && amount > 0
}

export const isValidRatio = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0
  if (value === null || value === undefined || value === '') return false

  const normalized = normalizeDigits(value)
    .replace(/[٬,،\s]/g, '')
    .trim()
  const ratio = Number(
    normalized.endsWith('%') ? normalized.slice(0, -1) : normalized,
  )

  return Number.isFinite(ratio) && ratio >= 0
}
