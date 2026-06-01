import { fetchPackagesCatalog } from "./packagesCatalog.js";
import { isBannerOnlyPackage } from "./packageHelpers.js";
import { PACKAGE_TYPE_LABELS } from "./userFacingText.js";

/**
 * @param {import('../types/api').PackageDto} pkg
 * @param {string} query
 */
export function matchesPublicPackageSearch(pkg, query) {
  const s = query.trim().toLowerCase();
  if (!s) return false;
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

/**
 * @param {string} query
 * @param {number} [limit]
 */
export async function searchPublicPackages(query, limit = 8) {
  const q = query.trim();
  if (q.length < 2) return [];

  const catalog = await fetchPackagesCatalog();
  const results = catalog.all
    .filter((p) => p && !isBannerOnlyPackage(p) && p.isActive !== false)
    .filter((p) => matchesPublicPackageSearch(p, q))
    .slice(0, limit);

  return results.map((p) => ({
    id: String(p.id ?? p._id ?? ""),
    code: p.code ?? "",
    name: p.shortName || p.name || p.displayCode || p.code || "Gói cước",
    type: p.type,
    typeLabel: PACKAGE_TYPE_LABELS[p.type] ?? p.type,
  }));
}
