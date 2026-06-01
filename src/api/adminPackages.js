import { adminApi } from "../lib/adminClient.js";
import { buildPackageFormData } from "../lib/buildPackageFormData.js";
import { ADMIN_UPLOAD_TIMEOUT_MS, uploadAdminImage } from "./adminUploads.js";

const BANNER_FOLDER = "telecom-packages/banners";
const PRODUCT_FOLDER = "telecom-packages/products";
const MODEM_FOLDER = "telecom-packages/modems";

/**
 * @param {Record<string, unknown>} [params]
 */
export async function listAdminPackages(params) {
  const { data } = await adminApi.get("/admin/packages", { params });
  return data;
}

/** BE giới hạn limit ≤ 100 — gom nhiều trang khi cần load hết cho admin UI. */
export async function fetchAllAdminPackages(filters = {}) {
  const pageSize = 100;
  let page = 1;
  let total = Infinity;
  const all = [];

  while ((page - 1) * pageSize < total) {
    const data = await listAdminPackages({ ...filters, page, limit: pageSize });
    const items = data.items ?? [];
    total = typeof data.total === "number" ? data.total : items.length;
    all.push(...items);
    if (items.length < pageSize) break;
    page += 1;
  }

  return all;
}

/**
 * Tìm gói trong list admin (hỗ trợ gói isActive: false).
 * @param {string} id
 */
export async function findAdminPackageById(id) {
  const limit = 100;
  let page = 1;
  let total = Infinity;

  while ((page - 1) * limit < total) {
    const data = await listAdminPackages({ page, limit });
    const items = data.items ?? [];
    total = data.total ?? items.length;
    const hit = items.find((p) => String(p.id ?? p._id) === id);
    if (hit) return hit;
    if (items.length < limit) break;
    page += 1;
  }
  return null;
}

/** @param {Record<string, unknown>} body */
export async function createAdminPackage(body) {
  const { data } = await adminApi.post("/admin/packages", body);
  return data;
}

/**
 * Tạo gói + upload ảnh hero/accent một lần (multipart).
 * @param {import('../types/admin').PackageFormValues} values
 * @param {{ heroFile?: File | null; accentFile?: File | null; heroImageUrl?: string }} files
 */
export async function createAdminPackageWithImage(values, files = {}) {
  const form = buildPackageFormData(values, files);
  const { data } = await adminApi.post("/admin/packages/with-image", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: ADMIN_UPLOAD_TIMEOUT_MS,
  });
  return data;
}

/**
 * Fallback: upload từng ảnh rồi POST JSON.
 * @param {import('../types/admin').PackageFormValues} values
 * @param {{ heroFile?: File | null; accentFile?: File | null }} files
 * @param {Record<string, unknown>} jsonBody
 */
export async function createAdminPackageTwoStep(values, files, jsonBody) {
  let bannerImage = jsonBody.bannerImage;
  let heroImage = jsonBody.heroImage;
  let accentImage = jsonBody.accentImage;

  if (files.bannerFile) {
    const up = await uploadAdminImage(files.bannerFile, BANNER_FOLDER);
    bannerImage = up.url;
  }
  if (files.heroFile) {
    const up = await uploadAdminImage(files.heroFile, PRODUCT_FOLDER);
    heroImage = up.url;
  }
  if (files.accentFile) {
    const up = await uploadAdminImage(files.accentFile, MODEM_FOLDER);
    accentImage = up.url;
  }

  return createAdminPackage({
    ...jsonBody,
    bannerImage,
    heroImage,
    imageUrl: heroImage,
    accentImage,
  });
}

/**
 * @param {import('../types/admin').PackageFormValues} values
 * @param {{ heroFile?: File | null; accentFile?: File | null; heroImageUrl?: string }} files
 * @param {Record<string, unknown>} jsonBody
 */
export async function createAdminPackageSmart(values, files, jsonBody) {
  const hasLocalFiles = !!(files.bannerFile || files.heroFile || files.accentFile);
  if (hasLocalFiles) {
    try {
      return await createAdminPackageWithImage(values, files);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404 || status === 405 || status === 501) {
        return createAdminPackageTwoStep(values, files, jsonBody);
      }
      throw err;
    }
  }
  return createAdminPackage(jsonBody);
}

/** @param {string} id @param {Record<string, unknown>} body */
export async function patchAdminPackage(id, body) {
  const { data } = await adminApi.patch(`/admin/packages/${encodeURIComponent(id)}`, body);
  return data;
}

/** Soft delete — isActive: false */
export async function deleteAdminPackage(id) {
  const { data } = await adminApi.delete(`/admin/packages/${encodeURIComponent(id)}`);
  return data;
}
