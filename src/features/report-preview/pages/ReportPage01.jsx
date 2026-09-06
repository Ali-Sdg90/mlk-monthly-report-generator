import { forwardRef } from 'react'

const ReportPage01 = forwardRef(function ReportPage01({ data }, ref) {
  return (
    <article
      className="report-page report-page--01"
      data-report-page="01"
      dir="rtl"
      ref={ref}
    >
      <p>{data.greeting}</p>
    </article>
  )
})

export default ReportPage01
