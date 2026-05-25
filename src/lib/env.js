/** @returns {string} */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL;
  if (typeof raw === "string" && raw.trim()) {
    return raw.replace(/\/+$/, "");
  }
  return "http://localhost:3000/api/v1";
}
