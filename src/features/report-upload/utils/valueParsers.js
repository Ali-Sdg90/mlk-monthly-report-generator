import { normalizeDigits } from './textNormalization'

const normalizeNumericText = (value) =>
  normalizeDigits(value)
    .replace(/[٬,،\s]/g, '')
    .trim()

export const parsePriceValue = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : null
  }

  if (value === null || value === undefined || value === '') return null

  const normalized = normalizeNumericText(value).replace(/میلیون/gi, 'm')
  const match = normalized.match(/^([+-]?\d+(?:\.\d+)?)(m)?$/i)

  if (!match) return null

  const amount = Number(match[1]) * (match[2] ? 1_000_000 : 1)
  return Number.isFinite(amount) && amount > 0 ? amount : null
}

export const parseRatioValue = (value) => {
  if (value === null || value === undefined || value === '') return null

  const normalized = normalizeNumericText(value)
  const isPercent = normalized.endsWith('%')
  const parsed = Number(isPercent ? normalized.slice(0, -1) : normalized)

  if (!Number.isFinite(parsed) || parsed < 0) return null

  const ratio = isPercent || parsed > 1 ? parsed / 100 : parsed
  return ratio <= 1 ? ratio : null
}

export const isValidPrice = (value) => parsePriceValue(value) !== null

export const isValidRatio = (value) => parseRatioValue(value) !== null
