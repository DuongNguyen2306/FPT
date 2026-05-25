import { useId, useState } from "react";
import { ImagePlus, Link2, Loader2 } from "lucide-react";
import {
  uploadAdminImage,
  uploadAdminImageFromUrl,
} from "../api/adminUploads.js";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const MAX_BYTES = 5 * 1024 * 1024;

function getApiError(err) {
  const msg = err?.response?.data?.message ?? err?.message;
  return typeof msg === "string" ? msg : "Upload thất bại.";
}

/**
 * @param {{
 *   label: string;
 *   value: string;
 *   onChange: (url: string) => void;
 *   folder?: string;
 *   required?: boolean;
 * }} props
 */
export default function ImageUploader({
  label,
  value,
  onChange,
  folder = "packages/heroes",
  required = false,
}) {
  const inputId = useId();
  const [pasteUrl, setPasteUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const runUpload = async (promise) => {
    setUploading(true);
    setError("");
    try {
      const data = await promise;
      if (data?.url) onChange(data.url);
      else setError("Không nhận được URL từ server.");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setUploading(false);
    }
  };

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError("Ảnh tối đa 5MB (JPEG, PNG, WebP, GIF).");
      return;
    }
    runUpload(uploadAdminImage(file, folder));
  };

  const onImportUrl = () => {
    const url = pasteUrl.trim();
    if (!url) {
      setError("Nhập URL ảnh cần đưa lên Cloudinary.");
      return;
    }
    runUpload(uploadAdminImageFromUrl({ url, folder }));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
          {required ? " *" : ""}
        </label>
        {uploading ? (
          <span className="inline-flex items-center gap-1 text-xs text-secondary">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Đang tải lên…
          </span>
        ) : null}
      </div>

      {value ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <img src={value} alt="" className="max-h-40 w-full object-contain" />
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ImagePlus className="h-4 w-4" />
          Chọn file
        </label>
        <input
          id={inputId}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          disabled={uploading}
          onChange={onPickFile}
        />
      </div>

      <input
        type="url"
        readOnly
        value={value}
        placeholder="URL Cloudinary (sau khi upload)"
        className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
        required={required}
      />

      <div className="mt-3 flex gap-2">
        <input
          type="url"
          value={pasteUrl}
          onChange={(e) => setPasteUrl(e.target.value)}
          placeholder="Dán URL ảnh nguồn…"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          disabled={uploading}
        />
        <button
          type="button"
          onClick={onImportUrl}
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-60"
        >
          <Link2 className="h-4 w-4" />
          Cloudinary
        </button>
      </div>

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
