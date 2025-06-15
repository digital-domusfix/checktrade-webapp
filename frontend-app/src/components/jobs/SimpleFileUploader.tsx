import React from 'react'

type SimpleFileUploaderProps = {
  files: File[]
  setFiles: (files: File[]) => void
  maxFiles?: number
}

const SimpleFileUploader: React.FC<SimpleFileUploaderProps> = ({ files, setFiles, maxFiles = 5 }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).filter(f => f.type.startsWith('image/'))
    const total = [...files, ...selected].slice(0, maxFiles)
    setFiles(total)
  }

  const removeFile = (index: number) => {
    const updated = [...files]
    updated.splice(index, 1)
    setFiles(updated)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Upload Photos (max {maxFiles})</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full rounded border p-2"
      />
      <p className="text-xs text-gray-500">{files.length}/{maxFiles} uploaded</p>

      <div className="grid grid-cols-3 gap-2">
        {files.map((file, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              className="h-24 w-full object-cover rounded border"
            />
            <button
              onClick={() => removeFile(index)}
              className="absolute top-1 right-1 rounded bg-red-600 px-1 text-xs text-white opacity-75 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {files.length >= maxFiles && (
        <p className="text-xs text-red-500">You can upload up to {maxFiles} files only.</p>
      )}
    </div>
  )
}

export default SimpleFileUploader
