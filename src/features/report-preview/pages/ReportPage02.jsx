import melkRadarLockup from '../assets/melkradar-lockup.webp'
import ReportFooter from '../components/ReportFooter'
import ReportMetricIcon from '../components/ReportMetricIcon'
import { formatPeriodLabel } from '../utils/formatPeriodLabel'

const numberFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 0,
})

const percentagePointFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 1,
})

const formatNumber = (value) =>
  Number.isFinite(value) ? numberFormatter.format(Math.round(value)) : '—'

const formatChange = (value, kind) => {
  if (!Number.isFinite(value)) return '—'

  const absoluteValue = Math.abs(value)

  return kind === 'ratio'
    ? percentagePointFormatter.format(absoluteValue)
    : formatNumber(absoluteValue)
}

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
  const formattedValue = formatChange(value, kind)

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
        <strong className={kind === 'ratio' ? 'is-ratio' : undefined}>
          {kind === 'ratio' ? (
            <>
              <bdi>{formatRatio(value)}</bdi>
              <span>٪</span>
            </>
          ) : (
            formatPrice(value)
          )}
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
    <div className={`market-insight market-insight--${direction}`}>
      <div
        className={`market-insight__arrow market-insight__arrow--${direction}`}
      >
        <TrendArrow direction={direction} />
      </div>
      <div>
        <span>{title}</span>
        <strong>{city?.name || '—'}</strong>
        <b>
          {formatChange(value, kind)}
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
  const currentPeriodLabel = formatPeriodLabel(currentPeriod)
  const previousPeriodLabel = formatPeriodLabel(previousPeriod)

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
              <ReportMetricIcon type={type} />
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

      <ReportFooter pageNumber={2} publicationDate={publicationDate} />
    </article>
  )
}

export default ReportPage02
