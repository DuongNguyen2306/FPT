import { rawApi } from "./apiClient.js";
import { useAdminStore } from "../stores/adminStore.js";
import { useAuthStore } from "../stores/authStore.js";

/** POST /auth/logout + xóa cả phiên khách và admin. */
export async function logoutAll() {
  try {
    await rawApi.post("/auth/logout");
  } catch {
    /* vẫn xóa local */
  } finally {
    useAuthStore.getState().clearSession();
    useAdminStore.getState().clear();
  }
}
