import { normalizeText } from './textNormalization'

const monthDefinitions = [
  { month: 1, aliases: ['فروردین', 'farvardin'] },
  { month: 2, aliases: ['اردیبهشت', 'ordibehesht'] },
  { month: 3, aliases: ['خرداد', 'khordad'] },
  { month: 4, aliases: ['تیر', 'tir'] },
  { month: 5, aliases: ['مرداد', 'mordad'] },
  { month: 6, aliases: ['شهریور', 'shahrivar'] },
  { month: 7, aliases: ['مهر', 'mehr'] },
  { month: 8, aliases: ['آبان', 'aban'] },
  { month: 9, aliases: ['آذر', 'azar'] },
  { month: 10, aliases: ['دی', 'dey'] },
  { month: 11, aliases: ['بهمن', 'bahman'] },
  { month: 12, aliases: ['اسفند', 'esfand'] },
]

export const parsePeriodLabel = (value) => {
  const label = normalizeText(value)
  const compactLabel = label.toLowerCase().replace(/[\s._/-]+/g, '')
  const yearMatches = compactLabel.match(/1[34]\d{2}/g)

  if (yearMatches?.length !== 1) return null

  const year = Number(yearMatches[0])
  const monthLabel = compactLabel.replace(yearMatches[0], '')
  const monthDefinition = monthDefinitions.find(({ aliases }) =>
    aliases.includes(monthLabel),
  )

  if (!monthDefinition) return null

  return {
    label,
    year,
    month: monthDefinition.month,
    key: `${year}-${String(monthDefinition.month).padStart(2, '0')}`,
    order: year * 12 + monthDefinition.month,
  }
}

export const getPeriodKeys = (periods) =>
  (periods ?? []).map(({ label }) => parsePeriodLabel(label)?.key ?? null)

export const periodKeysMatch = (firstKeys, secondKeys) =>
  firstKeys.length === 2 &&
  secondKeys.length === 2 &&
  firstKeys.every((key, index) => key && key === secondKeys[index])
