export const workbookColumns = {
  cities: {
    name: 'City',
    salePrice: 'Sale Sqm Price',
    mortgagePrice: 'Mortg. Sqm Price',
    ratio: 'Ratio (Average)',
  },
  zones: {
    province: 'CityTitle',
    region: 'CityZone',
    salePrice: 'SellSqmPriceAvg (Average)',
    mortgagePrice: 'MortgageSqmAvg (Average)',
    ratio: 'Ratio (Average)',
  },
}

export const requiredHeaders = Object.fromEntries(
  Object.entries(workbookColumns).map(([kind, columns]) => [
    kind,
    Object.values(columns),
  ]),
)

export const requiredCities = [
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

export const requiredProvinces = [
  { id: 'tehran', label: 'تهران', pageLabel: 'تهران', aliases: ['تهران'] },
  { id: 'karaj', label: 'کرج', pageLabel: 'کرج', aliases: ['کرج'] },
  {
    id: 'mashhad',
    label: 'خراسان',
    pageLabel: 'مشهد',
    aliases: ['خراسان', 'مشهد'],
  },
  { id: 'shiraz', label: 'شیراز', pageLabel: 'شیراز', aliases: ['شیراز'] },
  {
    id: 'isfahan',
    label: 'اصفهان',
    pageLabel: 'اصفهان',
    aliases: ['اصفهان'],
  },
  {
    id: 'north',
    label: 'شهرهای شمالی',
    pageLabel: 'شهرهای شمالی',
    aliases: ['شهرهای شمالی', 'شهرهای شمال'],
  },
]
