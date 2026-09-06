import { useRef, useState } from 'react'
import ReportPage01 from '../pages/ReportPage01'
import { exportReportToPdf } from '../services/exportReportToPdf'
import ReportPagePreview from './ReportPagePreview'
import ReportToolbar from './ReportToolbar'

function ReportPreview({ report, onBack }) {
  const page01Ref = useRef(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState('')

  const handleDownload = async () => {
    if (!page01Ref.current || isExporting) return

    setIsExporting(true)
    setExportError('')

    try {
      await exportReportToPdf([page01Ref.current])
    } catch {
      setExportError('The PDF could not be created. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section className="report-preview" aria-labelledby="report-preview-title">
      <ReportToolbar
        isExporting={isExporting}
        onBack={onBack}
        onDownload={handleDownload}
      />

      {exportError && (
        <p className="report-export-error" role="alert">
          {exportError}
        </p>
      )}

      <div className="report-preview__viewport">
        <div className="report-preview__pages">
          <ReportPagePreview>
            <ReportPage01 ref={page01Ref} data={report.cover} />
          </ReportPagePreview>
        </div>
      </div>
    </section>
  )
}

export default ReportPreview
