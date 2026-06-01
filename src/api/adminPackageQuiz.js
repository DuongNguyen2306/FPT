import { adminApi } from "../lib/adminClient.js";

const PACKAGE_TYPES = ["INTERNET", "SPEEDX", "FPT_PLAY", "CAMERA", "SERVICE"];

export { PACKAGE_TYPES };

export async function listAdminPackageQuizzes() {
  const { data } = await adminApi.get("/admin/package-quiz");
  const items = Array.isArray(data) ? data : data?.items ?? [];
  return { items, total: data?.total ?? items.length };
}

export async function getAdminPackageQuiz(id) {
  const { data } = await adminApi.get(`/admin/package-quiz/${encodeURIComponent(id)}`);
  return data;
}

/** @param {Record<string, unknown>} body */
export async function createAdminPackageQuiz(body) {
  const { data } = await adminApi.post("/admin/package-quiz", body);
  return data;
}

/** @param {string} id @param {Record<string, unknown>} body */
export async function updateAdminPackageQuiz(id, body) {
  const { data } = await adminApi.put(`/admin/package-quiz/${encodeURIComponent(id)}`, body);
  return data;
}

export async function deleteAdminPackageQuiz(id) {
  const { data } = await adminApi.delete(`/admin/package-quiz/${encodeURIComponent(id)}`);
  return data;
}

/** Trọng số mặc định khi thêm option mới */
export function defaultTypeWeights() {
  return {
    INTERNET: 0,
    SPEEDX: 0,
    FPT_PLAY: 0,
    CAMERA: 0,
    SERVICE: 0,
  };
}
