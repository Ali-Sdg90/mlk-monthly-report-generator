import { requiredHeaders } from '../config/workbookRequirements'
import { normalizeHeader, normalizeText } from '../utils/textNormalization'
import { parsePriceValue, parseRatioValue } from '../utils/valueParsers'

const periodRoles = ['current', 'previous']

const findColumnIndexes = (headerRow, kind) => {
  const normalizedHeaders = headerRow.map(normalizeHeader)

  return Object.fromEntries(
    requiredHeaders[kind].map((header) => [
      header,
      normalizedHeaders.indexOf(normalizeHeader(header)),
    ]),
  )
}

const extractDistrictNumber = (name) => {
  const match = normalizeText(name).match(/(?:منطقه|district)\s*(\d{1,2})/i)
  const districtNumber = match ? Number(match[1]) : null

  return districtNumber >= 1 && districtNumber <= 22 ? districtNumber : null
}

const parseSheetRows = (sheet, kind) => {
  const headerRow = Array.isArray(sheet.data?.[0]) ? sheet.data[0] : []
  const indexes = findColumnIndexes(headerRow, kind)
  const nameHeader = requiredHeaders[kind][0]

  return sheet.data
    .slice(1)
    .map((row, index) => ({ row, rowNumber: index + 2 }))
    .filter(({ row }) => normalizeText(row[indexes[nameHeader]]).length > 0)
    .map(({ row, rowNumber }) => {
      const name = normalizeText(row[indexes[nameHeader]])

      return {
        name,
        districtNumber: kind === 'tehran' ? extractDistrictNumber(name) : null,
        salePrice: parsePriceValue(row[indexes['Sale Sqm Price']]),
        mortgagePrice: parsePriceValue(row[indexes['Mortg. Sqm Price']]),
        ratio: parseRatioValue(row[indexes['Ratio (Average)']]),
        rowNumber,
      }
    })
}

export const parseWorkbookSheets = (sheets, kind) => ({
  kind,
  periods: sheets.slice(0, 2).map((sheet, index) => ({
    role: periodRoles[index],
    label: normalizeText(sheet.sheet),
    rows: parseSheetRows(sheet, kind),
  })),
})
