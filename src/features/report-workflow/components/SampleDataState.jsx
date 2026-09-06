import { LoaderCircle, RefreshCw } from 'lucide-react'

function SampleDataState({ error, onRetry, onUseUploads }) {
  if (!error) {
    return (
      <section className="workflow-state" aria-live="polite">
        <LoaderCircle className="workflow-state__spinner" aria-hidden="true" />
        <div>
          <h2>Preparing sample report</h2>
          <p>Reading, validating, and parsing both sample workbooks...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="workflow-state workflow-state--error" role="alert">
      <div>
        <h2>Sample data could not be prepared</h2>
        <p>{error}</p>
      </div>
      <div className="workflow-state__actions">
        <button
          className="secondary-button"
          type="button"
          onClick={onUseUploads}
        >
          Use file uploads
        </button>
        <button className="primary-button" type="button" onClick={onRetry}>
          <RefreshCw size={16} aria-hidden="true" />
          Try again
        </button>
      </div>
    </section>
  )
}

export default SampleDataState
