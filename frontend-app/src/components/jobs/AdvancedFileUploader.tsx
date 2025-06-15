// src/components/jobs/AdvancedFileUploader.tsx
import React, { useRef } from 'react'

type AdvancedFileUploaderProps = {
  maxFiles?: number
  files: File[]
  previews: string[]
  onChange: (files: File[], previews: string[]) => void
}

const AdvancedFileUploader: React.FC<AdvancedFileUploaderProps> = ({
  maxFiles = 5,
  files,
  previews,
  onChange,
}) => {
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    await handleFiles(dropped)
  }

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).filter(f => f.type.startsWith('image/'))
    await handleFiles(selected)
  }

  const handleFiles = async (newFiles: File[]) => {
    const total = [...files, ...newFiles].slice(0, maxFiles)
    const previews = total.map(f => URL.createObjectURL(f))
    onChange(total, previews)
  }

  const removeFile = (index: number) => {
    const updatedFiles = [...files]
    const updatedPreviews = [...previews]
    updatedFiles.splice(index, 1)
    updatedPreviews.splice(index, 1)
    onChange(updatedFiles, updatedPreviews)
  }

  return (
    <div
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      className="rounded border border-dashed border-gray-400 p-4 text-center"
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleSelect}
      />
      <p className="text-sm text-gray-700">
  {isTouchDevice() ? (
    <>
      Tap to{' '}
      <button
        type="button"
        className="text-primary underline"
        onClick={() => fileInputRef.current?.click()}
      >
        select photos
      </button>
    </>
  ) : (
    <>
      Drag & drop images here or{' '}
      <button
        type="button"
        className="text-primary underline"
        onClick={() => fileInputRef.current?.click()}
      >
        browse
      </button>
    </>
  )}
</p>
      <p className="text-xs text-gray-500">{files.length}/{maxFiles} uploaded</p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {previews.map((preview, idx) => (
          <div key={idx} className="relative group">
            <img src={preview} alt="Preview" className="h-24 w-full object-cover rounded border" />
            <button
              onClick={() => removeFile(idx)}
              className="absolute top-1 right-1 rounded bg-red-600 px-1 text-xs text-white opacity-80 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {files.length >= maxFiles && (
        <p className="text-xs text-red-500 mt-1">You can upload up to {maxFiles} files only.</p>
      )}
    </div>
  )
}

export default AdvancedFileUploader
