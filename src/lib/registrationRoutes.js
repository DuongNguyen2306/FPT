/**
 * @param {{ packageId?: string; from?: string }} opts
 */
export function registrationPath({ packageId, from = "/" } = {}) {
  const params = new URLSearchParams();
  if (packageId) params.set("packageId", String(packageId));
  if (from && from !== "/") params.set("from", from);
  const q = params.toString();
  return q ? `/dang-ky?${q}` : "/dang-ky";
}
