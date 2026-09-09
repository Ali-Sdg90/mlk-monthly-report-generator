import { ArrowDown, ArrowUp, Lightbulb, Minus } from 'lucide-react'
import melkRadarLockup from '../assets/melkradar-lockup.webp'
import ReportFooter from '../components/ReportFooter'
import ReportMetricIcon from '../components/ReportMetricIcon'
import TehranDistrictMap from '../components/TehranDistrictMap'
import { formatPeriodLabel, toPersianDigits } from '../utils/formatPeriodLabel'

const numberFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 0,
})

const decimalFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 1,
})

const formatPrice = (value) =>
  Number.isFinite(value) ? numberFormatter.format(value / 1_000_000) : '—'

const formatRatio = (value) =>
  Number.isFinite(value) ? numberFormatter.format(value * 100) : '—'

const formatChange = (value, kind) => {
  if (!Number.isFinite(value)) return '—'

  return kind === 'ratio'
    ? decimalFormatter.format(Math.abs(value))
    : numberFormatter.format(Math.abs(value))
}

const directionFor = (value) =>
  value > 0 ? 'up' : value < 0 ? 'down' : 'neutral'

function TrendIcon({ value }) {
  const direction = directionFor(value)
  const Icon =
    direction === 'up' ? ArrowUp : direction === 'down' ? ArrowDown : Minus

  return <Icon size={13} strokeWidth={2.4} aria-hidden="true" />
}

function SummaryIcon({ type }) {
  return <ReportMetricIcon type={type} />
}

const summaryMetrics = [
  {
    type: 'sale',
    title: 'قیمت فروش',
    unit: 'تومان / مترمربع',
    valueKey: 'salePrice',
    changeKey: 'saleGrowth',
  },
  {
    type: 'mortgage',
    title: 'قیمت رهن کامل',
    unit: 'تومان / مترمربع',
    valueKey: 'mortgagePrice',
    changeKey: 'mortgageGrowth',
  },
  {
    type: 'ratio',
    title: 'نسبت رهن به فروش',
    unit: 'درصد',
    valueKey: 'ratio',
    changeKey: 'ratioChange',
  },
]

function SummaryMetric({ metric, summary, previousPeriod }) {
  const value = summary?.[metric.valueKey]
  const change = summary?.[metric.changeKey]
  const isRatio = metric.type === 'ratio'
  const direction = directionFor(change)

  return (
    <div className="tehran-summary-metric">
      <span className={`tehran-summary-metric__icon is-${metric.type}`}>
        <SummaryIcon type={metric.type} />
      </span>
      <strong>{metric.title}</strong>
      <small>({metric.unit})</small>
      <div
        className={`tehran-summary-metric__value${isRatio ? ' is-ratio' : ''}`}
      >
        <b>{isRatio ? formatRatio(value) : formatPrice(value)}</b>
        {isRatio ? <span>٪</span> : <span>میلیون تومان</span>}
      </div>
      <div className={`tehran-summary-metric__change is-${direction}`}>
        <TrendIcon value={change} />
        <b>{formatChange(change, isRatio ? 'ratio' : 'price')}</b>
        <span>{isRatio ? 'واحد درصد' : '٪'}</span>
      </div>
      <small className="tehran-summary-metric__period">
        نسبت به {previousPeriod}
      </small>
    </div>
  )
}

function ChangeCell({ value, kind }) {
  const direction = directionFor(value)

  return (
    <span className={`tehran-table-change is-${direction}`}>
      <TrendIcon value={value} />
      <b>{formatChange(value, kind)}</b>
      <small>{kind === 'ratio' ? 'واحد' : '٪'}</small>
    </span>
  )
}

