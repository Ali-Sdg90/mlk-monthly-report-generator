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
]

function ReportDocument({ report }) {
  return (
    <div className="report-preview__pages">
      {pageDefinitions.map(({ id, Component, selectData }) => (
        <ReportPagePreview key={id}>
          <Component data={selectData?.(report)} />
        </ReportPagePreview>
      ))}
      {report.regionDetails.map((region, index) => {
        const pageNumber = index + 3

        return (
          <ReportPagePreview key={region.id}>
            <ReportPage03 data={region} pageNumber={pageNumber} />
          </ReportPagePreview>
        )
      })}
    </div>
  )
}

export default ReportDocument
