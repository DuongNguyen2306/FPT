/**
 * Gói chỉ dùng làm slide carousel (không hiện trong danh sách sản phẩm).
 * @param {{ code?: string; metadata?: { bannerOnly?: boolean } }} p
 */
export function isBannerOnlyPackage(p) {
  if (!p) return false;
  const meta = p.metadata ?? {};
  if (meta.bannerOnly === true) return true;
  return String(p.code ?? "")
    .toLowerCase()
    .startsWith("banner-");
}

/**
 * @param {number | null | undefined} price
 */
export function formatVnd(price) {
  if (price == null || Number.isNaN(Number(price))) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(Number(price)) + "đ";
}

/**
 * @param {{ metadata?: { downloadMbps?: number; uploadMbps?: number }; specLine?: string; speedLabel?: string }} p
 * @returns {string | null}
 */
export function packageSpeedText(p) {
  const meta = p.metadata ?? p;
  const d = meta.downloadMbps;
  const u = meta.uploadMbps;
  if (d != null && u != null) return `${d} Mbps / ${u} Mbps`;
  if (d != null) return `${d} Mbps`;
  return p.specLine ?? p.speedLabel ?? null;
}

/**
 * @param {import('../types/api').PackageMetadata['includedEquipment']} items
 * @returns {{ label: string; imageUrl?: string }[]}
 */
export function normalizeEquipment(items) {
  if (!items?.length) return [];
  return items.map((x) => {
    if (typeof x === "string") return { label: x };
    return {
      label: x.label ?? x.name ?? "",
      imageUrl: x.imageUrl,
    };
  }).filter((x) => x.label);
}

/**
 * @param {import('../types/api').PackageMetadata['privileges']} items
 * @returns {{ title: string; description?: string; icon?: string }[]}
 */
export function normalizePrivileges(items) {
  if (!items?.length) return [];
  return items.map((x) => {
    if (typeof x === "string") return { title: x, description: "" };
    return {
      title: x.title ?? "",
      description: x.description ?? "",
      icon: x.icon,
      imageUrl: x.imageUrl,
    };
  }).filter((x) => x.title);
}

/**
 * @param {import('../types/api').PackageMetadata['privileges']} items
 * @returns {import('../types/admin').PrivilegeFormItem[]}
 */
export function privilegesToFormItems(items) {
  const list = normalizePrivileges(items);
  if (!list.length) {
    return [{ icon: "wifi", title: "", description: "", imageUrl: "" }];
  }
  return list.map((p) => ({
    icon: typeof p.icon === "string" && p.icon ? p.icon : "wifi",
    title: p.title,
    description: p.description ?? "",
    imageUrl: p.imageUrl ?? "",
  }));
}

/**
 * @param {import('../types/admin').PrivilegeFormItem[]} items
 */
export function formPrivilegesToMetadata(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((p) => ({
      icon: (p.icon ?? "wifi").trim(),
      title: p.title?.trim() ?? "",
      description: p.description?.trim() || undefined,
      imageUrl: p.imageUrl?.trim() || undefined,
    }))
    .filter((p) => p.title);
}

/**
 * @param {import('../types/api').PackageMetadata['includedEquipment']} items
 * @returns {import('../types/admin').EquipmentFormItem[]}
 */
export function equipmentToFormItems(items) {
  const list = normalizeEquipment(items);
  if (!list.length) return [{ label: "", imageUrl: "" }];
  return list.map((e) => ({
    label: e.label,
    imageUrl: e.imageUrl ?? "",
  }));
}

/**
 * @param {import('../types/admin').EquipmentFormItem[]} items
 */
export function formEquipmentToMetadata(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((e) => ({
      label: e.label?.trim() ?? "",
      imageUrl: e.imageUrl?.trim() || undefined,
    }))
    .filter((e) => e.label);
}
