import { useCallback, useMemo, useRef, useState } from 'react'
import { uploadDefinitions } from '../config/uploadDefinitions'
import { validateWorkbook } from '../services/workbookValidation'

const createEmptyUpload = () => ({
  file: null,
  result: null,
  status: 'idle',
})

const createInitialUploads = () =>
  Object.fromEntries(
    Object.keys(uploadDefinitions).map((kind) => [kind, createEmptyUpload()]),
  )

export function useReportUploads() {
  const [uploads, setUploads] = useState(createInitialUploads)
  const activeRequests = useRef({})

  const updateUpload = useCallback((kind, nextValue) => {
    setUploads((current) => ({ ...current, [kind]: nextValue }))
  }, [])

  const handleFile = useCallback(
    async (kind, file) => {
      if (!file) {
        activeRequests.current[kind] = null
        updateUpload(kind, createEmptyUpload())
        return
      }

      const request = Symbol(kind)
      activeRequests.current[kind] = request
      updateUpload(kind, { file, result: null, status: 'checking' })

      const result = await validateWorkbook(file, kind)
      if (activeRequests.current[kind] !== request) return

      updateUpload(kind, {
        file,
        result,
        status: result.valid ? 'valid' : 'invalid',
      })
    },
    [updateUpload],
  )

  const summary = useMemo(() => {
    const values = Object.values(uploads)
    const validFileCount = values.filter(
      (upload) => upload.status === 'valid',
    ).length

    return {
      allFilesAreValid: validFileCount === values.length,
      validFileCount,
    }
  }, [uploads])

  return {
    uploads,
    handleFile,
    ...summary,
  }
}
