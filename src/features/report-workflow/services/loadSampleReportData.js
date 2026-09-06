import { createReportData } from '../../report-preview/services/createReportData'
import { validateWorkbook } from '../../report-upload/services/workbookValidation'
import { sampleWorkbookSources } from '../config/sampleWorkbookSources'

const XLSX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

const loadWorkbookFile = async ({ fileName, url }, signal) => {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Could not load ${fileName}.`)

  return new File([await response.arrayBuffer()], fileName, {
    type: XLSX_MIME_TYPE,
  })
}

const loadDataset = async (kind, signal) => {
  const file = await loadWorkbookFile(sampleWorkbookSources[kind], signal)
  const result = await validateWorkbook(file, kind)

  if (!result.valid || !result.data) {
    throw new Error(result.error || `The ${kind} sample workbook is invalid.`)
  }

  return result.data
}

export async function loadSampleReportData(signal) {
  const [cities, tehran] = await Promise.all([
    loadDataset('cities', signal),
    loadDataset('tehran', signal),
  ])

  return createReportData({ cities, tehran })
}
