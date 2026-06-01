import { adminApi } from "../lib/adminClient.js";
import {
  createAdminPackage,
  deleteAdminPackage,
  listAdminPackages,
  patchAdminPackage,
} from "./adminPackages.js";
import { uploadAdminImage } from "./adminUploads.js";
import { isBannerOnlyPackage } from "../lib/packageHelpers.js";

const BANNER_FOLDER = "telecom-packages/banners";

function pickImage(b) {
  return b?.imageUrl ?? b?.bannerImage ?? "";
}

function isBannerApiMissing(err) {
  const status = err?.response?.status;
  return status === 404 || status === 405 || status === 501;
}

/**
 * @returns {Promise<{ items: object[] } | null>}
 */
export async function listAdminBannersApi() {
  try {
    const { data } = await adminApi.get("/admin/banners");
    const items = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
    return { items };
  } catch (err) {
    if (isBannerApiMissing(err)) return null;
    throw err;
  }
}

/** @param {string} id */
export async function getAdminBanner(id) {
  const { data } = await adminApi.get(`/admin/banners/${encodeURIComponent(id)}`);
  return data;
}

/**
 * Tạo banner không gắn gói — thử API riêng, fallback tạo slot ẩn trên BE hiện có.
 * @param {{ imageUrl: string; title: string; subtitle?: string; sortOrder?: number; isActive?: boolean }} body
 */
export async function createStandaloneBanner(body) {
  try {
    const { data } = await adminApi.post("/admin/banners", {
      ...body,
      bannerImage: body.imageUrl,
    });
    return data;
  } catch (err) {
    if (!isBannerApiMissing(err)) throw err;
    const code = `banner-${Date.now()}`;
    const name = body.title?.trim() || "Banner";
    const tagline = body.subtitle?.trim() || name;
    return createAdminPackage({
      type: "SERVICE",
      code,
      name,
      tagline,
      bannerImage: body.imageUrl,
      billingCycle: "FREE",
      features: [],
      isActive: body.isActive !== false,
      sortOrder: body.sortOrder ?? 0,
      metadata: { bannerOnly: true },
    });
  }
}

/**
 * @param {string} id
 * @param {{ imageUrl?: string; title?: string; subtitle?: string; sortOrder?: number; isActive?: boolean }} body
 */
export async function updateStandaloneBanner(id, body) {
  const payload = { ...body };
  if (payload.imageUrl) payload.bannerImage = payload.imageUrl;
  if (payload.title) payload.name = payload.title;
  if (payload.subtitle) payload.tagline = payload.subtitle;

  try {
    const { data } = await adminApi.patch(`/admin/banners/${encodeURIComponent(id)}`, payload);
    return data;
  } catch (err) {
    if (!isBannerApiMissing(err)) throw err;
    const patch = {
      bannerImage: body.imageUrl,
      name: body.title,
      tagline: body.subtitle,
      sortOrder: body.sortOrder,
      isActive: body.isActive,
    };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
    return patchAdminPackage(id, patch);
  }
}

/** @param {string} id */
export async function deleteStandaloneBanner(id) {
  try {
    const { data } = await adminApi.delete(`/admin/banners/${encodeURIComponent(id)}`);
    return data;
  } catch (err) {
    if (!isBannerApiMissing(err)) throw err;
    try {
      return await deleteAdminPackage(id);
    } catch {
      return patchAdminPackage(id, { bannerImage: "", isActive: false });
    }
  }
}

/** Lấy toàn bộ gói (phân trang). */
export async function listAllAdminPackages() {
  const limit = 100;
  let page = 1;
  let total = Infinity;
  const all = [];

  while ((page - 1) * limit < total) {
    const data = await listAdminPackages({ page, limit });
    const items = data.items ?? [];
    total = data.total ?? items.length;
    all.push(...items);
    if (items.length < limit) break;
    page += 1;
  }
  return all;
}

/**
 * @returns {Promise<{ items: import('../types/admin').AdminBannerListItem[] }>}
 */
export async function fetchAdminBannerCatalog() {
  const apiRes = await listAdminBannersApi();
  const packages = await listAllAdminPackages();
  const apiIds = new Set(
    (apiRes?.items ?? []).map((b) => String(b.id ?? b._id)).filter(Boolean)
  );

  /** @type {import('../types/admin').AdminBannerListItem[]} */
  const items = [];

  if (apiRes?.items?.length) {
    for (const b of apiRes.items) {
      const image = pickImage(b);
      if (!image?.trim()) continue;
      items.push({
        kind: "standalone",
        id: String(b.id ?? b._id),
        image,
        title: b.title ?? b.name ?? "Banner",
        subtitle: b.subtitle ?? b.tagline ?? "",
        sortOrder: b.sortOrder ?? 0,
        isActive: b.isActive !== false,
        packageId: b.packageId ? String(b.packageId) : undefined,
      });
    }
  }

  for (const p of packages) {
    const image = p.bannerImage?.trim();
    if (!image) continue;
    const pid = String(p.id ?? p._id);
    if (apiIds.has(pid)) continue;

    const bannerOnly = isBannerOnlyPackage(p);
    items.push({
      kind: bannerOnly ? "standalone" : "package",
      id: pid,
      packageId: bannerOnly ? undefined : pid,
      image,
      title: p.name ?? p.code ?? "Gói",
      subtitle: p.tagline ?? "",
      sortOrder: p.sortOrder ?? 0,
      isActive: p.isActive !== false,
      code: p.code,
      type: p.type,
      bannerOnly,
    });
  }

  items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return { items };
}

/**
 * @param {string} packageId
 * @param {string} bannerImageUrl
 * @param {{ sortOrder?: number; isActive?: boolean }} [opts]
 */
export async function savePackageBanner(packageId, bannerImageUrl, opts = {}) {
  const body = { bannerImage: bannerImageUrl };
  if (opts.sortOrder != null) body.sortOrder = opts.sortOrder;
  if (opts.isActive != null) body.isActive = opts.isActive;
  return patchAdminPackage(packageId, body);
}

/** @param {File} file */
export async function uploadBannerImage(file) {
  return uploadAdminImage(file, BANNER_FOLDER);
}

/** @param {string} packageId */
export async function removePackageBanner(packageId) {
  return patchAdminPackage(packageId, { bannerImage: "" });
}

/** @param {import('../types/admin').AdminBannerListItem} item */
export async function removeBannerItem(item) {
  if (item.kind === "package" && item.packageId) {
    return removePackageBanner(item.packageId);
  }
  return deleteStandaloneBanner(item.id);
}
