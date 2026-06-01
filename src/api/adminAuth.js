import { adminApi } from "../lib/adminClient.js";
import { applyLoginResponse } from "../lib/applyLoginResponse.js";
import { logoutAll } from "../lib/logoutAuth.js";
import { rawApi } from "../lib/apiClient.js";

/** @deprecated Dùng loginUnified — giữ cho tương thích cũ. */
export async function getAdminMe() {
  const { data } = await adminApi.get("/admin/auth/me");
  return data;
}

/**
 * Đăng nhập admin — BE nhận field `email` (có thể là username admin1).
 * @param {{ email: string; password: string }} body
 */
export async function loginAdmin(body) {
  const { data } = await rawApi.post("/admin/auth/login", {
    email: body.email.trim(),
    password: body.password,
  });
  applyLoginResponse({ ...data, role: data.role ?? "ADMIN" });
  return data;
}

export async function logoutAdmin() {
  await logoutAll();
}
