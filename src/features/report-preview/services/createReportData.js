import {
  calculateGrowthPercent,
  calculatePercentagePointChange,
} from './reportCalculations'

const cityDefinitions = [
  { id: 'tehran', label: 'تهران', aliases: ['تهران'] },
  { id: 'karaj', label: 'کرج', aliases: ['کرج'] },
  { id: 'mashhad', label: 'مشهد', aliases: ['مشهد', 'خراسان'] },
  { id: 'shiraz', label: 'شیراز', aliases: ['شیراز'] },
  { id: 'isfahan', label: 'اصفهان', aliases: ['اصفهان'] },
  {
    id: 'north',
    label: 'شهرهای شمالی',
    aliases: ['شهرهای شمالی', 'شهرهای شمال'],
  },
]

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
  period?.rows.find((row) =>
    aliases.some((alias) => row.name === alias || row.name.includes(alias)),
  )

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

  return {
    datasets: {
      cities,
      tehran,
    },
    cover: {
      period: cities.periods[0]?.label || 'تیر ۱۴۰۵',
    },
    citiesSummary: createCitiesSummary(cities),
  }
}
