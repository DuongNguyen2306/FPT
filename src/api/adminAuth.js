import { adminApi } from "../lib/adminClient.js";
import { logoutAll } from "../lib/logoutAuth.js";

/** @deprecated Dùng loginUnified — giữ cho tương thích cũ. */
export async function getAdminMe() {
  const { data } = await adminApi.get("/admin/auth/me");
  return data;
}

export async function logoutAdmin() {
  await logoutAll();
}
