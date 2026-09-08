import melkRadarLockup from '../assets/melkradar-lockup.webp'
import footerLogo from '../assets/footer-logo.png'
import keyItem from '../assets/key-item.png'

const numberFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 0,
})

const formatNumber = (value) =>
  Number.isFinite(value) ? numberFormatter.format(Math.round(value)) : '—'

const toPersianDigits = (value) =>
  String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)])

const formatPrice = (value) =>
  Number.isFinite(value) ? formatNumber(value / 1_000_000) : '—'
const formatRatio = (value) =>
  Number.isFinite(value) ? formatNumber(value * 100) : '—'
const directionFor = (value) =>
  value > 0 ? 'up' : value < 0 ? 'down' : 'neutral'

function TrendArrow({ direction }) {
  return (
    <svg className="market-trend-arrow" viewBox="0 0 20 20" aria-hidden="true">
      {direction === 'neutral' ? (
        <path d="M4 10h12" />
      ) : (
        <path
          d={
            direction === 'up'
              ? 'M10 16V4m0 0L5 9m5-5 5 5'
              : 'M10 4v12m0 0-5-5m5 5 5-5'
          }
        />
      )}
    </svg>
  )
}

function MetricIcon({ type }) {
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
        className="market-metric-heading__key"
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

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4.2" ry="9" />
      <path d="M3 12h18" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4m10-4v4M3 10h18M8 14h2m4 0h2m-8 3h2m4 0h2" />
    </svg>
  )
}

const metricHeaders = [
  {
    type: 'sale',
    title: 'قیمت فروش',
    unit: 'تومان / مترمربع',
  },
  {
    type: 'mortgage',
    title: 'قیمت رهن کامل',
    unit: 'تومان / مترمربع',
  },
  {
    type: 'ratio',
    title: 'نسبت رهن به فروش',
    unit: 'درصد',
  },
]

function TrendBadge({ value, kind }) {
  const direction = directionFor(value)
  const formattedValue = Number.isFinite(value)
    ? formatNumber(Math.abs(value))
    : '—'

  return (
    <span className={`market-trend market-trend--${direction}`}>
      <TrendArrow direction={direction} />
      <b>{formattedValue}</b>
      <span>{kind === 'ratio' ? 'واحد درصد' : '٪'}</span>
    </span>
  )
}

function MetricValue({ value, change, kind, previousPeriod }) {
  return (
    <div className="market-city-metric">
      <div className="market-city-metric__value">
        <strong>
          {kind === 'ratio' ? formatRatio(value) : formatPrice(value)}
          {kind === 'ratio' && <span>٪</span>}
        </strong>
        {kind !== 'ratio' && <span>میلیون</span>}
      </div>
      <TrendBadge value={change} kind={kind} />
      <small>نسبت به {previousPeriod}</small>
    </div>
  )
}

function CityRow({ city, previousPeriod }) {
  return (
    <article className="market-city-row">
      <div className="market-city">
        <i aria-hidden="true" />
        <span
          className={`market-city__landmark market-city__landmark--${city.id}`}
          aria-hidden="true"
        />
        <h2>{city.name}</h2>
      </div>
      <MetricValue
        value={city.salePrice}
        change={city.saleGrowth}
        kind="sale"
        previousPeriod={previousPeriod}
      />
      <MetricValue
        value={city.mortgagePrice}
        change={city.mortgageGrowth}
        kind="mortgage"
        previousPeriod={previousPeriod}
      />
      <MetricValue
        value={city.ratio}
        change={city.ratioChange}
        kind="ratio"
        previousPeriod={previousPeriod}
      />
    </article>
  )
}

function Insight({ title, city, value, kind }) {
  const direction = directionFor(value)

  return (
    <div className="market-insight">
      <div
        className={`market-insight__arrow market-insight__arrow--${direction}`}
      >
        <TrendArrow direction={direction} />
      </div>
      <div>
        <span>{title}</span>
        <strong>{city?.name || '—'}</strong>
        <b>
          {formatNumber(Math.abs(value))}
          {kind === 'ratio' ? ' واحد درصد' : '٪'}
          <TrendArrow direction={direction} />
        </b>
      </div>
    </div>
  )
}

function ReportPage02({ data }) {
  const { currentPeriod, previousPeriod, publicationDate, cities, insights } =
    data
  const currentPeriodLabel = toPersianDigits(currentPeriod)
  const previousPeriodLabel = toPersianDigits(previousPeriod)

  return (
    <article
      className="report-page report-page--02"
      data-report-page="02"
      dir="rtl"
      aria-label="گزارش نبض بازار مسکن"
    >
      <div className="market-decoration market-decoration--rings" />
      <div className="market-decoration market-decoration--fade" />

      <a
        className="market-brand"
        href="https://melkradar.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="مشاهده وب‌سایت ملک‌رادار"
      >
        <img src={melkRadarLockup} alt="ملک‌رادار" />
      </a>

      <header className="market-heading">
        <h1>نبض بازار مسکن</h1>
        <p>
          مقایسه {currentPeriodLabel} با {previousPeriodLabel}
        </p>
      </header>

      <section className="market-metric-headings" aria-label="شاخص‌های گزارش">
        <span className="market-metric-headings__spacer" />
        {metricHeaders.map(({ type, title, unit }) => (
          <div
            className={`market-metric-heading market-metric-heading--${type}`}
            key={type}
          >
            <span className="market-metric-heading__icon">
              <MetricIcon type={type} />
            </span>
            <div>
              <strong>{title}</strong>
              <small>{unit}</small>
            </div>
          </div>
        ))}
      </section>

      <section className="market-city-rows" aria-label="مقایسه شهرها">
        {cities.map((city) => (
          <CityRow
            city={city}
            previousPeriod={previousPeriodLabel}
            key={city.id}
          />
        ))}
      </section>

      <section className="market-insights" aria-label="بیشترین تغییر این ماه">
        <h2>بیشترین تغییر این ماه</h2>
        <div className="market-insights__card">
          <Insight
            title="بیشترین رشد قیمت فروش"
            city={insights.saleGrowth}
            value={insights.saleGrowth?.saleGrowth}
            kind="sale"
          />
          <Insight
            title="بیشترین رشد رهن کامل"
            city={insights.mortgageGrowth}
            value={insights.mortgageGrowth?.mortgageGrowth}
            kind="mortgage"
          />
          <Insight
            title="بیشترین افت نسبت رهن به فروش"
            city={insights.ratioDecline}
            value={insights.ratioDecline?.ratioChange}
            kind="ratio"
          />
        </div>
      </section>

      <p className="market-methodology">
        <i aria-hidden="true" />
        مبنای تحلیل: آگهی‌های فروش و اجاره ثبت‌شده در {
          currentPeriodLabel
        } و {previousPeriodLabel} در دیتای ملک‌رادار.
      </p>

      <footer className="market-footer">
        <div className="market-footer__page">
          صفحه <span>۲</span> از گزارش ماهانه
        </div>
        <span className="market-footer__divider" />
        <div className="market-footer__date">
          <CalendarIcon />
          <span>تاریخ انتشار: {toPersianDigits(publicationDate)}</span>
        </div>
        <span className="market-footer__divider" />
        <a
          className="market-footer__website"
          href="https://melkradar.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GlobeIcon />
          <span>melkradar.com</span>
        </a>
        <a
          className="market-footer__brand"
          href="https://melkradar.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={footerLogo} alt="ملک رادار" />
        </a>
      </footer>
    </article>
  )
}

export default ReportPage02
