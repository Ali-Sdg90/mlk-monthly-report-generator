const waitForImages = () =>
  Promise.all(
    Array.from(document.querySelectorAll('.report-page img')).map((image) => {
      if (image.complete) return Promise.resolve()

      return new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true })
        image.addEventListener('error', resolve, { once: true })
      })
    }),
  )

export async function printReport() {
  if (document.fonts?.ready) await document.fonts.ready
  await waitForImages()
  window.print()
}
