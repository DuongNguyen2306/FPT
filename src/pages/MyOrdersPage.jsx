import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ZaloChatFab from "../components/ZaloChatFab.jsx";
import LeadOrderCard from "../components/leads/LeadOrderCard.jsx";
import { getMyLeads } from "../api/meApi.js";
import { useAuthStore } from "../stores/authStore.js";
import { normalizeLeadItem } from "../lib/leadStatus.js";
import { friendlyApiError } from "../lib/userFacingText.js";
import { registrationPath } from "../lib/registrationRoutes.js";

const PAGE_LIMIT = 20;

function LeadCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
      <div className="h-4 w-24 rounded bg-slate-200" />
      <div className="mt-4 space-y-3">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-4/5 rounded bg-slate-100" />
        <div className="h-3 w-3/5 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyLeads({ page, limit: PAGE_LIMIT });
      const normalized = (data.items ?? [])
        .map((doc) => normalizeLeadItem(doc))
        .filter(Boolean);
      setItems(normalized);
      setTotal(data.total ?? normalized.length);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        navigate("/login", { replace: true, state: { from: "/don-cua-toi" } });
        return;
      }
      setError(friendlyApiError(err, "Không tải được danh sách đơn."));
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, navigate]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: "/don-cua-toi" }} />;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-slate-50">
      <Navbar
        onOpenLogin={() => navigate("/login", { state: { from: "/don-cua-toi" } })}
        onOpenLead={() => navigate(registrationPath({ from: "/don-cua-toi" }))}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <ClipboardList className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-secondary sm:text-3xl">
            Đơn của tôi
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Các đơn bạn gửi khi đã đăng nhập tài khoản khách hàng.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-slate-700">
          Đơn đăng ký khi <strong>chưa đăng nhập</strong> không hiển thị ở đây.{" "}
          <Link to="/tra-cuu-don" className="font-semibold text-primary hover:underline">
            Tra cứu bằng số điện thoại
          </Link>
        </div>

        {error ? (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        {loading ? (
          <ul className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i}>
                <LeadCardSkeleton />
              </li>
            ))}
          </ul>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-soft">
            <p className="text-sm text-slate-600">
              Bạn chưa có đơn nào gửi khi đăng nhập.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/#internet"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
              >
                Đăng ký gói dịch vụ
              </Link>
              <Link
                to="/tra-cuu-don"
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tra cứu theo SĐT
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-600">
              Tổng <strong>{total}</strong> đơn
              {totalPages > 1 ? (
                <>
                  {" "}
                  — trang {page}/{totalPages}
                </>
              ) : null}
            </p>
            <ul className="space-y-4">
              {items.map((order) => (
                <li key={order.id}>
                  <LeadOrderCard order={order} showPhone />
                </li>
              ))}
            </ul>

            {total > PAGE_LIMIT ? (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </>
        )}
      </main>

      <Footer />
      <ZaloChatFab />
    </div>
  );
}
