import earthFooter from '../assets/earth-footer.webp'
import footerLogo from '../assets/footer-logo.webp'
import { formatPeriodLabel, toPersianDigits } from '../utils/formatPeriodLabel'

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4m10-4v4M3 10h18M8 14h2m4 0h2m-8 3h2m4 0h2" />
    </svg>
  )
}

function ReportFooter({ pageNumber, publicationDate }) {
  return (
    <footer className="report-footer">
      <div className="report-footer__page">
        صفحه <span>{toPersianDigits(pageNumber)}</span> از گزارش ماهانه
      </div>
      <span className="report-footer__divider" />
      <div className="report-footer__date">
        <CalendarIcon />
        <span>تاریخ انتشار: {formatPeriodLabel(publicationDate)}</span>
      </div>
      <span className="report-footer__divider" />
      <a
        className="report-footer__website"
        href="https://melkradar.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="report-footer__earth"
          src={earthFooter}
          alt=""
          aria-hidden="true"
          draggable="false"
        />
        <span>melkradar.com</span>
      </a>
      <a
        className="report-footer__brand"
        href="https://melkradar.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={footerLogo} alt="ملک رادار" />
      </a>
    </footer>
  )
}

export default ReportFooter
