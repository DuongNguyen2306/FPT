import { api } from "../lib/apiClient.js";

/**
 * @param {string} [type] INTERNET | SPEEDX | FPT_PLAY | CAMERA | SERVICE
 * @returns {Promise<import('../types/api').PackageDto[]>}
 */
export async function listPackages(type) {
  const params = type ? { type } : {};
  const { data } = await api.get("/packages", { params });
  return Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
}

/**
 * @param {string} id
 */
export async function getPackageById(id) {
  const { data } = await api.get(`/packages/${encodeURIComponent(id)}`);
  return data;
}

/**
 * @param {string} code
 */
export async function getPackageByCode(code) {
  const { data } = await api.get(`/packages/by-code/${encodeURIComponent(code)}`);
  return data;
}

/**
 * Chi tiết gói: ưu tiên by-code, fallback theo id nếu 404.
 * @param {{ code?: string; id?: string }} ref
 */
export async function fetchPackageDetail({ code, id }) {
  if (code) {
    try {
      return await getPackageByCode(code);
    } catch (err) {
      if (id && err?.response?.status === 404) {
        return getPackageById(id);
      }
      throw err;
    }
  }
  if (id) {
    return getPackageById(id);
  }
  throw new Error("Thiếu mã hoặc id gói");
}
