import { ArrowLeft, Download, LoaderCircle } from 'lucide-react'

function ReportToolbar({ isExporting, onBack, onDownload }) {
  return (
    <header className="report-toolbar">
      <button className="secondary-button" type="button" onClick={onBack}>
        <ArrowLeft size={16} strokeWidth={2.3} aria-hidden="true" />
        Back to files
      </button>

      <div className="report-toolbar__title">
        <h2 id="report-preview-title">Report preview</h2>
        <p>Review the page before downloading the PDF.</p>
      </div>

      <button
        className="primary-button"
        type="button"
        disabled={isExporting}
        onClick={onDownload}
      >
        {isExporting ? (
          <LoaderCircle
            className="button-spinner"
            size={16}
            aria-hidden="true"
          />
        ) : (
          <Download size={16} strokeWidth={2.3} aria-hidden="true" />
        )}
        {isExporting ? 'Creating PDF...' : 'Download PDF'}
      </button>
    </header>
  )
}

export default ReportToolbar
