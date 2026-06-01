import { api } from "../lib/apiClient.js";

/**
 * FAQ công khai (chỉ isVisible trên BE).
 * @returns {Promise<{ items: import('../types/api').FaqPublicItem[] }>}
 */
export async function listPublicFaqs() {
  try {
    const { data } = await api.get("/faqs");
    const items = Array.isArray(data) ? data : data?.items ?? [];
    return { items };
  } catch (err) {
    if (err?.response?.status === 404) return { items: [] };
    throw err;
  }
}
