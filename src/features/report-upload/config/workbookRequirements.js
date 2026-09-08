const commonHeaders = ['Sale Sqm Price', 'Mortg. Sqm Price', 'Ratio (Average)']

export const requiredHeaders = {
  cities: ['City', ...commonHeaders],
  tehran: ['CityZone', ...commonHeaders],
}

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

export const requiredDistricts = Array.from(
  { length: 22 },
  (_, index) => index + 1,
)
