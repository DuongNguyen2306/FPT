import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { PRIVILEGE_ICON_OPTIONS } from "../../lib/privilegeIcons.js";

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20";

const EMPTY_ROW = { icon: "wifi", title: "", description: "", imageUrl: "" };

/**
 * @param {{
 *   items: import('../../types/admin').PrivilegeFormItem[];
 *   onChange: (items: import('../../types/admin').PrivilegeFormItem[]) => void;
 *   disabled?: boolean;
 * }} props
 */
export default function PrivilegesFormRepeater({ items, onChange, disabled = false }) {
  const list = items?.length ? items : [{ ...EMPTY_ROW }];

  const patch = (index, key, val) => {
    const next = list.map((row, i) => (i === index ? { ...row, [key]: val } : row));
    onChange(next);
  };

  const addRow = () => onChange([...list, { ...EMPTY_ROW }]);

  const removeRow = (index) => {
    const next = list.filter((_, i) => i !== index);
    onChange(next.length ? next : [{ ...EMPTY_ROW }]);
  };

  return (
    <div className="space-y-4">
      {list.map((row, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Đặc quyền #{index + 1}
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

          <p className="text-xs font-medium text-slate-600">Chọn icon hiển thị</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRIVILEGE_ICON_OPTIONS.map(({ id, label, Icon }) => {
              const active = row.icon === id;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={disabled}
                  title={label}
                  onClick={() => patch(index, "icon", id)}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 transition ${
                    active
                      ? "border-secondary bg-white text-secondary shadow-sm"
                      : "border-transparent bg-white text-slate-400 hover:border-slate-200 hover:text-slate-600"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  <span className="sr-only">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-600">Tiêu đề *</label>
              <input
                value={row.title}
                onChange={(e) => patch(index, "title", e.target.value)}
                className={inputClass}
                placeholder="Ví dụ: Trang bị thiết bị hiện đại"
                disabled={disabled}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-600">Mô tả</label>
              <textarea
                value={row.description}
                onChange={(e) => patch(index, "description", e.target.value)}
                rows={2}
                className={inputClass}
                placeholder="Mô tả ngắn hiển thị dưới tiêu đề"
                disabled={disabled}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <ImagePlus className="h-3.5 w-3.5" aria-hidden />
                Ảnh icon tùy chỉnh (URL — tùy chọn)
              </label>
              <input
                value={row.imageUrl ?? ""}
                onChange={(e) => patch(index, "imageUrl", e.target.value)}
                className={inputClass}
                placeholder="https://... (để trống = dùng icon ở trên)"
                disabled={disabled}
              />
              {row.imageUrl?.trim() ? (
                <div className="mt-2 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <img
                    src={row.imageUrl.trim()}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : null}
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
        Thêm đặc quyền
      </button>
    </div>
  );
}
