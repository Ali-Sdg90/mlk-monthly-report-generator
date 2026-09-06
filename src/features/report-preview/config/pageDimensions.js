const CSS_PIXELS_PER_INCH = 96
const MILLIMETERS_PER_INCH = 25.4

export const reportPageDimensions = {
  widthMm: 210,
  heightMm: 297,
  widthPx: (210 / MILLIMETERS_PER_INCH) * CSS_PIXELS_PER_INCH,
  heightPx: (297 / MILLIMETERS_PER_INCH) * CSS_PIXELS_PER_INCH,
}
