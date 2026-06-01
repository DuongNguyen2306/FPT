import { buildMegaMenuGroups } from "./transformMegaMenuData.js";
import { fetchPackagesCatalog } from "./packagesCatalog.js";

/**
 * Tải gói (cache chung) + dựng mega-menu.
 */
export async function loadSiteNavigation() {
  const catalog = await fetchPackagesCatalog();
  const byType = {
    speedx: catalog.speedx,
    internet: catalog.internet,
    play: catalog.play,
    camera: catalog.camera,
    service: catalog.service,
  };
  const displayGroups = buildMegaMenuGroups(byType);
  return { displayGroups, fromPackages: displayGroups, ctx: null };
}

export function buildFooterProductLinks(groups) {
  const map = {
    "mega-internet": { to: "/#internet", label: "Internet" },
    "mega-play": { to: "/#truyen-hinh", label: "Truyền hình FPT Play" },
    "mega-camera": { to: "/#camera", label: "Camera an ninh" },
    "mega-service": { to: "/#dich-vu", label: "Dịch vụ thêm" },
  };
  return (groups ?? []).map((g) => map[g.id]).filter(Boolean);
}
