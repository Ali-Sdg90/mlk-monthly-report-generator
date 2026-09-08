import readXlsxFile from 'read-excel-file/browser'
import {
  requiredCities,
  requiredDistricts,
  requiredHeaders,
} from '../config/workbookRequirements'
import { parsePeriodLabel } from '../utils/periodMetadata'
import { normalizeHeader, normalizeText } from '../utils/textNormalization'
import { isValidPrice, isValidRatio } from '../utils/valueParsers'
import { parseWorkbookSheets } from './workbookParser'

const buildFailedResult = (message) => ({
  valid: false,
  data: null,
  periodKeys: [],
  sheetNames: [],
  checks: [
    { id: 'readable', label: 'فایل اکسل قابل خواندن است.', passed: false },
  ],
  error: message,
})

const findColumnIndexes = (headerRow, kind) => {
  const normalizedHeaders = headerRow.map(normalizeHeader)
  const indexes = Object.fromEntries(
    requiredHeaders[kind].map((header) => [
      header,
      normalizedHeaders.indexOf(normalizeHeader(header)),
    ]),
  )

  return {
    indexes,
    complete: Object.values(indexes).every((index) => index >= 0),
  }
}

const getDataRows = (sheet, nameIndex) =>
  sheet.data.slice(1).filter((row) => normalizeText(row[nameIndex]).length > 0)

const getDistricts = (rows, nameIndex) => {
  const districts = new Set()

  rows.forEach((row) => {
    const match = normalizeText(row[nameIndex]).match(
      /(?:منطقه|district)\s*(\d{1,2})/i,
    )
    const district = match ? Number(match[1]) : null

    if (district && district >= 1 && district <= 22) districts.add(district)
  })

  return districts
}

const prepareSheetDetails = (sheets, kind) =>
  sheets.slice(0, 2).map((sheet) => {
    const headerRow = Array.isArray(sheet.data?.[0]) ? sheet.data[0] : []
    const columns = findColumnIndexes(headerRow, kind)
    const nameIndex = columns.indexes[requiredHeaders[kind][0]]
    const rows = nameIndex >= 0 ? getDataRows(sheet, nameIndex) : []

    return { ...columns, nameIndex, rows }
  })

const validateValues = (sheetDetails) =>
  sheetDetails.every((sheet) => {
    const saleIndex = sheet.indexes['Sale Sqm Price']
    const mortgageIndex = sheet.indexes['Mortg. Sqm Price']
    const ratioIndex = sheet.indexes['Ratio (Average)']

    return sheet.rows.every(
      (row) =>
        isValidPrice(row[saleIndex]) &&
        isValidPrice(row[mortgageIndex]) &&
        isValidRatio(row[ratioIndex]),
    )
  })

const validatePeriods = (sheets) => {
  const periods = sheets
    .slice(0, 2)
    .map((sheet) => parsePeriodLabel(sheet.sheet))
  const namesAreValid = periods.length === 2 && periods.every(Boolean)
  const orderIsValid = namesAreValid && periods[0].order > periods[1].order

  return {
    periods,
    checks: [
      {
        id: 'period-names',
        label: 'نام دوره‌های هر دو شیت معتبر است.',
        passed: namesAreValid,
        detail: namesAreValid
          ? undefined
          : 'نام شیت باید مانند «تیر ۱۴۰۵» یا «Tir1405» باشد.',
      },
      {
        id: 'period-order',
        label: 'ترتیب شیت‌ها از دوره جدیدتر به دوره قدیمی‌تر است.',
        passed: orderIsValid,
        detail:
          namesAreValid && !orderIsValid
            ? 'شیت اول باید دوره جدیدتر و شیت دوم دوره مقایسه‌ای باشد.'
            : undefined,
      },
    ],
  }
}

const validateRequiredCities = (sheetDetails, sheetNames) => {
  const issues = sheetDetails.flatMap((sheet, index) => {
    const cityNames = sheet.rows.map((row) =>
      normalizeText(row[sheet.nameIndex]),
    )
    const missing = []
    const duplicates = []

    requiredCities.forEach(({ label, aliases }) => {
      const normalizedAliases = aliases.map(normalizeText)
      const matchCount = cityNames.filter((name) =>
        normalizedAliases.includes(name),
      ).length

      if (matchCount === 0) missing.push(label)
      if (matchCount > 1) duplicates.push(label)
    })

    const sheetLabel = sheetNames[index] || `شیت ${index + 1}`
    const details = []
    if (missing.length > 0) details.push(`کمبود: ${missing.join('، ')}`)
    if (duplicates.length > 0) {
      details.push(`تکراری: ${duplicates.join('، ')}`)
    }

    return details.length > 0 ? `${sheetLabel}: ${details.join('؛ ')}.` : []
  })

  return {
    label: 'اطلاعات همه شهرهای موردنیاز در هر دو دوره موجود و یکتا است.',
    passed: issues.length === 0,
    detail: issues.length > 0 ? issues.join(' | ') : undefined,
  }
}

