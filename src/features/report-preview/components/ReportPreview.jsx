import { useEffect, useState } from 'react'
import { printReport } from '../services/printReport'
import { formatReportFileName } from '../utils/formatPeriodLabel'
import ReportDocument from './ReportDocument'
import ReportTitleEditor from './ReportTitleEditor'
import ReportToolbar from './ReportToolbar'

function ReportPreview({ report, onBack, onTitleChange }) {
  const [isPreparing, setIsPreparing] = useState(false)
  const [printError, setPrintError] = useState('')

  useEffect(() => {
    const previousTitle = document.title
    document.title = formatReportFileName(report.cover.period)

    return () => {
      document.title = previousTitle
    }
  }, [report.cover.period])

  const handlePrint = async () => {
    if (isPreparing) return

    setIsPreparing(true)
    setPrintError('')

    try {
      await printReport()
    } catch {
      setPrintError('The print preview could not be opened. Please try again.')
    } finally {
      setIsPreparing(false)
    }
  }

  return (
    <section className="report-preview" aria-labelledby="report-preview-title">
      <ReportToolbar
        isPreparing={isPreparing}
        onBack={onBack}
        onPrint={handlePrint}
      />

      <ReportTitleEditor value={report.cover.title} onChange={onTitleChange} />

      {printError && (
        <p className="report-export-error" role="alert">
          {printError}
        </p>
      )}

      <div className="report-preview__viewport">
        <ReportDocument report={report} />
      </div>
    </section>
  )
}

export default ReportPreview
