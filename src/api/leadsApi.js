import { api } from "../lib/apiClient.js";

/**
 * @param {import('../types/api').LeadCreateBody} body
 * @returns {Promise<import('../types/api').LeadCreateResponse>}
 */
export async function createLead(body) {
  const { data } = await api.post("/leads", body);
  return data;
}
