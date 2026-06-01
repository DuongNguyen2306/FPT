import { PACKAGE_TYPE_LABELS } from "./userFacingText.js";

/**
 * @param {{ createdAt?: string; updatedAt?: string; _id?: string; id?: string }} pkg
 */
export function getPackageTimestamp(pkg) {
  const raw = pkg.updatedAt ?? pkg.createdAt;
  if (raw) {
    const t = new Date(raw).getTime();
    if (!Number.isNaN(t)) return t;
  }
  const id = String(pkg.id ?? pkg._id ?? "");
  if (/^[a-f0-9]{24}$/i.test(id)) {
    return parseInt(id.slice(0, 8), 16) * 1000;
  }
  return 0;
}

/**
 * @param {import('../types/admin').PackageFe[]} items
 * @param {"newest" | "oldest" | "sortOrder"} mode
 */
export function sortAdminPackages(items, mode = "newest") {
  const list = [...items];
  if (mode === "sortOrder") {
    return list.sort((a, b) => {
      const oa = Number(a.sortOrder) || 0;
      const ob = Number(b.sortOrder) || 0;
      if (oa !== ob) return oa - ob;
      return getPackageTimestamp(b) - getPackageTimestamp(a);
    });
  }
  if (mode === "oldest") {
    return list.sort((a, b) => getPackageTimestamp(a) - getPackageTimestamp(b));
  }
  return list.sort((a, b) => getPackageTimestamp(b) - getPackageTimestamp(a));
}

/**
 * @param {import('../types/admin').PackageFe} pkg
 * @param {string} query
 */
export function matchesPackageSearch(pkg, query) {
  const s = query.trim().toLowerCase();
  if (!s) return true;
  const hay = [
    pkg.name,
    pkg.shortName,
    pkg.code,
    pkg.displayCode,
    pkg.tagline,
    pkg.description,
    pkg.type,
    PACKAGE_TYPE_LABELS[pkg.type],
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(s);
}
