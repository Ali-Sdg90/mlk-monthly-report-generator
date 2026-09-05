const commonHeaders = ['Sale Sqm Price', 'Mortg. Sqm Price', 'Ratio (Average)']

export const requiredHeaders = {
  cities: ['City', ...commonHeaders],
  tehran: ['CityZone', ...commonHeaders],
}

export const requiredDistricts = Array.from(
  { length: 22 },
  (_, index) => index + 1,
)
