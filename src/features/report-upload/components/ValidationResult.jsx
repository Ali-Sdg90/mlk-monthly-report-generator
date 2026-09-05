import { Check, X } from 'lucide-react'

function ValidationResult({ result }) {
  return (
    <div className="validation-result" aria-live="polite">
      <div className="validation-heading">
        <strong>نتیجه اعتبارسنجی فایل</strong>
        {result.sheetNames?.length > 0 && (
          <small>{result.sheetNames.join(' · ')}</small>
        )}
      </div>

      <ul className="validation-list">
        {result.checks.map((check) => (
          <li
            className={check.passed ? 'has-passed' : 'has-failed'}
            key={check.id}
          >
            <span aria-hidden="true">
              {check.passed ? (
                <Check size={11} strokeWidth={3} />
              ) : (
                <X size={12} strokeWidth={2.7} />
              )}
            </span>
            <p>
              {check.label}
              {check.detail && <small>{check.detail}</small>}
            </p>
          </li>
        ))}
      </ul>

      {result.error && <p className="file-error">{result.error}</p>}
    </div>
  )
}

export default ValidationResult
