import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { registerCustomer } from "../api/authApi.js";
import { loginUnified } from "../api/unifiedAuth.js";
import { useAuthStore } from "../stores/authStore.js";
import { useAdminStore } from "../stores/adminStore.js";
import { getPostLoginPath } from "../lib/applyLoginResponse.js";
import { hasAdminApiSession } from "../lib/authRole.js";
import { normalizeUsername, validateUsernameMessage } from "../lib/username.js";
import { friendlyApiError } from "../lib/userFacingText.js";

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0056a3] focus:ring-2 focus:ring-[#0056a3]/15";

const RIPPLE_SIZES = [
  { w: 320, h: 380, opacity: 0.55 },
  { w: 480, h: 560, opacity: 0.4 },
  { w: 640, h: 720, opacity: 0.28 },
  { w: 800, h: 900, opacity: 0.18 },
  { w: 960, h: 1080, opacity: 0.1 },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const customerToken = useAuthStore((s) => s.accessToken);
  const customerUser = useAuthStore((s) => s.user);
  const adminToken = useAdminStore((s) => s.accessToken);
  const adminUser = useAdminStore((s) => s.admin);

  const searchRole = new URLSearchParams(location.search).get("role");
  const isAdminRequired =
    searchRole === "admin" ||
    location.state?.role === "ADMIN" ||
    String(location.state?.from ?? "").startsWith("/admin");

  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = useMemo(() => {
    if (typeof location.state?.from === "string") return location.state.from;
    return "/";
  }, [location.state]);

  const showRegister = !isAdminRequired;

  const canSubmit =
    mode === "login"
      ? account.trim().length > 0 && password.length > 0
      : fullName.trim().length > 0 &&
        account.trim().length > 0 &&
        password.length >= 8 &&
        !validateUsernameMessage(account);

  const registerHint = useMemo(() => {
    if (mode !== "register") return null;
    if (!fullName.trim()) return "Nhập họ và tên để bật nút Đăng ký.";
    const userErr = validateUsernameMessage(account);
    if (userErr) return userErr;
    if (password.length < 8) return "Mật khẩu cần ít nhất 8 ký tự.";
    return null;
  }, [mode, fullName, account, password]);

  if (hasAdminApiSession() || (adminToken && adminUser)) {
    return <Navigate to="/admin/packages" replace />;
  }
  if (customerToken && customerUser) {
    return <Navigate to="/" replace />;
  }

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setLoading(false);
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    const login = normalizeUsername(account) || account.trim();
    if (!login || !password) return;

    setLoading(true);
    setError("");
    try {
      const data = await loginUnified({ account: login, password: password.trim() });
      const path = getPostLoginPath(data.role, { from, adminOnly: isAdminRequired });
      if (!path) {
        useAuthStore.getState().clearSession();
        useAdminStore.getState().clear();
        setError("Tài khoản này không có quyền quản trị.");
        return;
      }
      navigate(path, { replace: true });
    } catch (err) {
      setError(friendlyApiError(err, "Sai tài khoản hoặc mật khẩu."));
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    const usernameError = validateUsernameMessage(account);
    if (usernameError) {
      setError(usernameError);
      return;
    }
    if (!fullName.trim() || !password || password.length < 8) return;

    setLoading(true);
    setError("");
    try {
      await registerCustomer({
        username: normalizeUsername(account),
        password,
        fullName: fullName.trim(),
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(friendlyApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const submitLabel =
    loading ? "Đang xử lý…" : mode === "login" ? "Tiếp tục" : "Đăng ký";

  return (
    <div className="login-page-bg relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {RIPPLE_SIZES.map((ring) => (
          <span
            key={ring.w}
            className="login-ripple-ring"
            style={{
              width: ring.w,
              height: ring.h,
              opacity: ring.opacity,
            }}
          />
        ))}
        <span className="absolute left-1/2 top-[18%] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-emerald-400 shadow-sm" />
        <span className="absolute left-[22%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#0056a3]/70" />
        <span className="absolute right-[22%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#0056a3]/70" />
      </div>

      <Link
        to="/"
        className="absolute right-6 top-6 z-20 flex items-center gap-2 sm:right-10 sm:top-8"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-600 text-xs font-extrabold text-white shadow-md">
          FPT
        </span>
        <span className="text-sm font-semibold tracking-tight text-[#1e2a5a]">FPT Telecom</span>
      </Link>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-[420px] rounded-3xl bg-white px-8 py-10 shadow-[0_8px_40px_rgba(0,86,163,0.12)] sm:px-10 sm:py-12">
          <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.65rem]">
            {mode === "login" ? "Đăng nhập" : "Đăng ký"}
          </h1>

          {isAdminRequired && mode === "login" ? (
            <p className="mt-4 text-center text-sm text-slate-600">
              Đăng nhập tài khoản quản trị.
            </p>
          ) : null}

          {showRegister ? (
            <div className="mt-6 flex justify-center gap-6 border-b border-slate-100 pb-px">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`pb-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "border-b-2 border-[#0056a3] text-[#0056a3]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`pb-2 text-sm font-semibold transition ${
                  mode === "register"
                    ? "border-b-2 border-[#0056a3] text-[#0056a3]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Đăng ký
              </button>
            </div>
          ) : (
            <div className="mt-6" />
          )}

          {mode === "login" ? (
            <form onSubmit={submitLogin} className="mt-6 space-y-5">
              <div>
                <label htmlFor="login-account" className="text-sm text-slate-600">
                  Tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  id="login-account"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className={inputClass}
                  placeholder="Nhập tài khoản"
                  autoComplete="username"
                />
              </div>
              <div>
                <label htmlFor="login-pass" className="text-sm text-slate-600">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  id="login-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                />
              </div>
              {error ? (
                <p className="rounded-xl bg-red-50 px-3 py-2.5 text-center text-sm text-red-700">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className={`w-full rounded-xl py-3.5 text-sm font-semibold text-white transition ${
                  canSubmit && !loading
                    ? "bg-[#0056a3] shadow-md hover:bg-[#004a8c]"
                    : "cursor-not-allowed bg-slate-300"
                }`}
              >
                {submitLabel}
              </button>
            </form>
          ) : (
            <form onSubmit={submitRegister} className="mt-6 space-y-5">
              <div>
                <label htmlFor="reg-name" className="text-sm text-slate-600">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder="Nhập họ và tên"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="reg-user" className="text-sm text-slate-600">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-user"
                  value={account}
                  onChange={(e) =>
                    setAccount(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 32))
                  }
                  className={inputClass}
                  placeholder="Chọn tên đăng nhập (chữ và số)"
                  autoComplete="username"
                />
              </div>
              <div>
                <label htmlFor="reg-pass" className="text-sm text-slate-600">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Tối thiểu 8 ký tự"
                  autoComplete="new-password"
                />
              </div>
              {registerHint && !canSubmit ? (
                <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-center text-sm text-amber-900">
                  {registerHint}
                </p>
              ) : null}
              {error ? (
                <p className="rounded-xl bg-red-50 px-3 py-2.5 text-center text-sm text-red-700">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className={`w-full rounded-xl py-3.5 text-sm font-semibold text-white transition ${
                  canSubmit && !loading
                    ? "bg-[#0056a3] shadow-md hover:bg-[#004a8c]"
                    : "cursor-not-allowed bg-slate-300"
                }`}
              >
                {submitLabel}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
            Bằng việc tiếp tục, bạn đồng ý với{" "}
            <a href="/" className="font-medium text-[#0056a3] hover:underline">
              Điều khoản
            </a>{" "}
            và{" "}
            <a href="/" className="font-medium text-[#0056a3] hover:underline">
              Chính sách bảo mật
            </a>{" "}
            của chúng tôi.
          </p>

          <Link
            to="/"
            className="mt-4 block text-center text-sm font-medium text-[#0056a3] hover:underline"
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
