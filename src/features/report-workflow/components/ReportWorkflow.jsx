import { useEffect, useState } from 'react'
import ReportPreview from '../../report-preview/components/ReportPreview'
import { createReportData } from '../../report-preview/services/createReportData'
import ReportUploadPanel from '../../report-upload/components/ReportUploadPanel'
import { useReportUploads } from '../../report-upload/hooks/useReportUploads'
import { USE_SAMPLE_DATA_ON_STARTUP } from '../config/reportWorkflowConfig'
import { loadSampleReportData } from '../services/loadSampleReportData'
import SampleDataState from './SampleDataState'

const steps = {
  loading: 'loading',
  upload: 'upload',
  preview: 'preview',
}

const getErrorMessage = (error) =>
  error instanceof Error ? error.message : 'An unexpected error occurred.'

function ReportWorkflow() {
  const [step, setStep] = useState(
    USE_SAMPLE_DATA_ON_STARTUP ? steps.loading : steps.upload,
  )
  const [reportData, setReportData] = useState(null)
  const [sampleError, setSampleError] = useState('')
  const uploadState = useReportUploads()

  const retrySampleReport = async () => {
    setStep(steps.loading)
    setSampleError('')

    try {
      setReportData(await loadSampleReportData())
      setStep(steps.preview)
    } catch (error) {
      setSampleError(getErrorMessage(error))
    }
  }

  useEffect(() => {
    if (!USE_SAMPLE_DATA_ON_STARTUP) return undefined

    const controller = new AbortController()
    loadSampleReportData(controller.signal)
      .then((nextReportData) => {
        if (controller.signal.aborted) return

        setReportData(nextReportData)
        setStep(steps.preview)
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setSampleError(getErrorMessage(error))
        }
      })

    return () => controller.abort()
  }, [])

  const handleGenerate = () => {
    if (!uploadState.allFilesAreValid) return

    setReportData(
      createReportData({
        cities: uploadState.uploads.cities.result.data,
        tehran: uploadState.uploads.tehran.result.data,
      }),
    )
    setStep(steps.preview)
  }

  if (step === steps.loading) {
    return (
      <SampleDataState
        error={sampleError}
        onRetry={retrySampleReport}
        onUseUploads={() => setStep(steps.upload)}
      />
    )
  }

  if (step === steps.preview && reportData) {
    return (
      <ReportPreview report={reportData} onBack={() => setStep(steps.upload)} />
    )
  }

  return <ReportUploadPanel {...uploadState} onGenerate={handleGenerate} />
}

export default ReportWorkflow
