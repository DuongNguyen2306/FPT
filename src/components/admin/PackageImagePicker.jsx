import { useId, useEffect, useRef } from "react";
import { ImagePlus, X } from "lucide-react";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

/**
 * Chọn file từ máy + preview (blob URL). Không upload — parent gửi FormData khi submit.
 * @param {{
 *   label: string;
 *   required?: boolean;
 *   file?: File | null;
 *   previewUrl?: string | null;
 *   existingUrl?: string;
 *   onFileChange: (file: File | null) => void;
 *   error?: string;
 *   disabled?: boolean;
 * }} props
 */
export default function PackageImagePicker({
  label,
  required = false,
  file = null,
  previewUrl = null,
  existingUrl = "",
  onFileChange,
  error = "",
  disabled = false,
}) {
  const inputId = useId();
  const blobRef = useRef(null);

  useEffect(() => {
    return () => {
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }
    };
  }, []);

  const onPick = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = URL.createObjectURL(picked);
    onFileChange(picked);
  };

  const clearFile = () => {
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = null;
    onFileChange(null);
  };

  const showUrl = previewUrl || existingUrl;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex items-start justify-between gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
          {required ? " *" : ""}
        </label>
        {file ? (
          <button
            type="button"
            onClick={clearFile}
            disabled={disabled}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
            Bỏ ảnh mới
          </button>
        ) : null}
      </div>

      {showUrl ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <img src={showUrl} alt="" className="max-h-48 w-full object-contain" />
        </div>
      ) : (
        <div className="mt-3 flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-xs text-slate-400">
          Chưa có ảnh — chọn file từ máy
        </div>
      )}

      <div className="mt-3">
        <label
          htmlFor={inputId}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-secondary shadow-sm transition hover:bg-slate-50 ${
            disabled ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <ImagePlus className="h-4 w-4" />
          Chọn ảnh từ máy
        </label>
        <input
          id={inputId}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          disabled={disabled}
          onChange={onPick}
        />
        {file ? (
          <p className="mt-2 text-xs text-slate-500">
            Đã chọn: <span className="font-medium text-slate-700">{file.name}</span> (
            {(file.size / 1024).toFixed(0)} KB) — sẽ tải lên khi bạn lưu gói
          </p>
        ) : existingUrl ? (
          <p className="mt-2 text-xs text-slate-500">Ảnh hiện tại trên hệ thống. Chọn ảnh mới để thay thế.</p>
        ) : null}
      </div>

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
