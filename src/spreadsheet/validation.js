import readXlsxFile from 'read-excel-file/browser'

const commonHeaders = ['Sale Sqm Price', 'Mortg. Sqm Price', 'Ratio (Average)']
const requiredHeaders = {
  cities: ['City', ...commonHeaders],
  tehran: ['CityZone', ...commonHeaders],
}
const digitMap = {
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
}

const normalizeDigits = (value) =>
  String(value ?? '').replace(/[۰-۹٠-٩]/g, (digit) => digitMap[digit])
const normalizeText = (value) =>
  normalizeDigits(value)
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\u200c/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const normalizeHeader = (value) => normalizeText(value).toLowerCase()

const parsePrice = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0
  if (value === null || value === undefined || value === '') return false
  const normalized = normalizeDigits(value)
    .replace(/[٬,،\s]/g, '')
    .replace(/میلیون/gi, 'm')
    .trim()
  const match = normalized.match(/^([+-]?\d+(?:\.\d+)?)(m)?$/i)
  if (!match) return false
  const amount = Number(match[1]) * (match[2] ? 1_000_000 : 1)
  return Number.isFinite(amount) && amount > 0
}

const parseRatio = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0
  if (value === null || value === undefined || value === '') return false
  const normalized = normalizeDigits(value)
    .replace(/[٬,،\s]/g, '')
    .trim()
  const ratio = Number(
    normalized.endsWith('%') ? normalized.slice(0, -1) : normalized,
  )
  return Number.isFinite(ratio) && ratio >= 0
}

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

const buildFailedResult = (message) => ({
  valid: false,
  sheetNames: [],
  checks: [
    { id: 'readable', label: 'فایل اکسل قابل خواندن است.', passed: false },
  ],
  error: message,
})

export const validateSheets = (sheets, kind) => {
  if (!requiredHeaders[kind])
    return buildFailedResult('نوع فایل برای اعتبارسنجی مشخص نیست.')
  const normalizedSheets = Array.isArray(sheets) ? sheets : []
  const twoSheetsFound = normalizedSheets.length === 2
  const sheetNames = normalizedSheets
    .map((sheet) => sheet.sheet)
    .filter(Boolean)
  const sheetDetails = normalizedSheets.slice(0, 2).map((sheet) => {
    const headerRow = Array.isArray(sheet.data?.[0]) ? sheet.data[0] : []
    const columns = findColumnIndexes(headerRow, kind)
    const nameIndex = columns.indexes[requiredHeaders[kind][0]]
    const rows = nameIndex >= 0 ? getDataRows(sheet, nameIndex) : []
    return { ...columns, nameIndex, rows }
  })

  const headersComplete =
    twoSheetsFound &&
    sheetDetails.length === 2 &&
    sheetDetails.every((sheet) => sheet.complete)
  const sheetsHaveData =
    headersComplete && sheetDetails.every((sheet) => sheet.rows.length > 0)
  const valuesAreValid =
    sheetsHaveData &&
    sheetDetails.every((sheet) => {
      const saleIndex = sheet.indexes['Sale Sqm Price']
      const mortgageIndex = sheet.indexes['Mortg. Sqm Price']
      const ratioIndex = sheet.indexes['Ratio (Average)']
      return sheet.rows.every(
        (row) =>
          parsePrice(row[saleIndex]) &&
          parsePrice(row[mortgageIndex]) &&
          parseRatio(row[ratioIndex]),
      )
    })

  let coveragePassed = false
  let coverageLabel = 'اطلاعات تهران در هر دو دوره موجود است.'
  let coverageDetail
  if (headersComplete && kind === 'cities') {
    coveragePassed = sheetDetails.every((sheet) =>
      sheet.rows.some((row) =>
        normalizeText(row[sheet.nameIndex]).includes('تهران'),
      ),
    )
  }
  if (headersComplete && kind === 'tehran') {
    coverageLabel = 'اطلاعات مناطق ۱ تا ۲۲ در هر دو دوره موجود است.'
    const districtSets = sheetDetails.map((sheet) =>
      getDistricts(sheet.rows, sheet.nameIndex),
    )
    coveragePassed = districtSets.every((districts) => districts.size === 22)
    if (!coveragePassed) {
      const missingDistricts = districtSets.map((districts) =>
        Array.from({ length: 22 }, (_, index) => index + 1).filter(
          (district) => !districts.has(district),
        ),
      )
      coverageDetail = missingDistricts
        .map((districts, index) =>
          districts.length > 0
            ? `${sheetNames[index] || `شیت ${index + 1}`}: ${districts.join('، ')}.`
            : null,
        )
        .filter(Boolean)
        .join(' | ')
    }
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
    {
      id: 'coverage',
      label: coverageLabel,
      passed: coveragePassed,
      detail: coverageDetail,
    },
  ]
  return { valid: checks.every((check) => check.passed), sheetNames, checks }
}

export const validateWorkbook = async (file, kind) => {
  if (!file?.name?.toLowerCase().endsWith('.xlsx'))
    return buildFailedResult('لطفاً یک فایل با فرمت XLSX انتخاب کنید.')
  try {
    return validateSheets(await readXlsxFile(file), kind)
  } catch {
    return buildFailedResult(
      'فایل قابل خواندن نیست یا ساختار معتبر XLSX ندارد.',
    )
  }
}
