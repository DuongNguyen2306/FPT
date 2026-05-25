export function formatVnd(price) {
  if (price == null || Number.isNaN(Number(price))) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(Number(price)) + "đ";
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function linesToArray(text) {
  return String(text ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function arrayToLines(arr) {
  return Array.isArray(arr) ? arr.join("\n") : "";
}

/** @param {import('../types/api').PackageMetadata['includedEquipment']} arr */
export function equipmentToLines(arr) {
  if (!Array.isArray(arr) || !arr.length) return "";
  return arr
    .map((x) => (typeof x === "string" ? x : x.label ?? x.name ?? ""))
    .filter(Boolean)
    .join("\n");
}

/**
 * @param {import('../types/admin').PackageFormValues} v
 */
export function packageFormToBody(v) {
  const price = v.priceContact ? null : v.price.trim() === "" ? null : Number(v.price);

  const metadata = {};
  if (v.downloadMbps.trim()) metadata.downloadMbps = Number(v.downloadMbps);
  if (v.uploadMbps.trim()) metadata.uploadMbps = Number(v.uploadMbps);
  if (v.maxDevices.trim()) metadata.maxDevices = Number(v.maxDevices);
  if (v.audience.trim()) metadata.audience = v.audience.trim();
  const equipment = linesToArray(v.includedEquipmentText);
  const privileges = linesToArray(v.privilegesText);
  if (equipment.length) metadata.includedEquipment = equipment;
  if (privileges.length) metadata.privileges = privileges;

  const body = {
    type: v.type,
    code: v.code.trim(),
    name: v.name.trim(),
    shortName: v.shortName.trim() || undefined,
    displayCode: v.displayCode.trim() || undefined,
    tagline: v.tagline.trim(),
    description: v.description.trim() || undefined,
    promoBadge: v.promoBadge.trim() || undefined,
    billingCycle: v.billingCycle,
    heroImage: v.heroImage.trim(),
    imageUrl: v.heroImage.trim(),
    accentImage: v.accentImage.trim() || undefined,
    specCaption: v.specCaption.trim() || undefined,
    specLine: v.specLine.trim() || undefined,
    statIcon: v.statIcon.trim() || undefined,
    features: (v.features ?? []).map((s) => s.trim()).filter(Boolean),
    speedLabel: v.speedLabel?.trim() || undefined,
    isActive: v.isActive,
    sortOrder: Number(v.sortOrder) || 0,
    price,
    monthlyPrice: price,
    metadata: Object.keys(metadata).length ? metadata : undefined,
  };

  return body;
}

/**
 * @param {import('../types/admin').PackageFe} pkg
 * @returns {import('../types/admin').PackageFormValues}
 */
export function packageToFormValues(pkg) {
  const meta = pkg.metadata ?? {};
  return {
    type: (pkg.type ?? "INTERNET"),
    code: pkg.code ?? "",
    name: pkg.name ?? "",
    shortName: pkg.shortName ?? "",
    displayCode: pkg.displayCode ?? "",
    tagline: pkg.tagline ?? "",
    description: pkg.description ?? "",
    promoBadge: pkg.promoBadge ?? "",
    billingCycle: pkg.billingCycle ?? "MONTHLY",
    price: pkg.price != null ? String(pkg.price) : pkg.monthlyPrice != null ? String(pkg.monthlyPrice) : "",
    heroImage: pkg.heroImage ?? pkg.imageUrl ?? "",
    accentImage: pkg.accentImage ?? "",
    specCaption: pkg.specCaption ?? "Tốc độ (tải xuống / tải lên)",
    specLine: pkg.specLine ?? "",
    statIcon: pkg.statIcon ?? "gauge",
    priceContact: pkg.price == null && pkg.monthlyPrice == null,
    speedLabel: pkg.speedLabel ?? pkg.specLine ?? "",
    features: pkg.features?.length ? [...pkg.features] : [""],
    isActive: pkg.isActive !== false,
    sortOrder: String(pkg.sortOrder ?? 0),
    downloadMbps: meta.downloadMbps != null ? String(meta.downloadMbps) : "",
    uploadMbps: meta.uploadMbps != null ? String(meta.uploadMbps) : "",
    maxDevices: meta.maxDevices != null ? String(meta.maxDevices) : "",
    audience: meta.audience ?? "",
    includedEquipmentText: equipmentToLines(meta.includedEquipment),
    privilegesText: arrayToLines(
      meta.privileges?.map((x) =>
        typeof x === "string" ? x : x.title ?? ""
      )
    ),
  };
}

export const EMPTY_PACKAGE_FORM = {
  type: "INTERNET",
  code: "",
  name: "",
  shortName: "",
  displayCode: "",
  tagline: "",
  description: "",
  promoBadge: "",
  billingCycle: "MONTHLY",
  price: "",
  priceContact: false,
  speedLabel: "",
  heroImage: "",
  accentImage: "",
  specCaption: "",
  specLine: "",
  statIcon: "gauge",
  features: [""],
  isActive: true,
  sortOrder: "0",
  downloadMbps: "",
  uploadMbps: "",
  maxDevices: "",
  audience: "personal",
  includedEquipmentText: "",
  privilegesText: "",
};
