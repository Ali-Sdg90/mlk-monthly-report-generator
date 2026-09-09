import { workbookColumns } from '../config/workbookRequirements'
import { normalizeHeader, normalizeText } from '../utils/textNormalization'
import { parsePriceValue, parseRatioValue } from '../utils/valueParsers'

const periodRoles = ['current', 'previous']

const findColumnIndexes = (headerRow, kind) => {
  const normalizedHeaders = headerRow.map(normalizeHeader)

  return Object.fromEntries(
    Object.entries(workbookColumns[kind]).map(([key, header]) => [
      key,
      normalizedHeaders.indexOf(normalizeHeader(header)),
    ]),
  )
}

const extractDistrictNumber = (name) => {
  const match = normalizeText(name).match(/(?:منطقه|district)\s*(\d{1,2})/i)
  const districtNumber = match ? Number(match[1]) : null

  return districtNumber >= 1 && districtNumber <= 22 ? districtNumber : null
}

const parseMetrics = (row, indexes) => ({
  salePrice: parsePriceValue(row[indexes.salePrice]),
  mortgagePrice: parsePriceValue(row[indexes.mortgagePrice]),
  ratio: parseRatioValue(row[indexes.ratio]),
})

const parseCityRows = (sheet, indexes) =>
  sheet.data
    .slice(1)
    .map((row, index) => ({ row, rowNumber: index + 2 }))
    .filter(({ row }) => normalizeText(row[indexes.name]).length > 0)
    .map(({ row, rowNumber }) => ({
      name: normalizeText(row[indexes.name]),
      ...parseMetrics(row, indexes),
      rowNumber,
    }))

const parseZoneRows = (sheet, indexes) =>
  sheet.data
    .slice(1)
    .map((row, index) => ({ row, rowNumber: index + 2 }))
    .filter(
      ({ row }) =>
        normalizeText(row[indexes.province]).length > 0 &&
        normalizeText(row[indexes.region]).length > 0,
    )
    .map(({ row, rowNumber }) => {
      const region = normalizeText(row[indexes.region])

      return {
        province: normalizeText(row[indexes.province]),
        region,
        districtNumber: extractDistrictNumber(region),
        ...parseMetrics(row, indexes),
        rowNumber,
      }
    })

const groupRowsByProvince = (rows) => {
  const provinces = new Map()

  rows.forEach(({ province, ...region }) => {
    if (!provinces.has(province)) {
      provinces.set(province, { name: province, regions: [] })
    }

    provinces.get(province).regions.push(region)
  })

  return Array.from(provinces.values())
}

const parseSheet = (sheet, kind) => {
  const headerRow = Array.isArray(sheet.data?.[0]) ? sheet.data[0] : []
  const indexes = findColumnIndexes(headerRow, kind)

  if (kind === 'cities') {
    return { rows: parseCityRows(sheet, indexes) }
  }

  const rows = parseZoneRows(sheet, indexes)

  return {
    rows,
    provinces: groupRowsByProvince(rows),
  }
}

export const parseWorkbookSheets = (sheets, kind) => ({
  kind,
  periods: sheets.slice(0, 2).map((sheet, index) => ({
    role: periodRoles[index],
    label: normalizeText(sheet.sheet),
    ...parseSheet(sheet, kind),
  })),
})
