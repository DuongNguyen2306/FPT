import { listPackages } from "../api/packagesApi.js";

const PACKAGE_TYPES = ["SPEEDX", "INTERNET", "FPT_PLAY", "CAMERA", "SERVICE"];

/** @type {{ promise: Promise<import('./packagesCatalog').PackagesCatalog> | null; data: import('./packagesCatalog').PackagesCatalog | null; fetchedAt: number }} */
const cache = { promise: null, data: null, fetchedAt: 0 };

const CACHE_TTL_MS = 45_000;

/**
 * @typedef {{
 *   speedx: import('../types/api').PackageDto[];
 *   internet: import('../types/api').PackageDto[];
 *   play: import('../types/api').PackageDto[];
 *   camera: import('../types/api').PackageDto[];
 *   service: import('../types/api').PackageDto[];
 *   all: import('../types/api').PackageDto[];
 * }} PackagesCatalog
 */

/**
 * @param {import('../types/api').PackageDto[]} items
 * @returns {PackagesCatalog}
 */
function splitByType(items) {
  /** @type {PackagesCatalog} */
  const out = {
    speedx: [],
    internet: [],
    play: [],
    camera: [],
    service: [],
    all: items ?? [],
  };

  for (const p of items ?? []) {
    const t = String(p.type ?? "").toUpperCase();
    switch (t) {
      case "SPEEDX":
        out.speedx.push(p);
        break;
      case "INTERNET":
        out.internet.push(p);
        break;
      case "FPT_PLAY":
        out.play.push(p);
        break;
      case "CAMERA":
        out.camera.push(p);
        break;
      case "SERVICE":
        out.service.push(p);
        break;
      default:
        break;
    }
  }

  return out;
}

/**
 * Một lần gọi API (không filter type) — giảm 429.
 */
async function fetchAllInOneRequest() {
  const all = await listPackages();
  if (all.length > 0) return splitByType(all);
  return null;
}

/**
 * Fallback: 5 request song song — chỉ chạy khi catalog đang được share (1 inflight).
 */
async function fetchByTypeParallel() {
  const [speedx, internet, play, camera, service] = await Promise.all(
    PACKAGE_TYPES.map((type) => listPackages(type).catch(() => []))
  );
  const all = [...internet, ...speedx, ...play, ...camera, ...service];
  return { speedx, internet, play, camera, service, all };
}

async function loadCatalogFromNetwork() {
  try {
    const grouped = await fetchAllInOneRequest();
    if (grouped) return grouped;
  } catch (err) {
    if (err?.response?.status === 429) throw err;
  }
  return fetchByTypeParallel();
}

/**
 * Catalog gói cước — dedupe request giữa Navbar, Footer, HomePage.
 * @param {{ force?: boolean }} [opts]
 * @returns {Promise<PackagesCatalog>}
 */
export function fetchPackagesCatalog(opts = {}) {
  const { force = false } = opts;
  const now = Date.now();

  if (!force && cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
    return Promise.resolve(cache.data);
  }

  if (!force && cache.promise) {
    return cache.promise;
  }

  cache.promise = loadCatalogFromNetwork()
    .then((data) => {
      cache.data = data;
      cache.fetchedAt = Date.now();
      return data;
    })
    .finally(() => {
      cache.promise = null;
    });

  return cache.promise;
}

/** @param {string} [type] */
export async function listPackagesCached(type) {
  const catalog = await fetchPackagesCatalog();
  if (!type) return catalog.all;
  const key = type.toUpperCase();
  const map = {
    SPEEDX: catalog.speedx,
    INTERNET: catalog.internet,
    FPT_PLAY: catalog.play,
    CAMERA: catalog.camera,
    SERVICE: catalog.service,
  };
  return map[key] ?? [];
}

export function clearPackagesCatalogCache() {
  cache.data = null;
  cache.fetchedAt = 0;
  cache.promise = null;
}
