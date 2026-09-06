import { ArrowLeft, Download, LoaderCircle } from 'lucide-react'

function ReportToolbar({ isPreparing, onBack, onPrint }) {
  return (
    <header className="report-toolbar">
      <button className="secondary-button" type="button" onClick={onBack}>
        <ArrowLeft size={16} strokeWidth={2.3} aria-hidden="true" />
        Back to files
      </button>

      <div className="report-toolbar__title">
        <h2 id="report-preview-title">Report preview</h2>
        <p>
          A4 · 100% scale · no margins · headers and footers off · background
          graphics on
        </p>
      </div>

      <button
        className="primary-button"
        type="button"
        disabled={isPreparing}
        onClick={onPrint}
      >
        {isPreparing ? (
          <LoaderCircle
            className="button-spinner"
            size={16}
            aria-hidden="true"
          />
        ) : (
          <Download size={16} strokeWidth={2.3} aria-hidden="true" />
        )}
        {isPreparing ? 'Preparing...' : 'Save as PDF'}
      </button>
    </header>
  )
}

export default ReportToolbar
