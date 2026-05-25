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
    };
  }).filter((x) => x.title);
}
