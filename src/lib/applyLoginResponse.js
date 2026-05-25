import { useAdminStore } from "../stores/adminStore.js";
import { useAuthStore } from "../stores/authStore.js";
import { getRoleFromAuthPayload, isAdminRole } from "./authRole.js";

/**
 * Lưu phiên sau POST /auth/login-unified hoặc /auth/refresh.
 * @param {Record<string, unknown>} data
 * @returns {'ADMIN' | 'CUSTOMER' | null}
 */
export function applyLoginResponse(data) {
  const role = getRoleFromAuthPayload(data);
  const token = data?.accessToken;

  if (isAdminRole(role) && token) {
    const admin = data.admin ?? data.user;
    useAuthStore.getState().clearSession();
    useAdminStore.getState().setSession(String(token), admin);
    return "ADMIN";
  }

  if (role === "CUSTOMER" && token && data?.user) {
    useAdminStore.getState().clear();
    useAuthStore.getState().setCustomerSession(String(token), data.user);
    return "CUSTOMER";
  }

  return null;
}

/**
 * @param {'ADMIN' | 'CUSTOMER' | null} role
 * @param {{ from?: string; adminOnly?: boolean }} opts
 * @returns {string | null} null = adminOnly nhưng user là khách
 */
export function getPostLoginPath(role, opts = {}) {
  const from = typeof opts.from === "string" ? opts.from : "/";

  if (role === "ADMIN") {
    return from.startsWith("/admin") ? from : "/admin/packages";
  }

  if (role === "CUSTOMER") {
    if (opts.adminOnly) return null;
    return from.startsWith("/admin") ? "/" : from || "/";
  }

  return "/login";
}
