import ReportPage01 from '../pages/ReportPage01'
import ReportPage02 from '../pages/ReportPage02'
import ReportPage03 from '../pages/ReportPage03'
import ReportPagePreview from './ReportPagePreview'

const pageDefinitions = [
  {
    id: '01',
    Component: ReportPage01,
    selectData: (report) => report.cover,
  },
  {
    id: '02',
    Component: ReportPage02,
    selectData: (report) => report.citiesSummary,
  },
  {
    id: '03',
    Component: ReportPage03,
    selectData: (report) => report.tehranDetails,
  },
]

function ReportDocument({ report }) {
  return (
    <div className="report-preview__pages">
      {pageDefinitions.map(({ id, Component, selectData }) => (
        <ReportPagePreview key={id}>
          <Component data={selectData?.(report)} />
        </ReportPagePreview>
      ))}
    </div>
  )
}

export default ReportDocument