const validateCoverage = (kind, sheetDetails, sheetNames) => {
  if (kind === 'cities') {
    return validateRequiredCities(sheetDetails, sheetNames)
  }

  const districtSets = sheetDetails.map((sheet) =>
    getDistricts(sheet.rows, sheet.nameIndex),
  )
  const passed = districtSets.every(
    (districts) => districts.size === requiredDistricts.length,
  )
  const detail = districtSets
    .map((districts, index) => {
      const missingDistricts = requiredDistricts.filter(
        (district) => !districts.has(district),
      )

      return missingDistricts.length > 0
        ? `${sheetNames[index] || `شیت ${index + 1}`}: ${missingDistricts.join('، ')}.`
        : null
    })
    .filter(Boolean)
    .join(' | ')

  return {
    label: 'اطلاعات مناطق ۱ تا ۲۲ در هر دو دوره موجود است.',
    passed,
    detail: passed ? undefined : detail,
  }
}

export const validateSheets = (sheets, kind) => {
  if (!requiredHeaders[kind]) {
    return buildFailedResult('نوع فایل برای اعتبارسنجی مشخص نیست.')
  }

  const normalizedSheets = Array.isArray(sheets) ? sheets : []
  const twoSheetsFound = normalizedSheets.length === 2
  const sheetNames = normalizedSheets
    .map((sheet) => sheet.sheet)
    .filter(Boolean)
  const sheetDetails = prepareSheetDetails(normalizedSheets, kind)
  const periodValidation = validatePeriods(normalizedSheets)
  const headersComplete =
    twoSheetsFound &&
    sheetDetails.length === 2 &&
    sheetDetails.every((sheet) => sheet.complete)
  const sheetsHaveData =
    headersComplete && sheetDetails.every((sheet) => sheet.rows.length > 0)
  const valuesAreValid = sheetsHaveData && validateValues(sheetDetails)
  const coverage = headersComplete
    ? validateCoverage(kind, sheetDetails, sheetNames)
    : {
        label:
          kind === 'cities'
            ? 'اطلاعات همه شهرهای موردنیاز در هر دو دوره موجود و یکتا است.'
            : 'اطلاعات مناطق ۱ تا ۲۲ در هر دو دوره موجود است.',
        passed: false,
      }

  const checks = [
    {
      id: 'sheets',
      label: 'دو شیت مربوط به دوره‌های مقایسه پیدا شد.',
      passed: twoSheetsFound,
      detail: twoSheetsFound
        ? undefined
        : `${normalizedSheets.length} شیت پیدا شد.`,
    },
    {
      id: 'headers',
      label: 'ستون‌های موردنیاز در هر دو شیت موجود است.',
      passed: headersComplete,
    },
    ...periodValidation.checks,
    {
      id: 'rows',
      label: 'هر دو شیت دارای داده هستند.',
      passed: sheetsHaveData,
    },
    {
      id: 'values',
      label: 'مقادیر قیمت و نسبت قابل پردازش هستند.',
      passed: valuesAreValid,
    },
    { id: 'coverage', ...coverage },
  ]

  return {
    valid: checks.every((check) => check.passed),
    periodKeys: periodValidation.periods.map((period) => period?.key ?? null),
    sheetNames,
    checks,
  }
}

export const validateWorkbook = async (file, kind) => {
  if (!file?.name?.toLowerCase().endsWith('.xlsx')) {
    return buildFailedResult('لطفاً یک فایل با فرمت XLSX انتخاب کنید.')
  }

  try {
    const sheets = await readXlsxFile(file)
    const result = validateSheets(sheets, kind)

    return result.valid
      ? { ...result, data: parseWorkbookSheets(sheets, kind) }
      : { ...result, data: null }
  } catch {
    return buildFailedResult(
      'فایل قابل خواندن نیست یا ساختار معتبر XLSX ندارد.',
    )
  }
}
