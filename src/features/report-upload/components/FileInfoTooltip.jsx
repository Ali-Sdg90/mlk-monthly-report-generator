import { CircleCheck, Info } from 'lucide-react'

function FileInfoTooltip({ id, items }) {
  return (
    <div className="info-wrapper">
      <button
        type="button"
        className="info-button"
        aria-label="File requirements"
        aria-describedby={id}
      >
        <Info size={15} strokeWidth={2.2} aria-hidden="true" />
      </button>
      <div className="info-tooltip" id={id} role="tooltip" lang="fa" dir="rtl">
        <p>این فایل باید شامل موارد زیر باشد:</p>
        <ul className="info-list">
          {items.map((item) => (
            <li key={item}>
              <CircleCheck size={14} strokeWidth={2.2} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FileInfoTooltip
