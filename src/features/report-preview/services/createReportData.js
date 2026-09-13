import {
  calculateGrowthPercent,
  calculatePercentagePointChange,
} from './reportCalculations'
import {
  requiredCities as cityDefinitions,
  requiredProvinces as regionDefinitions,
} from '../../report-upload/config/workbookRequirements'
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

const findProvince = (period, aliases) =>
  period?.provinces?.find((province) => aliases.includes(province.name))

const findDistrict = (period, aliases, districtNumber) =>
  findProvince(period, aliases)?.regions.find(
    (region) => region.districtNumber === districtNumber,
  )

const findRegion = (period, aliases, regionName) =>
  findProvince(period, aliases)?.regions.find(
    (region) => region.region === regionName,
  )

const createDistrictComparison = (
  districtNumber,
  currentPeriod,
  previousPeriod,
  provinceAliases,
) => {
  const current = findDistrict(currentPeriod, provinceAliases, districtNumber)
  const previous = findDistrict(previousPeriod, provinceAliases, districtNumber)

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

const createRegionComparison = (
  name,
  currentPeriod,
  previousPeriod,
  provinceAliases,
) => {
  const current = findRegion(currentPeriod, provinceAliases, name)
  const previous = findRegion(previousPeriod, provinceAliases, name)

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

const getDistrictNumbers = (provinceAliases, ...periods) =>
  Array.from(
    new Set(
      periods.flatMap(
        (period) =>
          findProvince(period, provinceAliases)
            ?.regions.filter((region) => region.districtNumber)
            .map((region) => region.districtNumber) ?? [],
      ),
    ),
  ).sort((first, second) => first - second)

const getOtherRegionNames = (provinceAliases, ...periods) =>
  Array.from(
    new Set(
      periods.flatMap(
        (period) =>
          findProvince(period, provinceAliases)
            ?.regions.filter((region) => !region.districtNumber)
            .map((region) => region.region) ?? [],
      ),
    ),
  ).sort((first, second) => first.localeCompare(second, 'fa'))

const createRegionDetails = (definition, zonesDataset, citiesSummary) => {
  const currentPeriod = zonesDataset.periods.find(
    (period) => period.role === 'current',
  )
  const previousPeriod = zonesDataset.periods.find(
    (period) => period.role === 'previous',
  )

  if (!currentPeriod || !previousPeriod) {
    throw new Error('Both parsed reporting periods are required.')
  }

  const districts = getDistrictNumbers(
    definition.aliases,
    currentPeriod,
    previousPeriod,
  ).map((districtNumber) =>
    createDistrictComparison(
      districtNumber,
      currentPeriod,
      previousPeriod,
      definition.aliases,
    ),
  )
  const otherRegions = getOtherRegionNames(
    definition.aliases,
    currentPeriod,
    previousPeriod,
  ).map((name) =>
    createRegionComparison(
      name,
      currentPeriod,
      previousPeriod,
      definition.aliases,
    ),
  )
  const insightCandidates = districts.length > 0 ? districts : otherRegions
  const regionsWithSaleGrowth = insightCandidates.filter((region) =>
    Number.isFinite(region.saleGrowth),
  )
  const regionsWithRatio = insightCandidates.filter((region) =>
    Number.isFinite(region.currentRatio),
  )

  return {
    id: definition.id,
    title: definition.pageLabel,
    currentPeriod: currentPeriod.label,
    previousPeriod: previousPeriod.label,
    publicationDate: citiesSummary.publicationDate,
    summary:
      citiesSummary.cities.find((city) => city.id === definition.id) ?? null,
    districts,
    otherRegions,
    insights: {
      highestSaleGrowth:
        findExtreme(regionsWithSaleGrowth, (region) => region.saleGrowth) ??
        null,
      highestRatios: [...regionsWithRatio]
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
  const regionDetails = regionDefinitions.map((definition) =>
    createRegionDetails(definition, zones, citiesSummary),
  )

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
    regionDetails,
    tehranDetails: regionDetails[0],
  }
}
