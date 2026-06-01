import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/adminAuth.js";
import { useAdminStore } from "../../stores/adminStore.js";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useAdminStore((s) => !!s.accessToken && !!s.admin);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuth) {
    const from = location.state?.from ?? "/admin/packages";
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const login = username.trim();
      if (!login) {
        setError("Vui lòng nhập tài khoản.");
        setLoading(false);
        return;
      }
      await loginAdmin({ email: login, password });
      const from = location.state?.from ?? "/admin/packages";
      navigate(from, { replace: true });
    } catch (err) {
      if (err?.code === "ERR_NETWORK" || err?.message === "Network Error") {
        setError("Không kết nối được máy chủ. Vui lòng thử lại sau.");
      } else {
        const msg = err?.response?.data?.message ?? err?.message;
        setError(typeof msg === "string" ? msg : "Đăng nhập thất bại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">FPT Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Đăng nhập quản trị</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          <div>
            <label htmlFor="admin-user" className="text-sm font-medium text-slate-700">
              Tài khoản
            </label>
            <input
              id="admin-user"
              type="text"
              autoComplete="username"
              placeholder="Tài khoản quản trị"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              required
            />
          </div>
          <div>
            <label htmlFor="admin-pass" className="text-sm font-medium text-slate-700">
              Mật khẩu
            </label>
            <input
              id="admin-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-secondary py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>
        <a href="/" className="mt-6 block text-center text-sm text-secondary hover:underline">
          ← Về trang khách
        </a>
      </div>
    </div>
  );
}
