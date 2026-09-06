import { useState } from 'react'
import ReportPreview from '../../report-preview/components/ReportPreview'
import { createReportData } from '../../report-preview/services/createReportData'
import ReportUploadPanel from '../../report-upload/components/ReportUploadPanel'
import { useReportUploads } from '../../report-upload/hooks/useReportUploads'

const steps = {
  upload: 'upload',
  preview: 'preview',
}

function ReportWorkflow() {
  const [step, setStep] = useState(steps.upload)
  const [reportData, setReportData] = useState(null)
  const uploadState = useReportUploads()

  const handleGenerate = () => {
    if (!uploadState.allFilesAreValid) return

    setReportData(createReportData())
    setStep(steps.preview)
  }

  if (step === steps.preview && reportData) {
    return (
      <ReportPreview report={reportData} onBack={() => setStep(steps.upload)} />
    )
  }

  return <ReportUploadPanel {...uploadState} onGenerate={handleGenerate} />
}

export default ReportWorkflow
