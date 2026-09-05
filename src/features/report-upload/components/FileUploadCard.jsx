import { useState } from 'react'
import { Upload } from 'lucide-react'
import { formatFileSize } from '../utils/fileSize'
import FileInfoTooltip from './FileInfoTooltip'
import ValidationResult from './ValidationResult'

function FileUploadCard({ kind, eyebrow, title, info, upload, onFile }) {
  const [isDragging, setIsDragging] = useState(false)
  const inputId = `${kind}-file-input`

  const acceptDroppedFile = (event) => {
    event.preventDefault()
    setIsDragging(false)
    onFile(event.dataTransfer.files?.[0] ?? null)
  }

  return (
    <article className={`upload-card status-${upload.status}`}>
      <div className="card-header">
        <div className="file-type-icon" aria-hidden="true">
          XLSX
        </div>
        <div className="file-heading">
          <span className="card-eyebrow">{eyebrow}</span>
          <div className="file-title-row">
            <h3>{title}</h3>
            <FileInfoTooltip id={`${kind}-info`} items={info} />
          </div>
        </div>
        {upload.status !== 'idle' && (
          <span className={`status-badge status-badge-${upload.status}`}>
            {upload.status === 'checking' && 'Checking'}
            {upload.status === 'valid' && 'Valid'}
            {upload.status === 'invalid' && 'Review needed'}
          </span>
        )}
      </div>

      <div
        className={`drop-zone ${isDragging ? 'is-dragging' : ''}`}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={acceptDroppedFile}
      >
        <input
          id={inputId}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={(event) => onFile(event.target.files?.[0] ?? null)}
        />
        <label htmlFor={inputId}>
          <span className="upload-icon" aria-hidden="true">
            <Upload size={17} strokeWidth={2.25} />
          </span>
          {upload.file ? (
            <>
              <strong className="selected-file-name">{upload.file.name}</strong>
              <small>{formatFileSize(upload.file.size)}</small>
              <span className="choose-file">Replace file</span>
            </>
          ) : (
            <>
              <strong>Drop your file here</strong>
              <small>or click to browse</small>
              <span className="file-rule">XLSX files only</span>
            </>
          )}
        </label>
      </div>

      {upload.status === 'checking' && (
        <div className="checking-state" role="status">
          <span className="spinner" aria-hidden="true" />
          Reading sheets and validating data…
        </div>
      )}

      {upload.result && <ValidationResult result={upload.result} />}
    </article>
  )
}

export default FileUploadCard
