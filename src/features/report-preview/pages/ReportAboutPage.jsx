import ReportFooter from '../components/ReportFooter'
import { formatPeriodLabel } from '../utils/formatPeriodLabel'

function ReportAboutPage({ data }) {
  const currentPeriod = formatPeriodLabel(data.currentPeriod)
  const previousPeriod = formatPeriodLabel(data.previousPeriod)

  return (
    <article
      className="report-page report-page--about"
      data-report-page="02"
      dir="rtl"
      aria-label="درباره این گزارش"
    >
      <div
        className="about-decoration about-decoration--dots"
        aria-hidden="true"
      />
      <div
        className="about-decoration about-decoration--rings"
        aria-hidden="true"
      />
      <div
        className="about-decoration about-decoration--lines"
        aria-hidden="true"
      />

      <header className="about-heading">
        <span className="about-heading__rule" aria-hidden="true" />
        <h1>درباره این گزارش</h1>
      </header>

      <div className="about-content">
        <p className="about-content__intro">
          <strong>«ملک‌رادار»</strong> موتور جست‌وجوی آگهی‌های خرید، فروش، رهن و
          اجاره در حوزه‌های مسکونی (آپارتمان، خانه، ویلا، زمین، کلنگی و مستغلات)
          و اداری-تجاری (اداری، مغازه، واحد تجاری، انبار، زمین زراعی و باغ) است
          که آگهی‌های ملکی را از منابع مختلف جمع‌آوری و در اختیار عموم قرار
          می‌دهد.
        </p>

        <p>
          آنچه در ادامه می‌بینید، تحلیلی از آگهی‌های ملکی ثبت‌شده در{' '}
          <strong>{currentPeriod}</strong> و مقایسه آن با{' '}
          <strong>{previousPeriod}</strong> است. مقایسه یک ماه با ماه مشابه در
          سال قبل، تصویری کلی از روند تغییرات بازار مسکن طی یک سال گذشته ارائه
          می‌دهد.
        </p>

        <p>
          در این گزارش، سه شاخص کلان{' '}
          <strong>قیمت متری فروش، قیمت متری رهن کامل و نسبت رهن به فروش</strong>{' '}
          برای ملک‌های <strong>آپارتمانی</strong> برای مناطق شهری در ۱۰ استان
          کشور شامل{' '}
          <strong>
            تهران، البرز، خراسان رضوی، خراسان جنوبی، خراسان شمالی، گلستان،
            مازندران، گیلان، فارس و اصفهان
          </strong>{' '}
          ارائه شده است.
        </p>

        <p>
          داده‌های این شاخص‌ها در سطح <strong>محله</strong> نیز در پایگاه داده
          ملک‌رادار موجود است و فعالان بازار می‌توانند در صورت نیاز به داده‌های
          جزئی‌تر، متناسب با محدوده فعالیت خود، با ملک‌رادار در ارتباط باشند.
        </p>

        <p>
          این گزارش بر پایه <strong>صدها هزار رکورد آگهی ملکی</strong> ثبت‌شده
          در ماه‌های مورد بررسی تهیه شده و به‌صورت رایگان منتشر می‌شود. هدف از
          انتشار آن، فراهم کردن دسترسی گسترده‌تر به داده‌های بازار و کمک به{' '}
          <strong>تحلیل و درک بهتر روندهای بازار مسکن</strong> است.
        </p>

        <p className="about-content__signature">
          ملک‌رادار، موتور جستجوی املاک ایران
        </p>
      </div>

      <ReportFooter pageNumber={2} publicationDate={data.publicationDate} />
    </article>
  )
}

export default ReportAboutPage
