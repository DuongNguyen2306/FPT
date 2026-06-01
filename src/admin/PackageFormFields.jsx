import PackageImagePicker from "../components/admin/PackageImagePicker.jsx";
import EquipmentFormRepeater from "../components/admin/EquipmentFormRepeater.jsx";
import PrivilegesFormRepeater from "../components/admin/PrivilegesFormRepeater.jsx";

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
 *   bannerFile?: File | null;
 *   heroPreview?: string | null;
 *   accentPreview?: string | null;
 *   bannerPreview?: string | null;
 *   onHeroFileChange?: (f: File | null) => void;
 *   onAccentFileChange?: (f: File | null) => void;
 *   onBannerFileChange?: (f: File | null) => void;
 *   imageErrors?: { hero?: string; accent?: string; banner?: string };
 *   heroUploading?: boolean;
 *   accentUploading?: boolean;
 *   bannerUploading?: boolean;
 *   disabled?: boolean;
 * }} props
 */
export default function PackageFormFields({
  values,
  onChange,
  isEdit = false,
  heroFile = null,
  accentFile = null,
  bannerFile = null,
  heroPreview = null,
  accentPreview = null,
  bannerPreview = null,
  onHeroFileChange,
  onAccentFileChange,
  onBannerFileChange,
  imageErrors = {},
  heroUploading = false,
  accentUploading = false,
  bannerUploading = false,
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

      <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">Ảnh sản phẩm &amp; banner</h2>
        <p className="mt-1 text-sm text-slate-600">
          Ảnh dùng cho <strong>thẻ gói</strong>, <strong>SpeedX</strong> và <strong>trang chi tiết</strong>. Banner
          21:9 dùng cho carousel trang chủ.
        </p>
        <div className="mt-4 grid gap-4">
          <PackageImagePicker
            label="Ảnh banner carousel (21:9)"
            file={bannerFile}
            previewUrl={bannerPreview}
            existingUrl={values.bannerImage}
            onFileChange={onBannerFileChange ?? (() => {})}
            error={imageErrors.banner}
            disabled={disabled}
            uploading={bannerUploading}
            variant="banner"
          />
          <PackageImagePicker
            label="Ảnh chính sản phẩm"
            file={heroFile}
            previewUrl={heroPreview}
            existingUrl={values.heroImage}
            onFileChange={onHeroFileChange ?? (() => {})}
            error={imageErrors.hero}
            disabled={disabled}
            uploading={heroUploading}
          />
          <PackageImagePicker
            label="Ảnh modem trên hero (trang chi tiết)"
            file={accentFile}
            previewUrl={accentPreview}
            existingUrl={values.accentImage}
            onFileChange={onAccentFileChange ?? (() => {})}
            error={imageErrors.accent}
            disabled={disabled}
            uploading={accentUploading}
          />
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
                className={inputClass}
                placeholder="Mô tả tính năng"
                disabled={disabled}
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                disabled={disabled || values.features.length <= 1}
                className="shrink-0 rounded-lg border border-slate-200 px-2 text-xs text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Metadata (Internet / SpeedX)</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Download (Mbps)</label>
            <input value={values.downloadMbps} onChange={set("downloadMbps")} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium">Upload (Mbps)</label>
            <input value={values.uploadMbps} onChange={set("uploadMbps")} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium">Số thiết bị tối đa</label>
            <input value={values.maxDevices} onChange={set("maxDevices")} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Tiêu đề hero trang chi tiết</label>
            <input
              value={values.heroHeadline}
              onChange={set("heroHeadline")}
              className={inputClass}
              placeholder="Ví dụ: INTERNET CHO CÁ NHÂN"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Ảnh minh họa (URL)</label>
            <input
              value={values.lifestyleImageUrl}
              onChange={set("lifestyleImageUrl")}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nhóm tab trang chủ *</label>
            <select value={values.audience} onChange={set("audience")} className={inputClass} required>
              <option value="personal">Internet cá nhân</option>
              <option value="family">Internet gia đình</option>
              <option value="gamer">Internet game thủ</option>
              <option value="combo-camera">Combo Internet Camera</option>
              <option value="combo-tv">Combo Internet Truyền hình</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Thiết bị kèm theo</label>
            <div className="mt-3">
              <EquipmentFormRepeater
                items={values.equipment}
                onChange={(equipment) => onChange({ ...values, equipment })}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Đặc quyền</label>
            <div className="mt-3">
              <PrivilegesFormRepeater
                items={values.privileges}
                onChange={(privileges) => onChange({ ...values, privileges })}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
