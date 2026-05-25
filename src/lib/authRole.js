import { useAdminStore } from "../stores/adminStore.js";
import { useAuthStore } from "../stores/authStore.js";

/** @param {Record<string, unknown> | null | undefined} data */
export function getRoleFromAuthPayload(data) {
  if (!data) return null;
  const user = /** @type {{ role?: string }} */ (data.user);
  const admin = /** @type {{ role?: string }} */ (data.admin);
  const role = data.role ?? user?.role ?? admin?.role;
  return typeof role === "string" ? role.toUpperCase() : null;
}

/** @param {string | null | undefined} role */
export function isAdminRole(role) {
  return role === "ADMIN";
}

/** Có token admin hợp lệ cho API /admin/* (từ adminStore). */
export function hasAdminApiSession() {
  const token = useAdminStore.getState().accessToken;
  const admin = useAdminStore.getState().admin;
  return !!(token && admin);
}
