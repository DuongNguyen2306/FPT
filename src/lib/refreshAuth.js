import { rawApi } from "./apiClient.js";
import { applyLoginResponse } from "./applyLoginResponse.js";
import { hasAdminApiSession } from "./authRole.js";
import { useAdminStore } from "../stores/adminStore.js";
import { useAuthStore } from "../stores/authStore.js";

let refreshPromise = null;

/**
 * POST /auth/refresh (cookie) — cập nhật đúng store theo role/kind.
 */
export async function refreshAuthSession() {
  const { data } = await rawApi.post("/auth/refresh");
  const role = applyLoginResponse(data);

  if (!role && data?.accessToken) {
    if (hasAdminApiSession()) {
      useAdminStore.getState().setAccessToken(data.accessToken);
    } else if (useAuthStore.getState().user) {
      useAuthStore.getState().setAccessToken(data.accessToken);
    }
  }

  return data;
}

export function refreshAuthSessionOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshAuthSession().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}
