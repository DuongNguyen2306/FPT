import { create } from "zustand";

const CUSTOMER_KEY = "fpt_customer_session";

function readJson(key) {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const initialCustomer = readJson(CUSTOMER_KEY);

export const useAuthStore = create((set, get) => ({
  accessToken: initialCustomer?.accessToken ?? null,
  user: initialCustomer?.user ?? null,

  setCustomerSession(accessToken, user) {
    sessionStorage.removeItem("fpt_admin_session");
    sessionStorage.removeItem("adminAccessToken");
    const payload = { accessToken, user };
    sessionStorage.setItem(CUSTOMER_KEY, JSON.stringify(payload));
    set({ accessToken, user });
  },

  setAccessToken(accessToken) {
    const { user } = get();
    if (user) {
      sessionStorage.setItem(CUSTOMER_KEY, JSON.stringify({ accessToken, user }));
      set({ accessToken });
    } else {
      set({ accessToken });
    }
  },

  clearSession() {
    sessionStorage.removeItem(CUSTOMER_KEY);
    set({ accessToken: null, user: null });
  },
}));
