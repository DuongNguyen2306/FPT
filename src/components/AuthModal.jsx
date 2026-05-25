import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { loginCustomer, registerCustomer } from "../api/authApi.js";
import { normalizeUsername, validateUsernameMessage } from "../lib/username.js";

export default function AuthModal({ open, onClose, defaultTab = "login" }) {
  const titleId = useId();
  const [tab, setTab] = useState(defaultTab);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTab(defaultTab);
      setError("");
      setLoading(false);
    }
  }, [open, defaultTab]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleUsernameChange = (e) => {
    const v = e.target.value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 32);
    setUsername(v);
    if (error) setError("");
  };

  const messageFromAxios = (err) => {
    const msg =
      err?.response?.data?.message ??
      err?.response?.data?.error ??
      err?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
    return "Đã có lỗi xảy ra. Vui lòng thử lại.";
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    const ue = validateUsernameMessage(username);
    if (ue) {
      setError(ue);
      return;
    }
    if (!password) {
      setError("Vui lòng nhập mật khẩu.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await loginCustomer({
        username: normalizeUsername(username),
        password,
      });
      onClose?.();
    } catch (err) {
      setError(messageFromAxios(err));
    } finally {
      setLoading(false);
    }
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    const ue = validateUsernameMessage(username);
    if (ue) {
      setError(ue);
      return;
    }
    if (!fullName.trim()) {
      setError("Vui lòng nhập họ tên.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Mật khẩu tối thiểu 8 ký tự.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await registerCustomer({
        username: normalizeUsername(username),
        password,
        fullName: fullName.trim(),
      });
      onClose?.();
    } catch (err) {
      setError(messageFromAxios(err));
    } finally {
      setLoading(false);
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center">
          <motion.button
            type="button"
            aria-label="Đóng"
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 id={titleId} className="text-lg font-bold text-slate-800">
                Tài khoản khách hàng
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex border-b border-slate-100 px-5">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setError("");
                }}
                className={`flex-1 rounded-t-xl py-2.5 text-sm font-semibold ${
                  tab === "login"
                    ? "bg-light text-secondary"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setError("");
                }}
                className={`flex-1 rounded-t-xl py-2.5 text-sm font-semibold ${
                  tab === "register"
                    ? "bg-light text-secondary"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Đăng ký
              </button>
            </div>

            {error ? (
              <p className="mx-5 mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}

            {tab === "login" ? (
              <form onSubmit={onSubmitLogin} className="space-y-4 px-5 py-5">
                <div>
                  <label htmlFor="auth-username" className="text-sm font-medium text-slate-700">
                    Tên đăng nhập
                  </label>
                  <input
                    id="auth-username"
                    value={username}
                    onChange={handleUsernameChange}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
                    placeholder="Tên đăng nhập của bạn"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label htmlFor="auth-pass" className="text-sm font-medium text-slate-700">
                    Mật khẩu
                  </label>
                  <input
                    id="auth-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
                    autoComplete="current-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95 disabled:opacity-60"
                >
                  {loading ? "Đang xử lý…" : "Đăng nhập"}
                </button>
              </form>
            ) : (
              <form onSubmit={onSubmitRegister} className="space-y-4 px-5 py-5">
                <div>
                  <label htmlFor="reg-fn" className="text-sm font-medium text-slate-700">
                    Họ và tên
                  </label>
                  <input
                    id="reg-fn"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="reg-auth-username" className="text-sm font-medium text-slate-700">
                    Tên đăng nhập
                  </label>
                  <input
                    id="reg-auth-username"
                    value={username}
                    onChange={handleUsernameChange}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
                    placeholder="Tên đăng nhập của bạn"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label htmlFor="reg-auth-pass" className="text-sm font-medium text-slate-700">
                    Mật khẩu
                  </label>
                  <input
                    id="reg-auth-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95 disabled:opacity-60"
                >
                  {loading ? "Đang xử lý…" : "Đăng ký"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
