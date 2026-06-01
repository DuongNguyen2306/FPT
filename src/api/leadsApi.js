import { api } from "../lib/apiClient.js";

/**
 * @param {import('../types/api').LeadCreateBody} body
 * @returns {Promise<import('../types/api').LeadCreateResponse>}
 */
export async function createLead(body) {
  const { data } = await api.post("/leads", body);
  return data;
}

/**
 * Tra cứu lịch sử đăng ký theo SĐT (không cần đăng nhập).
 * @param {string} phone
 * @returns {Promise<{ phone: string; total: number; items: import('../types/api').LeadPublicItem[] }>}
 */
export async function fetchLeadHistoryByPhone(phone) {
  const { data } = await api.get("/leads/history", { params: { phone } });
  return data;
}

/**
 * @param {string} id
 * @param {string} phone
 * @returns {Promise<import('../types/api').LeadPublicItem>}
 */
export async function fetchLeadHistoryDetail(id, phone) {
  const { data } = await api.get(`/leads/history/${id}`, { params: { phone } });
  return data;
}
