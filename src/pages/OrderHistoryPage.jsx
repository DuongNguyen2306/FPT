import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { History, Search } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ZaloChatFab from "../components/ZaloChatFab.jsx";
import LeadOrderCard from "../components/leads/LeadOrderCard.jsx";
import { fetchLeadHistoryByPhone } from "../api/leadsApi.js";
import { useAuthStore } from "../stores/authStore.js";
import { normalizeVNPhone, validateVNPhoneMessage } from "../lib/phone.js";
import { friendlyApiError } from "../lib/userFacingText.js";
import { normalizeLeadItem } from "../lib/leadStatus.js";
import { registrationPath } from "../lib/registrationRoutes.js";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [searchParams] = useSearchParams();
  const [phoneInput, setPhoneInput] = useState(() => searchParams.get("phone") ?? "");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const lookup = useCallback(async (raw) => {
    const msg = validateVNPhoneMessage(raw);
    if (msg) {
      setPhoneError(msg);
      return;
    }
    setPhoneError("");
    setError("");
    setLoading(true);
    try {
      const normalized = normalizeVNPhone(raw);
      const data = await fetchLeadHistoryByPhone(normalized || String(raw).trim());
      const items = (data.items ?? [])
        .map((item) => normalizeLeadItem(item))
        .filter(Boolean);
      setResult({ ...data, items });
    } catch (err) {
      setResult(null);
      const status = err?.response?.status;
      if (status === 429) {
        setError("Bạn tra cứu quá nhiều lần. Vui lòng thử lại sau vài phút.");
      } else {
        setError(friendlyApiError(err, "Không tra cứu được. Vui lòng thử lại."));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await lookup(phoneInput);
  };

  useEffect(() => {
    const fromUrl = searchParams.get("phone");
    if (fromUrl && validateVNPhoneMessage(fromUrl) === null) {
      lookup(fromUrl);
    }
  }, [searchParams, lookup]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-slate-50">
      <Navbar
        onOpenLogin={() => navigate("/login", { state: { from: "/tra-cuu-don" } })}
        onOpenLead={() => navigate(registrationPath({ from: "/tra-cuu-don" }))}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <History className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-secondary sm:text-3xl">
            Tra cứu đơn đăng ký
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Nhập số điện thoại bạn đã dùng khi đăng ký — không cần đăng nhập.
          </p>
        </div>

        {!user ? (
          <p className="mb-6 rounded-xl border border-slate-100 bg-white px-4 py-3 text-center text-sm text-slate-600 shadow-soft">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              state={{ from: "/don-cua-toi" }}
              className="font-semibold text-primary hover:underline"
            >
              Đăng nhập
            </Link>{" "}
            để xem đơn gắn với tài khoản.
          </p>
        ) : (
          <p className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-center text-sm text-slate-700">
            Bạn đã đăng nhập — xem đơn gửi khi có tài khoản tại{" "}
            <Link to="/don-cua-toi" className="font-semibold text-primary hover:underline">
              Đơn của tôi
            </Link>
            .
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8"
        >
          <label htmlFor="lookup-phone" className="block text-sm font-semibold text-slate-700">
            Số điện thoại
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="lookup-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="VD: 0912345678"
              value={phoneInput}
              onChange={(e) => {
                setPhoneInput(e.target.value);
                if (phoneError) setPhoneError("");
              }}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-primary/30 focus:border-primary focus:ring-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-60"
            >
              <Search className="h-4 w-4" aria-hidden />
              {loading ? "Đang tra cứu…" : "Tra cứu"}
            </button>
          </div>
          {phoneError ? <p className="mt-2 text-sm text-red-600">{phoneError}</p> : null}
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </form>

        {result ? (
          <section className="mt-8" aria-live="polite">
            <p className="mb-4 text-sm text-slate-600">
              Tìm thấy <strong>{result.total}</strong> đơn với SĐT{" "}
              <strong className="text-secondary">{result.phone}</strong>
            </p>
            {result.items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-soft">
                Chưa có đơn đăng ký nào với số này.
              </div>
            ) : (
              <ul className="space-y-4">
                {result.items.map((item) => (
                  <li key={item.id}>
                    <LeadOrderCard order={item} showPhone={false} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}

        <p className="mt-10 text-center text-sm text-slate-500">
          <Link to="/" className="font-semibold text-primary hover:underline">
            Về trang chủ
          </Link>
        </p>
      </main>
      <Footer />
      <ZaloChatFab />
    </div>
  );
}
