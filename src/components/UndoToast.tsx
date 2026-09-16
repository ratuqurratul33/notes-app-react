interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}

function UndoToast({ message, onUndo, onDismiss }: UndoToastProps) {
  return (
    <div className="undo-toast" role="status" data-testid="undo-toast">
      <span>{message}</span>
      <button type="button" onClick={onUndo} data-testid="undo-toast-button">
        Urungkan
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className="undo-toast__close"
      >
        ×
      </button>
    </div>
  );
}

export default UndoToast;