function ReportPage03({ data }) {
  const currentPeriod = formatPeriodLabel(data.currentPeriod)
  const previousPeriod = formatPeriodLabel(data.previousPeriod)
  const highestSaleGrowth = data.insights.highestSaleGrowth?.districtNumber
  const highestRatios = data.insights.highestRatios.map(
    (district) => district.districtNumber,
  )

  return (
    <article
      className="report-page report-page--03"
      data-report-page="03"
      dir="rtl"
      aria-label="گزارش مناطق تهران"
    >
      <a
        className="tehran-brand"
        href="https://melkradar.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="مشاهده وب‌سایت ملک‌رادار"
      >
        <img src={melkRadarLockup} alt="ملک‌رادار" />
      </a>

      <p className="tehran-kicker">
        گزارش ماهانه بازار مسکن <i /> {currentPeriod}
      </p>

      <header className="tehran-heading">
        <h1>تهران</h1>
        <strong>بررسی مناطق ۲۲ گانه</strong>
        <p>
          مقایسه {currentPeriod} با {previousPeriod}
        </p>
      </header>

      <div className="tehran-map-wrap">
        <TehranDistrictMap />
      </div>

      <section className="tehran-summary" aria-label="خلاصه تهران">
        <h2>خلاصه تهران</h2>
        <div className="tehran-summary__metrics">
          {summaryMetrics.map((metric) => (
            <SummaryMetric
              key={metric.type}
              metric={metric}
              summary={data.summary}
              previousPeriod={previousPeriod}
            />
          ))}
        </div>
      </section>

      <section className="tehran-districts" aria-label="جدول مناطق تهران">
        <table>
          <thead>
            <tr className="tehran-table-groups">
              <th rowSpan="2">
                <span className="tehran-district-heading">منطقه</span>
              </th>
              <th colSpan="3">
                قیمت فروش <small>(تومان / مترمربع)</small>
              </th>
              <th colSpan="3">
                قیمت رهن کامل <small>(تومان / مترمربع)</small>
              </th>
              <th colSpan="3">
                نسبت رهن به فروش <small>(درصد)</small>
              </th>
            </tr>
            <tr className="tehran-table-periods">
              <th>{currentPeriod}</th>
              <th>{previousPeriod}</th>
              <th>تغییر</th>
              <th>{currentPeriod}</th>
              <th>{previousPeriod}</th>
              <th>تغییر</th>
              <th>{currentPeriod}</th>
              <th>{previousPeriod}</th>
              <th>تغییر</th>
            </tr>
          </thead>
          <tbody>
            {data.districts.map((district) => (
              <tr key={district.districtNumber}>
                <th>منطقه {toPersianDigits(district.districtNumber)}</th>
                <td>{formatPrice(district.currentSalePrice)}</td>
                <td>{formatPrice(district.previousSalePrice)}</td>
                <td>
                  <ChangeCell value={district.saleGrowth} kind="price" />
                </td>
                <td>{formatPrice(district.currentMortgagePrice)}</td>
                <td>{formatPrice(district.previousMortgagePrice)}</td>
                <td>
                  <ChangeCell value={district.mortgageGrowth} kind="price" />
                </td>
                <td>{formatRatio(district.currentRatio)}</td>
                <td>{formatRatio(district.previousRatio)}</td>
                <td>
                  <ChangeCell value={district.ratioChange} kind="ratio" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="tehran-analysis" aria-label="مبنای تحلیل و نتیجه">
        <div className="tehran-analysis__method">
          <strong>مبنای تحلیل:</strong>
          <span>آگهی‌های فروش و اجاره ثبت‌شده</span>
          <span>
            در {currentPeriod} و {previousPeriod} در دیتای ملک‌رادار.
          </span>
        </div>
        <div className="tehran-analysis__insight">
          <Lightbulb size={31} strokeWidth={1.5} aria-hidden="true" />
          <p>
            منطقه {toPersianDigits(highestSaleGrowth)} بیشترین رشد قیمت فروش و
            مناطق {highestRatios.map(toPersianDigits).join(' و ')} بیشترین نسبت
            رهن به فروش را در {currentPeriod} تجربه کرده‌اند.
          </p>
        </div>
      </section>

      <ReportFooter pageNumber={3} publicationDate={data.publicationDate} />
    </article>
  )
}

export default ReportPage03
