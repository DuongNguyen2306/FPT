import { api } from "../lib/apiClient.js";
import { adminApi } from "../lib/adminClient.js";

/** @returns {Promise<{ items: import('../types/api').NavigationMenuGroup[] }>} */
export async function listPublicNavigation() {
  try {
    const { data } = await api.get("/navigation");
    const items = Array.isArray(data) ? data : data?.items ?? [];
    return { items };
  } catch (err) {
    if (err?.response?.status === 404) return { items: [] };
    throw err;
  }
}

export async function listAdminNavigation() {
  const { data } = await adminApi.get("/admin/navigation");
  const items = Array.isArray(data) ? data : data?.items ?? [];
  return { items, total: data?.total ?? items.length };
}

export async function getAdminNavigation(id) {
  const { data } = await adminApi.get(`/admin/navigation/${id}`);
  return data;
}

/** @param {Record<string, unknown>} body */
export async function createAdminNavigation(body) {
  const { data } = await adminApi.post("/admin/navigation", body);
  return data;
}

/** @param {string} id @param {Record<string, unknown>} body */
export async function updateAdminNavigation(id, body) {
  const { data } = await adminApi.put(`/admin/navigation/${id}`, body);
  return data;
}

/** @param {string} id @param {Record<string, unknown>} body */
export async function patchAdminNavigation(id, body) {
  const { data } = await adminApi.patch(`/admin/navigation/${id}`, body);
  return data;
}

/** @param {string[]} ids */
export async function reorderAdminNavigation(ids) {
  const { data } = await adminApi.patch("/admin/navigation/reorder", { ids });
  return data;
}

export async function deleteAdminNavigation(id) {
  const { data } = await adminApi.delete(`/admin/navigation/${id}`);
  return data;
}
