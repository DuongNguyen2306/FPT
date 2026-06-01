/** Ảnh mặc định khi chưa chọn file / URL. */
export const PREVIEW_PLACEHOLDER_IMAGE =
  "https://placehold.co/600x400/e2e8f0/64748b?text=Anh+san+pham";

const DEFAULT_FEATURES = [
  "Tính năng mẫu — nhập danh sách bên trái",
  "Hỗ trợ tối đa thiết bị",
  "Lắp đặt nhanh trong ngày",
];

/**
 * Map form admin → props CompactPackageCard (live preview).
 * @param {import('../types/admin').PackageFormValues} values
 * @param {{ heroImageUrl?: string | null }} [opts]
 */
export function packageFormToPreviewProps(values, opts = {}) {
  const heroImageUrl = opts.heroImageUrl?.trim() || values.heroImage?.trim() || PREVIEW_PLACEHOLDER_IMAGE;

  const priceRaw = values.price?.trim();
  const price =
    values.priceContact || !priceRaw
      ? undefined
      : Number.isNaN(Number(priceRaw))
        ? undefined
        : Number(priceRaw);

  const features = (values.features ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const featureList = features.length ? features : DEFAULT_FEATURES;

  const down = values.downloadMbps?.trim() ? Number(values.downloadMbps) : null;
  const up = values.uploadMbps?.trim() ? Number(values.uploadMbps) : null;
  const specLine =
    values.specLine?.trim() ||
    values.speedLabel?.trim() ||
    (down || up ? null : "Tốc độ mẫu — Mbps");

  return {
    id: "preview",
    name: values.name?.trim() || "Tên gói cước mẫu",
    displayCode:
      values.displayCode?.trim() ||
      values.code?.trim()?.toUpperCase() ||
      "GOI MAU",
    tagline: values.tagline?.trim() || "Tagline / mô tả ngắn gói cước",
    promoBadge: values.promoBadge?.trim() || undefined,
    heroImage: heroImageUrl,
    price,
    downloadMbps: down,
    uploadMbps: up,
    specLine: specLine || undefined,
    features: featureList,
    previewMode: true,
  };
}
