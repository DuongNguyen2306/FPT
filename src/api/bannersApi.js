import { api } from "../lib/apiClient.js";

/**
 * Banner carousel công khai (không gắn gói hoặc BE trả cả hai loại).
 */
export async function listPublicBanners() {
  try {
    const { data } = await api.get("/banners");
    const items = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
    return items.filter((b) => b && (b.imageUrl || b.bannerImage));
  } catch (err) {
    if (err?.response?.status === 404) return [];
    throw err;
  }
}
