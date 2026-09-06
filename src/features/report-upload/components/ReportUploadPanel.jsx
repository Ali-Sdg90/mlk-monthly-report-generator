import { ArrowRight, Check } from 'lucide-react'
import { uploadDefinitions } from '../config/uploadDefinitions'
import FileUploadCard from './FileUploadCard'

function ReportUploadPanel({
  uploads,
  handleFile,
  allFilesAreValid,
  validFileCount,
  onGenerate,
}) {
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
          className={`completion-state ${allFilesAreValid ? 'is-ready' : ''}`}
        >
          <span aria-hidden="true">
            {allFilesAreValid ? (
              <Check size={13} strokeWidth={3} />
            ) : (
              validFileCount
            )}
          </span>
          <p>
            <strong>
              {allFilesAreValid
                ? 'Both files are ready'
                : `${validFileCount} of 2 files validated`}
            </strong>
            <small>
              {allFilesAreValid
                ? 'You can start building the report.'
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
