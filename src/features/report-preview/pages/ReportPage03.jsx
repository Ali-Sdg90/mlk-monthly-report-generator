import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import insightLight from '../assets/light-page2.webp'
import melkRadarLockup from '../assets/melkradar-lockup.webp'
import RegionScopeGraphic from '../components/RegionScopeGraphic'
import ReportFooter from '../components/ReportFooter'
import ReportMetricIcon from '../components/ReportMetricIcon'
import TehranDistrictMap from '../components/TehranDistrictMap'
import { formatPeriodLabel, toPersianDigits } from '../utils/formatPeriodLabel'
import {
  directionFor,
  formatChange,
  formatPrice,
  formatRatio,
} from '../utils/formatRegionMetrics'

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
  if (!Number.isFinite(value)) {
    return (
      <span className="tehran-table-change is-neutral">
        <b className="tehran-table-number">—</b>
      </span>
    )
  }

  const direction = directionFor(value)

  return (
    <span className={`tehran-table-change is-${direction}`}>
      <TrendIcon value={value} />
      <b className="tehran-table-number">{formatChange(value, kind)}</b>
      <small>{kind === 'ratio' ? 'واحد' : '٪'}</small>
    </span>
  )
}

const getRegionLabel = (region) =>
  region?.districtNumber
    ? `منطقه ${toPersianDigits(region.districtNumber)}`
    : region?.name

const getRegionListLabel = (regions) => {
  if (regions.length === 0) return null
  if (regions.length === 1) return getRegionLabel(regions[0])

  const districts = regions.filter((region) => region.districtNumber)
  const otherRegions = regions.filter((region) => !region.districtNumber)
  const districtLabel =
    districts.length > 1
      ? `مناطق ${districts
          .map((region) => toPersianDigits(region.districtNumber))
          .join(' و ')}`
      : districts.length === 1
        ? getRegionLabel(districts[0])
        : null

  return [districtLabel, ...otherRegions.map(getRegionLabel)]
    .filter(Boolean)
    .join(' و ')
}

function ReportPage03({ data, pageNumber = 3 }) {
  const currentPeriod = formatPeriodLabel(data.currentPeriod)
  const previousPeriod = formatPeriodLabel(data.previousPeriod)
  const highestSaleGrowth = getRegionListLabel(data.insights.highestSaleGrowth)
  const highestRatios = getRegionListLabel(data.insights.highestRatios)
  const insightParts = [
    highestSaleGrowth && `${highestSaleGrowth} بیشترین رشد قیمت فروش`,
    highestRatios && `${highestRatios} بیشترین نسبت رهن به فروش`,
  ].filter(Boolean)
  const insightRegionCount = new Set([
    ...data.insights.highestSaleGrowth,
    ...data.insights.highestRatios,
  ]).size
  const insightVerb =
    insightRegionCount === 1 ? 'تجربه کرده است' : 'تجربه کرده‌اند'
  const tableRows = [
    ...data.districts.map((district) => ({
      ...district,
      key: `district-${district.districtNumber}`,
      label: `منطقه ${toPersianDigits(district.districtNumber)}`,
    })),
    ...(data.otherRegions ?? []).map((region) => ({
      ...region,
      key: `region-${region.name}`,
      label: region.name,
    })),
  ]
  const highestDistrictNumber = data.districts.at(-1)?.districtNumber
  const regionLabel = data.districts.length > 0 ? 'منطقه' : 'استان'
  const scopeText =
    data.districts.length > 0
      ? `${toPersianDigits(data.districts.length)} منطقه${
          data.otherRegions.length > 0
            ? ` و ${toPersianDigits(data.otherRegions.length)} ناحیه`
            : ''
        }`
      : `${toPersianDigits(data.otherRegions.length)} استان`
  const scopeLabel = highestDistrictNumber
    ? `بررسی مناطق ${toPersianDigits(highestDistrictNumber)} گانه`
    : 'بررسی استان‌های شمالی'
  const isTehran = data.id === 'tehran'
  const pageId = String(pageNumber).padStart(2, '0')

  return (
    <article
      className="report-page report-page--03"
      data-report-page={pageId}
      dir="rtl"
      aria-label={`گزارش مناطق ${data.title}`}
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

      <header
        className={`tehran-heading${data.id === 'north' ? ' is-long' : ''}`}
      >
        <h1>{data.title}</h1>
        <strong>{scopeLabel}</strong>
        <p>
          مقایسه {currentPeriod} با {previousPeriod}
        </p>
      </header>

      <div
        className={
          isTehran
            ? 'tehran-map-wrap'
            : `region-map-wrap region-map-wrap--${data.id}`
        }
      >
        {isTehran ? (
          <TehranDistrictMap />
        ) : (
          <RegionScopeGraphic
            regionId={data.id}
            title={data.title}
            scopeText={scopeText}
          />
        )}
      </div>

      <section className="tehran-summary" aria-label={`خلاصه ${data.title}`}>
        <h2 className={data.id === 'north' ? 'is-long' : undefined}>
          خلاصه {data.title}
        </h2>
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

      <section
        className={`tehran-districts${tableRows.length < 20 ? ' is-short' : ''}`}
        aria-label={`جدول مناطق و نواحی ${data.title}`}
        style={{ '--region-row-count': tableRows.length }}
      >
        <table>
          <thead>
            <tr className="tehran-table-groups">
              <th rowSpan="2">
                <span className="tehran-district-heading">{regionLabel}</span>
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
            {tableRows.map((region) => (
              <tr key={region.key}>
                <th>{region.label}</th>
                <td>
                  <span className="tehran-table-number">
                    {formatPrice(region.currentSalePrice)}
                  </span>
                </td>
                <td>
                  <span className="tehran-table-number">
                    {formatPrice(region.previousSalePrice)}
                  </span>
                </td>
                <td>
                  <ChangeCell value={region.saleGrowth} kind="price" />
                </td>
                <td>
                  <span className="tehran-table-number">
                    {formatPrice(region.currentMortgagePrice)}
                  </span>
                </td>
                <td>
                  <span className="tehran-table-number">
                    {formatPrice(region.previousMortgagePrice)}
                  </span>
                </td>
                <td>
                  <ChangeCell value={region.mortgageGrowth} kind="price" />
                </td>
                <td>
                  <span className="tehran-table-number">
                    {formatRatio(region.currentRatio)}
                  </span>
                </td>
                <td>
                  <span className="tehran-table-number">
                    {formatRatio(region.previousRatio)}
                  </span>
                </td>
                <td>
                  <ChangeCell value={region.ratioChange} kind="ratio" />
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
            در {currentPeriod} و {previousPeriod} براساس دیتای ملک‌رادار.
          </span>
        </div>
        <div className="tehran-analysis__insight">
          <img
            className="tehran-analysis__light"
            src={insightLight}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          <p>
            {insightParts.length > 0
              ? `${insightParts.join(' و ')} را در ${currentPeriod} ${insightVerb}.`
              : `داده‌ای برای تعیین بیشترین رشد قیمت فروش و نسبت رهن به فروش در ${currentPeriod} موجود نیست.`}
          </p>
        </div>
      </section>

      <ReportFooter
        pageNumber={pageNumber}
        publicationDate={data.publicationDate}
      />
    </article>
  )
}

export default ReportPage03
