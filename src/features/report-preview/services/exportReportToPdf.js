import { reportPageDimensions } from '../config/pageDimensions'

const EXPORT_SCALE = 2
const DEFAULT_FILE_NAME = 'melkradar-monthly-report.pdf'

const waitForImages = (element) =>
  Promise.all(
    Array.from(element.querySelectorAll('img')).map((image) => {
      if (image.complete) return Promise.resolve()
      return new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true })
        image.addEventListener('error', resolve, { once: true })
      })
    }),
  )

export async function exportReportToPdf(
  pageElements,
  fileName = DEFAULT_FILE_NAME,
) {
  const pages = pageElements.filter(Boolean)
  if (pages.length === 0) throw new Error('No report pages are available.')

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  await document.fonts.ready
  await Promise.all(pages.map(waitForImages))

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  for (const [index, page] of pages.entries()) {
    const pageId = page.dataset.reportPage
    const canvas = await html2canvas(page, {
      backgroundColor: '#ffffff',
      height: page.offsetHeight,
      logging: false,
      scale: EXPORT_SCALE,
      useCORS: true,
      width: page.offsetWidth,
      onclone: (clonedDocument) => {
        const clonedPage = clonedDocument.querySelector(
          `[data-report-page="${pageId}"]`,
        )
        clonedPage
          ?.closest('.report-page-scale')
          ?.style.setProperty('transform', 'none')
      },
    })

    if (index > 0) pdf.addPage('a4', 'portrait')

    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      0,
      reportPageDimensions.widthMm,
      reportPageDimensions.heightMm,
      undefined,
      'FAST',
    )

    canvas.width = 1
    canvas.height = 1
  }

  pdf.save(fileName)
}
