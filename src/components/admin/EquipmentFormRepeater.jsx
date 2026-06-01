import { useState } from "react";
import { ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { uploadAdminImage } from "../../api/adminUploads.js";
import { validateImageFile } from "../../lib/packageFormValidate.js";

const EQUIPMENT_FOLDER = "telecom-packages/equipment";

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20";

const EMPTY_ROW = { label: "", imageUrl: "" };

/**
 * @param {{
 *   items: import('../../types/admin').EquipmentFormItem[];
 *   onChange: (items: import('../../types/admin').EquipmentFormItem[]) => void;
 *   disabled?: boolean;
 * }} props
 */
export default function EquipmentFormRepeater({ items, onChange, disabled = false }) {
  const list = items?.length ? items : [{ ...EMPTY_ROW }];
  const [uploadingIndex, setUploadingIndex] = useState(-1);
  const [uploadError, setUploadError] = useState("");

  const patch = (index, key, val) => {
    const next = list.map((row, i) => (i === index ? { ...row, [key]: val } : row));
    onChange(next);
  };

  const addRow = () => onChange([...list, { ...EMPTY_ROW }]);

  const removeRow = (index) => {
    const next = list.filter((_, i) => i !== index);
    onChange(next.length ? next : [{ ...EMPTY_ROW }]);
  };

  const onPickFile = async (index, e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const err = validateImageFile(file);
    if (err) {
      setUploadError(err);
      return;
    }
    setUploadError("");
    setUploadingIndex(index);
    try {
      const up = await uploadAdminImage(file, EQUIPMENT_FOLDER);
      patch(index, "imageUrl", up.url);
    } catch {
      setUploadError("Không tải được ảnh. Thử lại hoặc dán URL.");
    } finally {
      setUploadingIndex(-1);
    }
  };

  return (
    <div className="space-y-4">
      {uploadError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{uploadError}</p>
      ) : null}

      {list.map((row, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Thiết bị #{index + 1}
            </p>
            <button
              type="button"
              onClick={() => removeRow(index)}
              disabled={disabled || list.length <= 1}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Xóa
            </button>
          </div>

          <label className="text-xs font-medium text-slate-600">Tên thiết bị *</label>
          <input
            value={row.label}
            onChange={(e) => patch(index, "label", e.target.value)}
            className={inputClass}
            placeholder="Ví dụ: Modem Wi-Fi 6"
            disabled={disabled}
          />

          <div className="mt-3">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <ImagePlus className="h-3.5 w-3.5" aria-hidden />
              Ảnh thiết bị
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                {row.imageUrl?.trim() ? (
                  <img
                    src={row.imageUrl.trim()}
                    alt=""
                    className="max-h-full max-w-full object-contain p-1"
                  />
                ) : (
                  <span className="px-2 text-center text-[10px] text-slate-400">Chưa có ảnh</span>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-secondary hover:bg-slate-50">
                  {uploadingIndex === index ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <ImagePlus className="h-4 w-4" aria-hidden />
                  )}
                  {uploadingIndex === index ? "Đang tải…" : "Chọn ảnh từ máy"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    disabled={disabled || uploadingIndex === index}
                    onChange={(e) => onPickFile(index, e)}
                  />
                </label>
                <input
                  value={row.imageUrl ?? ""}
                  onChange={(e) => patch(index, "imageUrl", e.target.value)}
                  className={inputClass}
                  placeholder="Hoặc dán URL ảnh (https://...)"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-secondary hover:bg-slate-50 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        Thêm thiết bị
      </button>
    </div>
  );
}
