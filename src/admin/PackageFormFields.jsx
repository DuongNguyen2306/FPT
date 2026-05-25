import PackageImagePicker from "../components/admin/PackageImagePicker.jsx";

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20";

const TYPE_OPTIONS = [
  { value: "INTERNET", label: "Internet" },
  { value: "SPEEDX", label: "SpeedX" },
  { value: "FPT_PLAY", label: "FPT Play" },
  { value: "CAMERA", label: "Camera" },
  { value: "SERVICE", label: "Dịch vụ" },
];

/**
 * @param {{
 *   values: import('../types/admin').PackageFormValues;
 *   onChange: (v: import('../types/admin').PackageFormValues) => void;
 *   isEdit?: boolean;
 *   heroFile?: File | null;
 *   accentFile?: File | null;
 *   heroPreview?: string | null;
 *   accentPreview?: string | null;
 *   onHeroFileChange?: (f: File | null) => void;
 *   onAccentFileChange?: (f: File | null) => void;
 *   imageErrors?: { hero?: string; accent?: string };
 *   disabled?: boolean;
 * }} props
 */
export default function PackageFormFields({
  values,
  onChange,
  isEdit = false,
  heroFile = null,
  accentFile = null,
  heroPreview = null,
  accentPreview = null,
  onHeroFileChange,
  onAccentFileChange,
  imageErrors = {},
  disabled = false,
}) {
  const patch = (key, val) => onChange({ ...values, [key]: val });
  const set = (key) => (e) => onChange({ ...values, [key]: e.target.value });
  const setCheck = (key) => (e) => onChange({ ...values, [key]: e.target.checked });

  const setFeature = (index, text) => {
    const next = [...values.features];
    next[index] = text;
    onChange({ ...values, features: next });
  };

  const addFeature = () => onChange({ ...values, features: [...values.features, ""] });
  const removeFeature = (index) => {
    const next = values.features.filter((_, i) => i !== index);
    onChange({ ...values, features: next.length ? next : [""] });
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900">Thông tin cơ bản</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Loại gói *</label>
            <select value={values.type} onChange={set("type")} className={inputClass} required>
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Mã gói *</label>
            <input value={values.code} onChange={set("code")} className={inputClass} required />
          </div>
          <div>
            <label className="text-sm font-medium">Tên gói *</label>
            <input value={values.name} onChange={set("name")} className={inputClass} required />
          </div>
          <div>
            <label className="text-sm font-medium">Tên ngắn</label>
            <input value={values.shortName} onChange={set("shortName")} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium">Mã hiển thị trên thẻ</label>
            <input value={values.displayCode} onChange={set("displayCode")} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium">Chu kỳ *</label>
            <select value={values.billingCycle} onChange={set("billingCycle")} className={inputClass}>
              <option value="MONTHLY">Theo tháng</option>
              <option value="ONCE">Một lần</option>
              <option value="FREE">Miễn phí</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Tagline *</label>
            <input value={values.tagline} onChange={set("tagline")} className={inputClass} required />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Mô tả dài</label>
            <textarea value={values.description} onChange={set("description")} rows={2} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Nhãn khuyến mãi</label>
            <input value={values.promoBadge} onChange={set("promoBadge")} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium">Thứ tự hiển thị</label>
            <input type="number" value={values.sortOrder} onChange={set("sortOrder")} className={inputClass} />
          </div>
          <div className="flex items-end gap-2 pb-2">
            <input
              id="isActive"
              type="checkbox"
              checked={values.isActive}
              onChange={setCheck("isActive")}
              className="h-4 w-4 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Hiển thị trên website
            </label>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Giá &amp; tốc độ</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Giá (VND)</label>
            <input
              type="number"
              value={values.price}
              onChange={set("price")}
              className={inputClass}
              disabled={values.priceContact || disabled}
            />
            <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={values.priceContact}
                onChange={(e) => patch("priceContact", e.target.checked)}
                disabled={disabled}
              />
              Liên hệ (không hiển thị giá)
            </label>
          </div>
          <div>
            <label className="text-sm font-medium">Nhãn tốc độ</label>
            <input
              value={values.speedLabel}
              onChange={set("speedLabel")}
              className={inputClass}
              placeholder="Ví dụ: 1 Gbps"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Dòng tốc độ (Mbps)</label>
            <input value={values.specLine} onChange={set("specLine")} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium">Chú thích tốc độ</label>
            <input value={values.specCaption} onChange={set("specCaption")} className={inputClass} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Ảnh gói</h2>
        <p className="mt-1 text-xs text-slate-500">Chọn ảnh từ máy tính. Ảnh sẽ được tải lên khi bạn lưu gói.</p>
        <div className="mt-4 grid gap-4">
          <PackageImagePicker
            label="Ảnh đại diện"
            required={!isEdit}
            file={heroFile}
            previewUrl={heroPreview}
            existingUrl={values.heroImage}
            onFileChange={onHeroFileChange ?? (() => {})}
            error={imageErrors.hero}
            disabled={disabled}
          />
          <PackageImagePicker
            label="Ảnh phụ (modem / thiết bị)"
            file={accentFile}
            previewUrl={accentPreview}
            existingUrl={values.accentImage}
            onFileChange={onAccentFileChange ?? (() => {})}
            error={imageErrors.accent}
            disabled={disabled}
          />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900">Tính năng nổi bật</h2>
          <button
            type="button"
            onClick={addFeature}
            disabled={disabled}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-slate-50 disabled:opacity-50"
          >
            + Thêm dòng
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {values.features.map((line, index) => (
            <li key={index} className="flex gap-2">
              <input
                value={line}
                onChange={(e) => setFeature(index, e.target.value)}
                className={`${inputClass} mt-0 flex-1`}
                placeholder="Modem Wi-Fi 6"
                disabled={disabled}
              />
              {values.features.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  disabled={disabled}
                  className="shrink-0 rounded-lg border border-slate-200 px-2 text-xs text-slate-500 hover:text-red-600 disabled:opacity-50"
                >
                  Xóa
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Thông tin bổ sung</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Tốc độ tải xuống (Mbps)</label>
            <input type="number" value={values.downloadMbps} onChange={set("downloadMbps")} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium">Tốc độ tải lên (Mbps)</label>
            <input type="number" value={values.uploadMbps} onChange={set("uploadMbps")} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium">Số thiết bị tối đa</label>
            <input type="number" value={values.maxDevices} onChange={set("maxDevices")} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium">Nhóm hiển thị trang chủ</label>
            <select value={values.audience} onChange={set("audience")} className={inputClass}>
              <option value="personal">Cá nhân</option>
              <option value="family">Gia đình</option>
              <option value="gamer">Game thủ</option>
              <option value="combo-camera">Combo camera</option>
              <option value="combo-tv">Combo truyền hình</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Thiết bị đi kèm (mỗi dòng một mục)</label>
            <textarea
              value={values.includedEquipmentText}
              onChange={set("includedEquipmentText")}
              rows={3}
              className={`${inputClass} font-mono`}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Đặc quyền (mỗi dòng một mục)</label>
            <textarea
              value={values.privilegesText}
              onChange={set("privilegesText")}
              rows={3}
              className={`${inputClass} font-mono`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
