/** Khớp backend: 0 + (3|5|7|8|9) + 8 chữ số (vd. 0794442282, 0912345678) */
const VN_PHONE_REGEX = /^0(3|5|7|8|9)\d{8}$/;

/**
 * Chuẩn hóa SĐT VN: bỏ khoảng trắng, +84 / 84 → 0.
 * @param {string} raw
 * @returns {string}
 */
export function normalizeVNPhone(raw) {
  let s = String(raw ?? "")
    .trim()
    .replace(/\s+/g, "");
  if (s.startsWith("+84")) {
    s = `0${s.slice(3)}`;
  } else if (s.startsWith("84") && s.length >= 10) {
    s = `0${s.slice(2)}`;
  }
  return s;
}

/**
 * @param {string} raw
 * @returns {boolean}
 */
export function isValidVNPhone(raw) {
  return VN_PHONE_REGEX.test(normalizeVNPhone(raw));
}

/**
 * @param {string} raw
 * @returns {string | null} lỗi hiển thị hoặc null nếu ok
 */
export function validateVNPhoneMessage(raw) {
  const n = normalizeVNPhone(raw);
  if (!n) return "Vui lòng nhập số điện thoại.";
  if (!VN_PHONE_REGEX.test(n)) {
    return "Số di động Việt Nam: 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09.";
  }
  return null;
}
