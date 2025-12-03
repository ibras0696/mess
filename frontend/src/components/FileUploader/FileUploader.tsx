import { useState } from 'react'
import { AttachmentsApi } from '../../api/generated'
import { useApiClients } from '../../hooks/useApiClients'

export type UploadedAttachment = {
  objectKey: string
  fileName: string
  contentType: string
  sizeBytes?: number | null
  url?: string
}

type FileUploaderProps = {
  onAttached: (attachment: UploadedAttachment) => void
  disabled?: boolean
}

export const FileUploader = ({ onAttached, disabled }: FileUploaderProps) => {
  const { attachmentsApi } = useApiClients()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const presign = await attachmentsApi.presignUploadApiAttachmentsPresignPost({
        presignRequest: {
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
          sizeBytes: file.size,
        },
      })

      const res = await fetch(presign.url, {
        method: presign.method ?? 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      })

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`)
      }

      onAttached({
        objectKey: presign.objectKey,
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        url: presign.url, // presign URL (expires) — можно заменить на get URL позже
      })
    } catch (err) {
      setError('Не удалось загрузить файл. Попробуйте позже.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:border-sky-400/40">
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ''
          }}
          disabled={uploading || disabled}
        />
        <span>{uploading ? 'Загрузка...' : 'Прикрепить файл'}</span>
      </label>
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  )
}
