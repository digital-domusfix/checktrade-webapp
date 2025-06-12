import { Button } from './Button';
import Modal from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!open) return null;
  return (
    <Modal onClose={onCancel}>
      <p className="mb-4 text-sm text-gray-700">{message}</p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Keep Editing
        </Button>
        <Button type="button" onClick={onConfirm}>
          Discard
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
