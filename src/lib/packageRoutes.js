/**
 * @param {{ code?: string; id?: string }} pkg
 * @returns {string}
 */
export function packageDetailPath(pkg) {
  if (pkg?.code) return `/goi/${encodeURIComponent(pkg.code)}`;
  if (pkg?.id) return `/goi/id/${encodeURIComponent(pkg.id)}`;
  return "/";
}
