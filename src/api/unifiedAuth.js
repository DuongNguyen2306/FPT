import { rawApi } from "../lib/apiClient.js";
import { applyLoginResponse } from "../lib/applyLoginResponse.js";

/**
 * Đăng nhập một cửa — BE tự nhận admin hoặc khách.
 * @param {{ account: string; password: string }} body
 */
export async function loginUnified(body) {
  const { data } = await rawApi.post("/auth/login-unified", {
    account: body.account.trim(),
    password: body.password,
  });
  const role = applyLoginResponse(data);
  return { ...data, role };
}
