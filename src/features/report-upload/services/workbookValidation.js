import readXlsxFile from 'read-excel-file/browser'
import {
  requiredCities,
  requiredHeaders,
  requiredProvinces,
  workbookColumns,
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
    Object.entries(workbookColumns[kind]).map(([key, header]) => [
      key,
      normalizedHeaders.indexOf(normalizeHeader(header)),
    ]),
  )

  return {
    indexes,
    complete: Object.values(indexes).every((index) => index >= 0),
  }
}

const getDataRows = (sheet, identityIndexes) =>
  sheet.data
    .slice(1)
    .filter((row) =>
      identityIndexes.every(
        (identityIndex) => normalizeText(row[identityIndex]).length > 0,
      ),
    )

const prepareSheetDetails = (sheets, kind) =>
  sheets.slice(0, 2).map((sheet) => {
    const headerRow = Array.isArray(sheet.data?.[0]) ? sheet.data[0] : []
    const columns = findColumnIndexes(headerRow, kind)
    const identityIndexes =
      kind === 'cities'
        ? [columns.indexes.name]
        : [columns.indexes.province, columns.indexes.region]
    const rows = identityIndexes.every((index) => index >= 0)
      ? getDataRows(sheet, identityIndexes)
      : []

    return { ...columns, rows }
  })

const hasValidMetrics = (row, indexes) =>
  isValidPrice(row[indexes.salePrice]) &&
  isValidPrice(row[indexes.mortgagePrice]) &&
  isValidRatio(row[indexes.ratio])

const validateValues = (sheetDetails, kind) =>
  sheetDetails.every((sheet) => {
    if (kind === 'zones') {
      return requiredProvinces.every(({ aliases }) => {
        const normalizedAliases = aliases.map(normalizeText)

        return sheet.rows.some(
          (row) =>
            normalizedAliases.includes(
              normalizeText(row[sheet.indexes.province]),
            ) && hasValidMetrics(row, sheet.indexes),
        )
      })
    }

    const saleIndex = sheet.indexes.salePrice
    const mortgageIndex = sheet.indexes.mortgagePrice
    const ratioIndex = sheet.indexes.ratio

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
      normalizeText(row[sheet.indexes.name]),
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

const validateRequiredProvinces = (sheetDetails, sheetNames) => {
  const issues = sheetDetails.flatMap((sheet, index) => {
    const provinceNames = new Set(
      sheet.rows.map((row) => normalizeText(row[sheet.indexes.province])),
    )
    const missing = requiredProvinces
      .filter(({ aliases }) => {
        const normalizedAliases = aliases.map(normalizeText)
        return !normalizedAliases.some((alias) => provinceNames.has(alias))
      })
      .map(({ label }) => label)

    if (missing.length === 0) return []

    const sheetLabel = sheetNames[index] || `شیت ${index + 1}`
    return `${sheetLabel}: کمبود: ${missing.join('، ')}.`
  })

  return {
    label: 'اطلاعات همه استان‌های موردنیاز در هر دو دوره موجود است.',
    passed: issues.length === 0,
    detail: issues.length > 0 ? issues.join(' | ') : undefined,
  }
}

const validateCoverage = (kind, sheetDetails, sheetNames) => {
  if (kind === 'cities') {
    return validateRequiredCities(sheetDetails, sheetNames)
  }

  return validateRequiredProvinces(sheetDetails, sheetNames)
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
  const valuesAreValid = sheetsHaveData && validateValues(sheetDetails, kind)
  const coverage = headersComplete
    ? validateCoverage(kind, sheetDetails, sheetNames)
    : {
        label:
          kind === 'cities'
            ? 'اطلاعات همه شهرهای موردنیاز در هر دو دوره موجود و یکتا است.'
            : 'اطلاعات همه استان‌های موردنیاز در هر دو دوره موجود است.',
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
      label:
        kind === 'cities'
          ? 'مقادیر قیمت و نسبت قابل پردازش هستند.'
          : 'برای استان‌های موردنیاز، مقادیر قیمت و نسبت قابل پردازش موجود است.',
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
