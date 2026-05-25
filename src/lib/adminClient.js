import axios from "axios";
import { getApiBaseUrl } from "./env.js";
import { refreshAuthSessionOnce } from "./refreshAuth.js";
import { useAdminStore, ADMIN_TOKEN_KEY } from "../stores/adminStore.js";

function getAdminBearer() {
  return (
    (typeof sessionStorage !== "undefined" ? sessionStorage.getItem(ADMIN_TOKEN_KEY) : null) ||
    useAdminStore.getState().accessToken
  );
}

const baseURL = getApiBaseUrl();

export const rawAdminApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/** API quản trị: /admin/* — Bearer chỉ từ adminStore. */
export const adminApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

function isPublicAuthUrl(url) {
  return (
    url.includes("/auth/login-unified") ||
    url.includes("/auth/register") ||
    url.includes("/auth/login") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout") ||
    url.includes("/admin/auth/login")
  );
}

adminApi.interceptors.request.use((config) => {
  const url = String(config.url ?? "");
  if (!isPublicAuthUrl(url)) {
    const token = getAdminBearer();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = String(originalRequest?.url ?? "");

    if (status === 403 && !isPublicAuthUrl(url)) {
      useAdminStore.getState().clear();
    }

    if (status !== 401 || originalRequest?._retry || isPublicAuthUrl(url)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshAuthSessionOnce();
      const newToken = getAdminBearer();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
      return adminApi(originalRequest);
    } catch {
      useAdminStore.getState().clear();
      return Promise.reject(error);
    }
  }
);
