import React from 'react'
import { Button } from './Button'

interface DeleteContactModalProps {
  contactName: string
  onConfirm: () => void
  onCancel: () => void
}

const DeleteContactModal: React.FC<DeleteContactModalProps> = ({
  contactName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-red-600">Delete Contact?</h2>
        <p className="mt-2 text-sm text-gray-700">
          Are you sure you want to delete <strong>{contactName}</strong>? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteContactModal
