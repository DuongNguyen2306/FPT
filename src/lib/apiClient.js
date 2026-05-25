import axios from "axios";
import { getApiBaseUrl } from "./env.js";
import { refreshAuthSessionOnce } from "./refreshAuth.js";
import { useAuthStore } from "../stores/authStore.js";

const baseURL = getApiBaseUrl();

/** Client không interceptor refresh — dùng cho login-unified, refresh, logout. */
export const rawApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/** API khách: /packages, /leads, /me — Bearer từ authStore (chỉ khi có user khách). */
export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

function isPublicAuthUrl(url) {
  return (
    url.includes("/auth/register") ||
    url.includes("/auth/login") ||
    url.includes("/auth/login-unified") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout") ||
    url.includes("/admin/auth/login")
  );
}

api.interceptors.request.use((config) => {
  const url = String(config.url ?? "");
  if (!isPublicAuthUrl(url)) {
    const { accessToken, user } = useAuthStore.getState();
    if (user && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = String(originalRequest?.url ?? "");

    if (
      status !== 401 ||
      originalRequest?._retry ||
      isPublicAuthUrl(url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshAuthSessionOnce();
      const { accessToken, user } = useAuthStore.getState();
      if (user && accessToken) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return api(originalRequest);
    } catch {
      useAuthStore.getState().clearSession();
      return Promise.reject(error);
    }
  }
);
