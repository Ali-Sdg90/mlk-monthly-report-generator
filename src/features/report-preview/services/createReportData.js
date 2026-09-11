import {
  calculateGrowthPercent,
  calculatePercentagePointChange,
} from './reportCalculations'
import { requiredCities as cityDefinitions } from '../../report-upload/config/workbookRequirements'
import {
  getPeriodKeys,
  periodKeysMatch,
} from '../../report-upload/utils/periodMetadata'
import {
  formatPeriodLabel,
  persianMonthNames,
} from '../utils/formatPeriodLabel'

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
  const normalizedLabel = normalizeDigits(formatPeriodLabel(periodLabel))
  const currentMonthIndex = persianMonthNames.findIndex((month) =>
    normalizedLabel.includes(month),
  )
  const yearMatch = normalizedLabel.match(/1[34]\d{2}/)

  if (currentMonthIndex < 0 || !yearMatch) return periodLabel

  const publicationMonthIndex =
    (currentMonthIndex + 1) % persianMonthNames.length
  const publicationYear =
    Number(yearMatch[0]) + (publicationMonthIndex === 0 ? 1 : 0)

  return `${persianMonthNames[publicationMonthIndex]} ${publicationYear}`
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

const findTehranProvince = (period) =>
  period?.provinces?.find((province) => province.name === 'تهران')

const findDistrict = (period, districtNumber) =>
  findTehranProvince(period)?.regions.find(
    (region) => region.districtNumber === districtNumber,
  )

const findRegion = (period, regionName) =>
  findTehranProvince(period)?.regions.find(
    (region) => region.region === regionName,
  )

const createDistrictComparison = (
  districtNumber,
  currentPeriod,
  previousPeriod,
) => {
  const current = findDistrict(currentPeriod, districtNumber)
  const previous = findDistrict(previousPeriod, districtNumber)

  return {
    districtNumber,
    currentSalePrice: current?.salePrice ?? null,
    previousSalePrice: previous?.salePrice ?? null,
    saleGrowth: calculateGrowthPercent(current?.salePrice, previous?.salePrice),
    currentMortgagePrice: current?.mortgagePrice ?? null,
    previousMortgagePrice: previous?.mortgagePrice ?? null,
    mortgageGrowth: calculateGrowthPercent(
      current?.mortgagePrice,
      previous?.mortgagePrice,
    ),
    currentRatio: current?.ratio ?? null,
    previousRatio: previous?.ratio ?? null,
    ratioChange: calculatePercentagePointChange(
      current?.ratio,
      previous?.ratio,
    ),
  }
}

const createRegionComparison = (name, currentPeriod, previousPeriod) => {
  const current = findRegion(currentPeriod, name)
  const previous = findRegion(previousPeriod, name)

  return {
    name,
    currentSalePrice: current?.salePrice ?? null,
    previousSalePrice: previous?.salePrice ?? null,
    saleGrowth: calculateGrowthPercent(current?.salePrice, previous?.salePrice),
    currentMortgagePrice: current?.mortgagePrice ?? null,
    previousMortgagePrice: previous?.mortgagePrice ?? null,
    mortgageGrowth: calculateGrowthPercent(
      current?.mortgagePrice,
      previous?.mortgagePrice,
    ),
    currentRatio: current?.ratio ?? null,
    previousRatio: previous?.ratio ?? null,
    ratioChange: calculatePercentagePointChange(
      current?.ratio,
      previous?.ratio,
    ),
  }
}

const getOtherRegionNames = (...periods) =>
  Array.from(
    new Set(
      periods.flatMap(
        (period) =>
          findTehranProvince(period)
            ?.regions.filter((region) => !region.districtNumber)
            .map((region) => region.region) ?? [],
      ),
    ),
  ).sort((first, second) => first.localeCompare(second, 'fa'))

const createTehranDetails = (zonesDataset, citiesSummary) => {
  const currentPeriod = zonesDataset.periods.find(
    (period) => period.role === 'current',
  )
  const previousPeriod = zonesDataset.periods.find(
    (period) => period.role === 'previous',
  )

  if (!currentPeriod || !previousPeriod) {
    throw new Error('Both parsed reporting periods are required.')
  }

  const districts = Array.from({ length: 22 }, (_, index) => index + 1).map(
    (districtNumber) =>
      createDistrictComparison(districtNumber, currentPeriod, previousPeriod),
  )
  const otherRegions = getOtherRegionNames(currentPeriod, previousPeriod).map(
    (name) => createRegionComparison(name, currentPeriod, previousPeriod),
  )
  const districtsWithSaleGrowth = districts.filter((district) =>
    Number.isFinite(district.saleGrowth),
  )
  const districtsWithRatio = districts.filter((district) =>
    Number.isFinite(district.currentRatio),
  )

  return {
    currentPeriod: currentPeriod.label,
    previousPeriod: previousPeriod.label,
    publicationDate: citiesSummary.publicationDate,
    summary: citiesSummary.cities.find((city) => city.id === 'tehran') ?? null,
    districts,
    otherRegions,
    insights: {
      highestSaleGrowth:
        findExtreme(
          districtsWithSaleGrowth,
          (district) => district.saleGrowth,
        ) ?? null,
      highestRatios: [...districtsWithRatio]
        .sort((first, second) => second.currentRatio - first.currentRatio)
        .slice(0, 2),
    },
  }
}

export const createReportData = ({ cities, zones }) => {
  if (!cities || !zones) {
    throw new Error('Both parsed datasets are required to create a report.')
  }

  const citiesPeriodKeys = getPeriodKeys(cities.periods)
  const zonesPeriodKeys = getPeriodKeys(zones.periods)

  if (!periodKeysMatch(citiesPeriodKeys, zonesPeriodKeys)) {
    throw new Error('The reporting periods in both workbooks must match.')
  }

  const citiesSummary = createCitiesSummary(cities)
  const tehranDetails = createTehranDetails(zones, citiesSummary)

  return {
    datasets: {
      cities,
      zones,
    },
    cover: {
      period: citiesSummary.currentPeriod,
      title: 'تعلیق در بازار',
    },
    citiesSummary,
    tehranDetails,
  }
}
