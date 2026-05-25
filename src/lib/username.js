/** Khớp backend: 3–32 ký tự, a-z 0-9 _ */
const USERNAME_REGEX = /^[a-z0-9_]{3,32}$/;

/**
 * @param {string} raw
 * @returns {string}
 */
export function normalizeUsername(raw) {
  return String(raw ?? "").trim().toLowerCase();
}

/**
 * @param {string} raw
 * @returns {boolean}
 */
export function isValidUsername(raw) {
  return USERNAME_REGEX.test(normalizeUsername(raw));
}

/**
 * @param {string} raw
 * @returns {string | null}
 */
export function validateUsernameMessage(raw) {
  const n = normalizeUsername(raw);
  if (!n) return "Vui lòng nhập tên đăng nhập.";
  if (!USERNAME_REGEX.test(n)) {
    return "Tên đăng nhập: 3–32 ký tự, chỉ chữ thường, số và dấu gạch dưới (_).";
  }
  return null;
}
