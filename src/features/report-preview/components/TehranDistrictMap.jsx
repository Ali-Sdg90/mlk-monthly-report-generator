import { toPersianDigits } from '../utils/formatPeriodLabel'

const districtLabels = [
  { district: 1, x: 67, y: 45 },
  { district: 2, x: 129, y: 67 },
  { district: 3, x: 191, y: 81 },
  { district: 4, x: 246, y: 82 },
  { district: 5, x: 339, y: 103 },
  { district: 6, x: 180, y: 116 },
  { district: 7, x: 238, y: 121 },
  { district: 8, x: 292, y: 126 },
  { district: 9, x: 107, y: 106 },
  { district: 10, x: 111, y: 153 },
  { district: 11, x: 166, y: 153 },
  { district: 12, x: 212, y: 152 },
  { district: 13, x: 272, y: 157 },
  { district: 14, x: 320, y: 164 },
  { district: 15, x: 280, y: 196 },
  { district: 16, x: 218, y: 193 },
  { district: 17, x: 164, y: 192 },
  { district: 18, x: 105, y: 192 },
  { district: 19, x: 163, y: 218 },
  { district: 20, x: 221, y: 222 },
  { district: 21, x: 55, y: 146 },
  { district: 22, x: 54, y: 205 },
]

function TehranDistrictMap() {
  return (
    <svg
      className="tehran-district-map"
      viewBox="0 0 420 250"
      role="img"
      aria-label="نقشه مناطق ۲۲ گانه تهران"
    >
      <path
        className="tehran-district-map__shape"
        d="M31 31C45 15 62 8 79 16l20 10 22-1 20 16 27 4 22 14 27-1 23 20 31 2 25 14 30-5 22 13 28 5 32 17-12 24-27 11-22 22-29-1-24 23-31-8-17 31-32-13-29 23-27-15-35 13-16-28-29-11 12-29-17-23 11-29-9-24 19-20Z"
      />
      <g className="tehran-district-map__boundaries">
        <path d="M79 16 72 70l35 36-2 86" />
        <path d="M121 25 116 74l50 42-2 102" />
        <path d="M141 41 129 67l61-8-10 57 38 77-3 15" />
        <path d="M190 59 191 82l47-4v43l-26 31" />
        <path d="M240 78 246 82l46 44-20 31 8 39" />
        <path d="M271 80 293 126l46-23" />
        <path d="M326 89 339 103l36 2" />
        <path d="M31 108 107 106l-52 40 56 7 53 39" />
        <path d="M107 106 180 116l-14 37 46-1 26-31" />
        <path d="M55 146 105 192l-51 13" />
        <path d="M105 192 163 218l1-26 54 1 3 29" />
        <path d="M280 196 218 193" />
        <path d="M272 157 320 164l28 11" />
      </g>
      <g className="tehran-district-map__labels">
        {districtLabels.map(({ district, x, y }) => (
          <text x={x} y={y} key={district}>
            منطقه {toPersianDigits(district)}
          </text>
        ))}
      </g>
    </svg>
  )
}

export default TehranDistrictMap
