import { ArrowRight, Check, X } from 'lucide-react'
import { uploadDefinitions } from '../config/uploadDefinitions'
import FileUploadCard from './FileUploadCard'

function ReportUploadPanel({
  uploads,
  handleFile,
  allFilesAreValid,
  periodConsistency,
  validFileCount,
  onGenerate,
}) {
  const periodsMismatch = periodConsistency.checked && !periodConsistency.passed

  return (
    <section className="upload-panel" aria-labelledby="upload-title">
      <div className="panel-heading">
        <h2 id="upload-title">Upload Excel files</h2>
        <p>Upload the two Excel files required to build the report.</p>
      </div>

      <div className="upload-grid">
        {Object.entries(uploadDefinitions).map(([kind, definition]) => (
          <FileUploadCard
            key={kind}
            kind={kind}
            {...definition}
            upload={uploads[kind]}
            onFile={(file) => handleFile(kind, file)}
          />
        ))}
      </div>

      <small className="privacy-note">
        Files are processed locally in your browser and are not uploaded.
      </small>

      <div className="panel-actions">
        <div
          className={`completion-state ${allFilesAreValid ? 'is-ready' : ''} ${periodsMismatch ? 'has-error' : ''}`}
        >
          <span aria-hidden="true">
            {allFilesAreValid ? (
              <Check size={13} strokeWidth={3} />
            ) : periodsMismatch ? (
              <X size={13} strokeWidth={2.8} />
            ) : (
              validFileCount
            )}
          </span>
          <p>
            <strong>
              {allFilesAreValid
                ? 'Both files are ready'
                : periodsMismatch
                  ? 'Reporting periods do not match'
                  : `${validFileCount} of 2 files validated`}
            </strong>
            <small>
              {allFilesAreValid
                ? 'You can start building the report.'
                : periodsMismatch
                  ? 'Both files must contain the same current and comparison periods.'
                  : 'Both files must pass validation to continue.'}
            </small>
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
          disabled={!allFilesAreValid}
          onClick={onGenerate}
        >
          Generate report
          <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

export default ReportUploadPanel
