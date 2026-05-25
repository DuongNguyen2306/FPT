import { api } from "../lib/apiClient.js";

export function getMe() {
  return api.get("/me");
}

/** @param {{ fullName?: string; defaultAddress?: string; email?: string | null }} body */
export function patchMe(body) {
  return api.patch("/me", body);
}

/** @param {{ page?: number; limit?: number }} [params] */
export function getMyLeads(params) {
  return api.get("/me/leads", { params });
}
