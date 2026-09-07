import iranRelief from '../assets/iran-relief.png'
import melkRadarLockup from '../assets/melkradar-lockup.svg'

const toPersianDigits = (value) =>
  String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)])

function DatabaseIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <ellipse cx="21" cy="10" rx="12" ry="5" />
      <path d="M9 10v24c0 2.8 5.4 5 12 5 3.2 0 6.1-.5 8.2-1.4" />
      <path d="M9 22c0 2.8 5.4 5 12 5 2.9 0 5.5-.4 7.6-1.2M9 34c0 2.8 5.4 5 12 5" />
      <circle className="accent" cx="34" cy="24" r="4" />
      <circle className="accent" cx="34" cy="36" r="4" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="14" />
      <circle cx="24" cy="24" r="7" />
      <path d="M24 3v10M24 35v10M3 24h10M35 24h10" />
      <circle className="accent-fill" cx="24" cy="24" r="2.5" />
    </svg>
  )
}

function SmartDecisionIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M6 41h37" />
      <path d="M11 36V25h7v11M22 36V17h7v19M33 36V9h7v27" />
      <path className="accent" d="m10 20 8-6 9 3 12-10" />
    </svg>
  )
}

const featureItems = [
  {
    title: 'داده‌های واقعی',
    text: 'از آگهی‌های ملک رادار',
    Icon: DatabaseIcon,
  },
  {
    title: 'تحلیل دقیق',
    text: 'براساس داده‌ها',
    Icon: TargetIcon,
  },
  {
    title: 'تصمیم‌های هوشمند',
    text: 'در بازار مسکن',
    Icon: SmartDecisionIcon,
  },
]

function ReportPage01({ data }) {
  return (
    <article
      className="report-page report-page--01"
      data-report-page="01"
      dir="rtl"
    >
      <div className="cover-decoration cover-decoration--dots" />
      <div className="cover-decoration cover-decoration--rings" />
      <div className="cover-decoration cover-decoration--waves" />

      <div className="cover-status">تعلیق در بازار</div>

      <div className="cover-brand" aria-label="ملک رادار">
        <img src={melkRadarLockup} alt="ملک رادار" />
      </div>

      <header className="cover-heading">
        <h1>
          گزارش ماهانه
          <span>بازار مسکن</span>
        </h1>

        <div className="cover-period">
          <i aria-hidden="true" />
          <strong>{toPersianDigits(data.period)}</strong>
          <i aria-hidden="true" />
        </div>

        <p>
          بررسی روند قیمت فروش، اجاره و نسبت اجاره به فروش
          <span>در مناطق تحت پوشش ملک رادار</span>
        </p>
      </header>

      <div className="cover-map" aria-label="نقشه ایران">
        <img src={iranRelief} alt="نقشه ایران" />
      </div>

      <footer className="cover-footer">
        <div className="cover-features">
          {featureItems.map(({ title, text, Icon }, index) => (
            <div className="cover-feature" key={title}>
              {index > 0 && <span className="cover-feature__separator" />}
              <Icon />
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="cover-website">
          <span>melkradar.com</span>
          <i aria-hidden="true" />
        </div>
      </footer>
    </article>
  )
}

export default ReportPage01
