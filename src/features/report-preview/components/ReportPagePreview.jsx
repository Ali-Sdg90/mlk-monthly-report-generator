import { useEffect, useRef, useState } from 'react'
import { reportPageDimensions } from '../config/pageDimensions'

function ReportPagePreview({ children }) {
  const availableWidthRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const availableWidth = availableWidthRef.current
    if (!availableWidth) return undefined

    const updateScale = () => {
      setScale(
        Math.min(1, availableWidth.clientWidth / reportPageDimensions.widthPx),
      )
    }

    updateScale()

    const observer = new ResizeObserver(updateScale)
    observer.observe(availableWidth)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="report-page-preview" ref={availableWidthRef}>
      <div
        className="report-page-stage"
        style={{
          width: reportPageDimensions.widthPx * scale,
          height: reportPageDimensions.heightPx * scale,
        }}
      >
        <div
          className="report-page-scale"
          style={{ transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default ReportPagePreview
