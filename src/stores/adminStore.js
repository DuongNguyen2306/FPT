import { create } from "zustand";

const ADMIN_KEY = "fpt_admin_session";
export const ADMIN_TOKEN_KEY = "adminAccessToken";

function readSession() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const initial = readSession();
if (initial?.accessToken && typeof sessionStorage !== "undefined") {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, initial.accessToken);
}

export const useAdminStore = create((set, get) => ({
  accessToken: initial?.accessToken ?? null,
  admin: initial?.admin ?? null,

  setSession(accessToken, admin) {
    sessionStorage.removeItem("fpt_customer_session");
    sessionStorage.setItem(ADMIN_KEY, JSON.stringify({ accessToken, admin }));
    sessionStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
    set({ accessToken, admin });
  },

  setAccessToken(accessToken) {
    const { admin } = get();
    sessionStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
    if (admin) {
      sessionStorage.setItem(ADMIN_KEY, JSON.stringify({ accessToken, admin }));
    }
    set({ accessToken });
  },

  clear() {
    sessionStorage.removeItem(ADMIN_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    set({ accessToken: null, admin: null });
  },

  isAuthenticated() {
    return !!get().accessToken && !!get().admin;
  },
}));
