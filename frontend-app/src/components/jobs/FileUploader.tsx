import React, { useRef, useState, DragEvent } from 'react'
import { JobAttachmentDto } from '../../services/jobService'

interface Props {
  draftToken: string | null
  initialAttachments?: JobAttachmentDto[]
  uploadAttachments: (files: File[]) => Promise<JobAttachmentDto[]>
  onUploadComplete: (files: JobAttachmentDto[]) => void
}

const FileUploader: React.FC<Props> = ({ uploadAttachments, onUploadComplete }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previews, setPreviews] = useState<{ url: string; type: string }[]>([])
  const [dragging, setDragging] = useState(false)

  const handleUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return

    const selectedFiles = Array.from(files)

    // 🔧 Fix: capture both URL and MIME type
    const previewData = selectedFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type
    }))
    setPreviews(previewData)

    try {
      setUploading(true)
      setError(null)
      const uploaded = await uploadAttachments(selectedFiles)
      onUploadComplete(uploaded)
    } catch (err: any) {
      console.error(err)
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleUpload(e.target.files)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files) handleUpload(e.dataTransfer.files)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Upload Files (photos, documents, or video)</label>
      <div
        onDragOver={e => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${
          dragging ? 'border-primary bg-blue-50' : 'border-gray-300'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        Drag & drop files here, or click to select
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2 flex-wrap mt-2">
        {previews.map((preview, idx) => (
          <div key={idx} className="w-20 h-20">
            {preview.type.startsWith('image/') ? (
              <img
                src={preview.url}
                alt={`preview-${idx}`}
                className="w-full h-full object-cover border rounded"
              />
            ) : preview.type.startsWith('video/') ? (
              <video controls className="w-full h-full object-cover border rounded">
                <source src={preview.url} type={preview.type} />
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center border rounded bg-gray-100 text-xs text-gray-600">
                File
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileUploader
