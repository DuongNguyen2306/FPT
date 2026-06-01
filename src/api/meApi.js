import { api } from "../lib/apiClient.js";

export function getMe() {
  return api.get("/me");
}

/** @param {{ fullName?: string; defaultAddress?: string; email?: string | null }} body */
export function patchMe(body) {
  return api.patch("/me", body);
}

/**
 * @param {{ page?: number; limit?: number }} [params]
 * @returns {Promise<import('../types/api').MyLeadsResponse>}
 */
export async function getMyLeads(params) {
  const { data } = await api.get("/me/leads", { params });
  return data;
}
