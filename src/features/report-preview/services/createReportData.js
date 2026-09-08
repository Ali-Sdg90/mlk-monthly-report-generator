import {
  calculateGrowthPercent,
  calculatePercentagePointChange,
} from './reportCalculations'
import { requiredCities as cityDefinitions } from '../../report-upload/config/workbookRequirements'
import {
  getPeriodKeys,
  periodKeysMatch,
} from '../../report-upload/utils/periodMetadata'

const persianMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
]

const normalizeDigits = (value) =>
  String(value ?? '')
    .replace(/[۰-۹]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))
    .replace(/[٠-٩]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit))

const findCityRow = (period, aliases) =>
  period?.rows.find((row) => aliases.includes(row.name))

const createCityComparison = (definition, currentPeriod, previousPeriod) => {
  const current = findCityRow(currentPeriod, definition.aliases)
  const previous = findCityRow(previousPeriod, definition.aliases)

  return {
    id: definition.id,
    name: definition.label,
    salePrice: current?.salePrice ?? null,
    saleGrowth: calculateGrowthPercent(current?.salePrice, previous?.salePrice),
    mortgagePrice: current?.mortgagePrice ?? null,
    mortgageGrowth: calculateGrowthPercent(
      current?.mortgagePrice,
      previous?.mortgagePrice,
    ),
    ratio: current?.ratio ?? null,
    ratioChange: calculatePercentagePointChange(
      current?.ratio,
      previous?.ratio,
    ),
  }
}

const findExtreme = (cities, selector, direction = 'max') => {
  const candidates = cities.filter((city) => Number.isFinite(selector(city)))
  if (candidates.length === 0) return null

  return candidates.reduce((selected, city) => {
    const selectedValue = selector(selected)
    const cityValue = selector(city)

    return direction === 'min'
      ? cityValue < selectedValue
        ? city
        : selected
      : cityValue > selectedValue
        ? city
        : selected
  })
}

const createPublicationDate = (periodLabel) => {
  const normalizedLabel = normalizeDigits(periodLabel)
  const currentMonthIndex = persianMonths.findIndex((month) =>
    normalizedLabel.includes(month),
  )
  const yearMatch = normalizedLabel.match(/1[34]\d{2}/)

  if (currentMonthIndex < 0 || !yearMatch) return periodLabel

  const publicationMonthIndex = (currentMonthIndex + 1) % persianMonths.length
  const publicationYear =
    Number(yearMatch[0]) + (publicationMonthIndex === 0 ? 1 : 0)

  return `${persianMonths[publicationMonthIndex]} ${publicationYear}`
}

const createCitiesSummary = (citiesDataset) => {
  const currentPeriod = citiesDataset.periods.find(
    (period) => period.role === 'current',
  )
  const previousPeriod = citiesDataset.periods.find(
    (period) => period.role === 'previous',
  )

  if (!currentPeriod || !previousPeriod) {
    throw new Error('Both parsed reporting periods are required.')
  }

  const cities = cityDefinitions.map((definition) =>
    createCityComparison(definition, currentPeriod, previousPeriod),
  )

  return {
    currentPeriod: currentPeriod?.label || '',
    previousPeriod: previousPeriod?.label || '',
    publicationDate: createPublicationDate(currentPeriod?.label || ''),
    cities,
    insights: {
      saleGrowth: findExtreme(cities, (city) => city.saleGrowth),
      mortgageGrowth: findExtreme(cities, (city) => city.mortgageGrowth),
      ratioDecline: findExtreme(cities, (city) => city.ratioChange, 'min'),
    },
  }
}

export const createReportData = ({ cities, tehran }) => {
  if (!cities || !tehran) {
    throw new Error('Both parsed datasets are required to create a report.')
  }

  const citiesPeriodKeys = getPeriodKeys(cities.periods)
  const tehranPeriodKeys = getPeriodKeys(tehran.periods)

  if (!periodKeysMatch(citiesPeriodKeys, tehranPeriodKeys)) {
    throw new Error('The reporting periods in both workbooks must match.')
  }

  const citiesSummary = createCitiesSummary(cities)

  return {
    datasets: {
      cities,
      tehran,
    },
    cover: {
      period: citiesSummary.currentPeriod,
      title: 'تعلیق در بازار',
    },
    citiesSummary,
  }
}
