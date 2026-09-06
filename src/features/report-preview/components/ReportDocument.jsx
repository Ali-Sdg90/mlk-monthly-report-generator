import ReportPage01 from '../pages/ReportPage01'
import ReportPagePreview from './ReportPagePreview'

const pageDefinitions = [
  {
    id: '01',
    Component: ReportPage01,
    selectData: (report) => report.cover,
  },
]

function ReportDocument({ report }) {
  return (
    <div className="report-preview__pages">
      {pageDefinitions.map(({ id, Component, selectData }) => (
        <ReportPagePreview key={id}>
          <Component data={selectData(report)} />
        </ReportPagePreview>
      ))}
    </div>
  )
}

export default ReportDocument
