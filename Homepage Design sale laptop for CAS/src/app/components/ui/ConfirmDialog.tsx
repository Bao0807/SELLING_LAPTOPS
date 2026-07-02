type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <h3 className="mb-2 text-base font-semibold text-slate-900">{title}</h3>
        <p className="mb-5 text-sm leading-relaxed text-slate-500">{description}</p>
        <div className="flex justify-end gap-2">
          <button disabled={loading} onClick={onClose} className="rounded-md border px-3 py-2 text-sm disabled:opacity-60">
            {cancelLabel}
          </button>
          <button disabled={loading} onClick={onConfirm} className="rounded-md bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-60">
            {loading ? "Đang xử lý..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
