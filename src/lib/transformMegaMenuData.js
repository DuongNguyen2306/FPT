import { isBannerOnlyPackage } from "./packageHelpers.js";
import { packageDetailPath } from "./packageRoutes.js";
import { PACKAGE_LIST_TABS } from "../components/packages/packageListTabs.js";

/** @typedef {'internet' | 'play' | 'camera' | 'service'} MegaMenuCategory */

/** @typedef {{ id: string; title: string; icon: string; displayOrder: number; displayAsTags?: boolean; items: import('../types/api').NavigationMenuItem[] }} MegaMenuColumnGroup */

const CATEGORY_META = {
  internet: { id: "mega-internet", title: "Internet - Wifi", icon: "wifi", displayOrder: 0 },
  play: { id: "mega-play", title: "Truyền hình & Giải trí", icon: "play-circle", displayOrder: 1 },
  camera: { id: "mega-camera", title: "FPT Camera", icon: "cctv", displayOrder: 2 },
  service: { id: "mega-service", title: "Dịch vụ", icon: "shield", displayOrder: 3 },
};

const TAB_LABEL_ORDER = PACKAGE_LIST_TABS.map((t) => t.label);

const AUDIENCE_EXTRA_LABELS = {
  enterprise: "Internet doanh nghiệp",
  business: "Internet doanh nghiệp",
};

/**
 * @param {import('../types/api').PackageDto} p
 */
export function isJunkPackage(p) {
  if (!p || isBannerOnlyPackage(p) || p.isActive === false) return true;

  const name = (p.name ?? p.shortName ?? "").trim();
  const code = (p.code ?? "").trim();
  const display = (p.displayCode ?? "").trim();

  if (!name && !code) return true;
  if (name.length < 2 && code.length < 2) return true;

  const blob = `${name} ${code} ${display}`.toLowerCase();
  if (/\b(sdfs|asdf|test|demo|xxx|abc123)\b/.test(blob)) return true;
  if (/^sdfs$/i.test(code) || /^sdfs$/i.test(name)) return true;

  return false;
}

/**
 * @param {import('../types/api').PackageDto} p
 * @returns {MegaMenuCategory | null}
 */
function packageCategory(p) {
  const type = (p.type ?? "").toUpperCase();
  if (type === "INTERNET" || type === "SPEEDX") return "internet";
  if (type === "FPT_PLAY") return "play";
  if (type === "CAMERA") return "camera";
  if (type === "SERVICE") return "service";
  return null;
}

/**
 * @param {import('../types/api').PackageDto} p
 */
function getCardLabel(p) {
  const meta = p.metadata ?? {};
  if (typeof meta.cardLabel === "string" && meta.cardLabel.trim()) {
    return meta.cardLabel.trim();
  }

  const audience = String(meta.audience ?? p.audience ?? "").trim();
  if (audience && AUDIENCE_EXTRA_LABELS[audience]) {
    return AUDIENCE_EXTRA_LABELS[audience];
  }

  const tab = PACKAGE_LIST_TABS.find((t) => t.audiences.includes(audience));
  if (tab) return tab.label;

  if ((p.type ?? "").toUpperCase() === "SPEEDX") {
    return "Internet tốc độ cao";
  }

  return null;
}

/**
 * @param {import('../types/api').PackageDto} p
 */
function normalizePackageRow(p) {
  const category = packageCategory(p);
  if (!category) return null;

  return {
    name: (p.shortName || p.name || p.displayCode || p.code || "").trim(),
    code: (p.code ?? "").trim(),
    category,
    cardLabel: category === "internet" ? getCardLabel(p) : null,
    package: p,
  };
}

/**
 * @param {import('../types/api').PackageDto[]} packages
 */
export function normalizePackagesForMegaMenu(packages) {
  return (packages ?? [])
    .filter((p) => !isJunkPackage(p))
    .map(normalizePackageRow)
    .filter(Boolean);
}

/**
 * @param {string} label
 */
function tabIdFromLabel(label) {
  const tab = PACKAGE_LIST_TABS.find((t) => t.label === label);
  if (tab) return tab.id;

  if (label === "Internet doanh nghiệp") return "enterprise";
  if (label === "Internet tốc độ cao") return "personal";

  return null;
}

/**
 * @param {ReturnType<normalizePackageRow>[]} rows
 * @returns {import('../types/api').NavigationMenuItem[]}
 */
function buildInternetTagItems(rows) {
  const internetRows = rows.filter((r) => r.category === "internet");

  const labelSet = new Set();
  for (const row of internetRows) {
    const label = row.cardLabel?.trim();
    if (label) labelSet.add(label);
  }

  const sortedLabels = [...labelSet].sort((a, b) => {
    const ia = TAB_LABEL_ORDER.indexOf(a);
    const ib = TAB_LABEL_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b, "vi");
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return sortedLabels.map((label) => {
    const tabId = tabIdFromLabel(label);
    const query = tabId ? `?tab=${encodeURIComponent(tabId)}` : "";
    return {
      label,
      link: `/${query}#internet`,
      tabId: tabId ?? undefined,
      isTag: true,
    };
  });
}

/**
 * @param {ReturnType<normalizePackageRow>[]} rows
 * @param {MegaMenuCategory} category
 */
function buildPackageLinkItems(rows, category) {
  const seen = new Set();
  /** @type {import('../types/api').NavigationMenuItem[]} */
  const items = [];

  const subset = rows
    .filter((r) => r.category === category)
    .sort((a, b) => (a.package.sortOrder ?? 0) - (b.package.sortOrder ?? 0));

  for (const row of subset) {
    const label = row.name || row.code;
    const key = `${label}-${row.code}`;
    if (!label || seen.has(key)) continue;
    seen.add(key);

    const badge = (row.package.promoBadge ?? "").toLowerCase();
    items.push({
      label,
      link: packageDetailPath({ code: row.code, id: row.package.id ?? row.package._id }),
      packageCode: row.code || undefined,
      isNew: /mới|moi|new/.test(badge),
    });
  }

  return items;
}

/**
 * @param {{
 *   internet?: import('../types/api').PackageDto[];
 *   speedx?: import('../types/api').PackageDto[];
 *   play?: import('../types/api').PackageDto[];
 *   camera?: import('../types/api').PackageDto[];
 *   service?: import('../types/api').PackageDto[];
 * }} byType
 * @returns {MegaMenuColumnGroup[]}
 */
export function buildMegaMenuGroups(byType) {
  const allRaw = [
    ...(byType.internet ?? []),
    ...(byType.speedx ?? []),
    ...(byType.play ?? []),
    ...(byType.camera ?? []),
    ...(byType.service ?? []),
  ];

  const rows = normalizePackagesForMegaMenu(allRaw);

  /** @type {MegaMenuColumnGroup[]} */
  const columns = [];

  const internetTags = buildInternetTagItems(rows);
  if (internetTags.length) {
    columns.push({
      ...CATEGORY_META.internet,
      displayAsTags: true,
      items: internetTags,
    });
  }

  for (const cat of /** @type {const} */ (["play", "camera", "service"])) {
    const items = buildPackageLinkItems(rows, cat);
    if (items.length) {
      columns.push({
        ...CATEGORY_META[cat],
        items,
      });
    }
  }

  return columns.sort((a, b) => a.displayOrder - b.displayOrder);
}
