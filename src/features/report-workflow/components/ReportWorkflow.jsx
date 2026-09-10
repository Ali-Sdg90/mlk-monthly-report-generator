import { LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
  generating: 'generating',
  preview: 'preview',
}

const REPORT_GENERATION_DELAY_MS = 4_000

const getErrorMessage = (error) =>
  error instanceof Error ? error.message : 'An unexpected error occurred.'

function ReportWorkflow() {
  const [step, setStep] = useState(
    USE_SAMPLE_DATA_ON_STARTUP ? steps.loading : steps.upload,
  )
  const [reportData, setReportData] = useState(null)
  const [sampleError, setSampleError] = useState('')
  const generationTimer = useRef(null)
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

  useEffect(() => {
    if (step !== steps.generating && step !== steps.preview) return

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [step])

  useEffect(
    () => () => {
      if (generationTimer.current !== null) {
        window.clearTimeout(generationTimer.current)
      }
    },
    [],
  )

  const handleGenerate = () => {
    if (!uploadState.allFilesAreValid) return

    const nextReportData = createReportData({
      cities: uploadState.uploads.cities.result.data,
      zones: uploadState.uploads.zones.result.data,
    })

    setReportData(nextReportData)
    setStep(steps.generating)

    generationTimer.current = window.setTimeout(() => {
      generationTimer.current = null
      setStep(steps.preview)
    }, REPORT_GENERATION_DELAY_MS)
  }

  const handleReportTitleChange = (title) => {
    setReportData((currentReport) =>
      currentReport
        ? {
            ...currentReport,
            cover: {
              ...currentReport.cover,
              title,
            },
          }
        : currentReport,
    )
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

  if (step === steps.generating) {
    return (
      <section className="workflow-state" aria-live="polite">
        <LoaderCircle className="workflow-state__spinner" aria-hidden="true" />
        <div>
          <h2>Generating report</h2>
          <p>This can take up to 6 seconds.</p>
        </div>
      </section>
    )
  }

  if (step === steps.preview && reportData) {
    return (
      <ReportPreview
        report={reportData}
        onBack={() => setStep(steps.upload)}
        onTitleChange={handleReportTitleChange}
      />
    )
  }

  return <ReportUploadPanel {...uploadState} onGenerate={handleGenerate} />
}

export default ReportWorkflow
