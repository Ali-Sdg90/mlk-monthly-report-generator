import { useState } from 'react'
import { printReport } from '../services/printReport'
import ReportDocument from './ReportDocument'
import ReportToolbar from './ReportToolbar'

function ReportPreview({ report, onBack }) {
  const [isPreparing, setIsPreparing] = useState(false)
  const [printError, setPrintError] = useState('')

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
