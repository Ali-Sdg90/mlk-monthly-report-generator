function ReportPage01({ data }) {
  return (
    <article
      className="report-page report-page--01"
      data-report-page="01"
      dir="rtl"
    >
      <p>{data.greeting}</p>
    </article>
  )
}

export default ReportPage01
