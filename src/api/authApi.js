import { api } from "../lib/apiClient.js";
import { logoutAll } from "../lib/logoutAuth.js";
import { useAuthStore } from "../stores/authStore.js";
import { useAdminStore } from "../stores/adminStore.js";

/**
 * @param {{ username: string; password: string; fullName: string; email?: string }} body
 */
export async function registerCustomer(body) {
  const { data } = await api.post("/auth/register", body);
  useAdminStore.getState().clear();
  useAuthStore.getState().setCustomerSession(data.accessToken, data.user);
  return data;
}

export async function logoutCustomer() {
  await logoutAll();
}
