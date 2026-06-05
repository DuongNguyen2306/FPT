/** @typedef {import('../types/api').LeadPublicItem} LeadPublicItem */

export const LEAD_STATUS_BADGE = {
  NEW: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-amber-100 text-amber-800",
  CONVERTED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-slate-200 text-slate-600",
};

export const LEAD_STATUS_LABEL = {
  NEW: "Mới",
  CONTACTED: "Đang tư vấn",
  CONVERTED: "Đã chốt",
  CANCELLED: "Hủy",
};

/**
 * @param {string} [status]
 */
export function getLeadStatusBadgeClass(status) {
  return LEAD_STATUS_BADGE[status] ?? "bg-slate-100 text-slate-700";
}

/**
 * @param {string} [status]
 */
export function getLeadStatusLabel(status) {
  return LEAD_STATUS_LABEL[status] ?? status ?? "—";
}

/**
 * @param {string} [iso]
 */
export function formatLeadDateTime(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return String(iso);
  }
}

/**
 * Chuẩn hóa document lead từ BE (guest history hoặc /me/leads).
 * @param {Record<string, unknown> | null | undefined} doc
 * @returns {LeadPublicItem | null}
 */
export function normalizeLeadItem(doc) {
  if (!doc) return null;
  const id = String(doc.id ?? doc._id ?? "");
  if (!id) return null;

  const snap = doc.packageSnapshot;
  /** @type {import('../types/api').LeadPackageSnapshot | null} */
  let packageSnapshot = null;
  if (snap && typeof snap === "object") {
    packageSnapshot = {
      code: snap.code != null ? String(snap.code) : undefined,
      name: snap.name != null ? String(snap.name) : undefined,
      price:
        typeof snap.price === "number"
          ? snap.price
          : snap.price == null
            ? null
            : Number(snap.price) || null,
      type: snap.type != null ? String(snap.type) : undefined,
    };
  }

  return {
    id,
    status: String(doc.status ?? "NEW"),
    createdAt: String(doc.createdAt ?? ""),
    fullName: String(doc.fullName ?? ""),
    phone: String(doc.phone ?? ""),
    installAddress: String(doc.installAddress ?? ""),
    packageId: doc.packageId != null ? String(doc.packageId) : null,
    packageSnapshot,
  };
}
