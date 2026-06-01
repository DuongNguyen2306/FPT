/** Tab lọc gói Internet theo nhóm khách (metadata.audience). */
export const PACKAGE_LIST_TABS = [
  { id: "personal", label: "Internet cá nhân", audiences: ["personal"] },
  { id: "family", label: "Internet gia đình", audiences: ["family"] },
  { id: "gamer", label: "Internet game thủ", audiences: ["gamer"] },
  { id: "combo-camera", label: "Combo Internet Camera", audiences: ["combo-camera"] },
  { id: "combo-tv", label: "Combo Internet Truyền hình", audiences: ["combo-tv"] },
  { id: "enterprise", label: "Internet doanh nghiệp", audiences: ["enterprise", "business"] },
];

/**
 * @param {import('../../lib/mapPackageFromApi').ProductPlanItem[]} packages
 * @param {string} tabId
 */
export function filterPackagesByTab(packages, tabId) {
  const tab = PACKAGE_LIST_TABS.find((t) => t.id === tabId) ?? PACKAGE_LIST_TABS[0];
  return packages.filter((p) => {
    const aud = (p.audience ?? "").trim();
    return aud && tab.audiences.includes(aud);
  });
}
