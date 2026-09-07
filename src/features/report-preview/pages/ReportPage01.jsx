import iranRelief from '../assets/iran-white.png'
import melkRadarLockup from '../assets/melkradar-lockup.png'

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
      <path d="M8 39h32" />
      <path d="M10 36V28h7v8M20 36V21h7v15M30 36V12h7v24" />
    </svg>
  )
}

const featureItems = [
  {
    title: 'داده‌های واقعی',
    text: 'از آگهی‌های ملک‌رادار',
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

const mapCities = [
  { name: 'رشت', top: '108px', left: '206px', labelPlacement: 'above' },
  { name: 'ساری', top: '140px', left: '288px', labelPlacement: 'above' },
  { name: 'گرگان', top: '115px', left: '332px', labelPlacement: 'right' },
  { name: 'کرج', top: '160px', left: '234px', labelPlacement: 'left' },
  { name: 'تهران', top: '172px', left: '264px', labelPlacement: 'left' },
  { name: 'مشهد', top: '163px', left: '476px', labelPlacement: 'left' },
  { name: 'اصفهان', top: '265px', left: '266px', labelPlacement: 'right' },
  { name: 'شیراز', top: '355px', left: '293px', labelPlacement: 'right' },
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

      <a
        className="cover-brand"
        href="https://melkradar.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="مشاهده وب‌سایت ملک‌رادار"
      >
        <img src={melkRadarLockup} alt="ملک‌رادار" />
      </a>

      <header className="cover-heading">
        <h1>
          <span className="cover-heading__monthly">گزارش ماهانه</span>
          <span className="cover-heading__market">بـازار مـسکـن</span>
        </h1>

        <div className="cover-period">
          <i aria-hidden="true" />
          <strong>{toPersianDigits(data.period)}</strong>
          <i aria-hidden="true" />
        </div>

        <p>
          بررسی روند قیمت فروش، اجاره و نسبت اجاره به فروش
          <span>در مناطق تحت پوشش ملک‌رادار</span>
        </p>
      </header>

      <div className="cover-map" aria-label="نقشه ایران">
        <img src={iranRelief} alt="نقشه ایران" />
        <div className="cover-map__cities">
          {mapCities.map(({ name, top, left, labelPlacement }) => (
            <div className="cover-map__city" key={name} style={{ top, left }}>
              <span className="cover-map__dot" aria-hidden="true" />
              <span
                className={`cover-map__label cover-map__label--${labelPlacement}`}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
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
          <a
            href="https://melkradar.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            melkradar.com
          </a>
        </div>
      </footer>
    </article>
  )
}

export default ReportPage01
