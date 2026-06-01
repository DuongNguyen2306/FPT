/** SĐT Zalo tư vấn mặc định (định dạng 0xxxxxxxxx) */
export const DEFAULT_ZALO_PHONE = "0909137605";

/** Link chat Zalo chuẩn: https://zalo.me/{số} */
export const DEFAULT_ZALO_CHAT_URL = `https://zalo.me/${DEFAULT_ZALO_PHONE}`;

/**
 * Chuẩn hóa link chat Zalo (không dùng id.zalo.me/login).
 * @param {string} input
 * @returns {string}
 */
export function normalizeZaloChatUrl(input) {
  const trimmed = String(input ?? "").trim();
  if (!trimmed) return DEFAULT_ZALO_CHAT_URL;

  if (/id\.zalo\.me/i.test(trimmed)) {
    return DEFAULT_ZALO_CHAT_URL;
  }

  const meMatch = trimmed.match(/zalo\.me\/(\d{9,11})/i);
  if (meMatch) {
    return `https://zalo.me/${meMatch[1]}`;
  }

  const digitsOnly = trimmed.replace(/\D/g, "");
  if (
    digitsOnly.length >= 9 &&
    digitsOnly.length <= 11 &&
    !/^https?:\/\//i.test(trimmed)
  ) {
    const local = digitsOnly.startsWith("84")
      ? `0${digitsOnly.slice(2)}`
      : digitsOnly;
    return `https://zalo.me/${local}`;
  }

  const zaloScheme = trimmed.match(/zalo:\/\/[^?]*\?.*phone=(\d+)/i) ?? trimmed.match(/zalo:\/\/.*?(\d{9,11})/i);
  if (zaloScheme?.[1]) {
    return `https://zalo.me/${zaloScheme[1]}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return DEFAULT_ZALO_CHAT_URL;
}

/** @returns {string} */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL;
  if (typeof raw === "string" && raw.trim()) {
    return raw.replace(/\/+$/, "");
  }
  return "https://webfpt-be.onrender.com/api/v1";
}

/**
 * Link mở chat Zalo (app hoặc web) — luôn dạng https://zalo.me/0909137605
 * Cấu hình: VITE_ZALO_URL=https://zalo.me/0909137605 hoặc chỉ 0909137605
 * @returns {string}
 */
export function getZaloUrl() {
  const raw = import.meta.env.VITE_ZALO_URL;
  if (typeof raw === "string" && raw.trim()) {
    return normalizeZaloChatUrl(raw.trim());
  }
  return DEFAULT_ZALO_CHAT_URL;
}
