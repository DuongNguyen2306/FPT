/**
 * @param {{ link?: string; packageCode?: string | null }} item
 * @returns {string}
 */
export function resolveNavHref(item) {
  if (item.packageCode?.trim()) {
    return `/goi/${encodeURIComponent(item.packageCode.trim())}`;
  }
  const link = item.link?.trim() ?? "/";
  if (link.startsWith("http")) return link;
  if (link.startsWith("/")) return link;
  if (link.startsWith("#")) return `/${link}`;
  return link;
}

/**
 * @param {string} href
 */
export function isExternalNavHref(href) {
  return /^https?:\/\//i.test(href);
}
