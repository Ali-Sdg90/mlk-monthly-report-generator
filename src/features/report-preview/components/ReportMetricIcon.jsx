import keyItem from '../assets/key-item.webp'

function ReportMetricIcon({ type }) {
  if (type === 'sale') {
    return (
      <svg viewBox="0 0 42 42" aria-hidden="true">
        <path d="M10 20.5 21 11l11 9.5V33H10V20.5Z" />
        <path d="M17.5 33V23h7v10M8 22l13-11.5L34 22" />
      </svg>
    )
  }

  if (type === 'mortgage') {
    return (
      <img
        className="report-metric-icon__key"
        src={keyItem}
        alt=""
        aria-hidden="true"
      />
    )
  }

  return (
    <svg viewBox="0 0 42 42" aria-hidden="true">
      <circle cx="13.5" cy="13.5" r="3.5" />
      <circle cx="28.5" cy="28.5" r="3.5" />
      <path d="m30 9-18 24" />
    </svg>
  )
}

export default ReportMetricIcon
