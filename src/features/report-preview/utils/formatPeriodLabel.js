import { parsePeriodLabel } from '../../report-upload/utils/periodMetadata'

const monthNames = {
  farvardin: 'فروردین',
  ordibehesht: 'اردیبهشت',
  khordad: 'خرداد',
  tir: 'تیر',
  mordad: 'مرداد',
  shahrivar: 'شهریور',
  mehr: 'مهر',
  aban: 'آبان',
  azar: 'آذر',
  dey: 'دی',
  bahman: 'بهمن',
  esfand: 'اسفند',
}

const englishMonthPattern = new RegExp(Object.keys(monthNames).join('|'), 'i')
const persianMonthPattern = new RegExp(
  `(${Object.values(monthNames).join('|')})[\\s._/-]*(?=[۰-۹٠-٩\\d]{4})`,
)

export const persianMonthNames = Object.values(monthNames)

export const toPersianDigits = (value) =>
  String(value ?? '').replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)])

export const formatPeriodLabel = (value) => {
  const label = String(value ?? '').trim()
  const englishMonth = label.match(englishMonthPattern)?.[0]
  const localizedLabel = englishMonth
    ? label.replace(englishMonthPattern, monthNames[englishMonth.toLowerCase()])
    : label

  return toPersianDigits(localizedLabel.replace(persianMonthPattern, '$1 '))
}

export const formatReportFileName = (periodLabel) => {
  const period = parsePeriodLabel(periodLabel)
  const prefix = 'MelkRadar.BazarMaskan.MonthlyReport'

  if (!period) return prefix

  const month = Object.keys(monthNames)[period.month - 1]
  return `${prefix}.${month[0].toUpperCase()}${month.slice(1)}${period.year}`
}
