import { adminApi } from "../lib/adminClient.js";

/**
 * @param {Record<string, unknown>} [params]
 */
export async function listAdminLeads(params) {
  const { data } = await adminApi.get("/admin/leads", { params });
  return data;
}

/**
 * @param {string} id
 * @param {{ status?: string; adminNote?: string }} body
 */
export async function patchAdminLead(id, body) {
  const { data } = await adminApi.patch(`/admin/leads/${encodeURIComponent(id)}`, body);
  return data;
}

/**
 * @param {string} id
 * @param {{ packageName?: string; status?: string; adminNotes?: string; address?: string }} body
 */
export async function patchPackageRegistration(id, body) {
  const { data } = await adminApi.patch(
    `/admin/package-registrations/${encodeURIComponent(id)}`,
    body
  );
  return data;
}
