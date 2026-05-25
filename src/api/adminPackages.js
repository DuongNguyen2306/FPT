import { adminApi } from "../lib/adminClient.js";
import { buildPackageFormData } from "../lib/buildPackageFormData.js";
import { uploadAdminImage } from "./adminUploads.js";

/**
 * @param {Record<string, unknown>} [params]
 */
export async function listAdminPackages(params) {
  const { data } = await adminApi.get("/admin/packages", { params });
  return data;
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
  let heroImage = jsonBody.heroImage;
  let accentImage = jsonBody.accentImage;

  if (files.heroFile) {
    const up = await uploadAdminImage(files.heroFile, "telecom-packages/heroes");
    heroImage = up.url;
  }
  if (files.accentFile) {
    const up = await uploadAdminImage(files.accentFile, "telecom-packages/modems");
    accentImage = up.url;
  }

  return createAdminPackage({
    ...jsonBody,
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
  const hasLocalFiles = !!(files.heroFile || files.accentFile);
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
  if (files.heroImageUrl || jsonBody.heroImage) {
    return createAdminPackageWithImage(values, {
      ...files,
      heroImageUrl: files.heroImageUrl || String(jsonBody.heroImage ?? ""),
    });
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
