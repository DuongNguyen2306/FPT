import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Check, ChevronRight, Home, Router } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import PackageDetailHero from "../components/packageDetail/PackageDetailHero.jsx";
import PackageStatCards from "../components/packageDetail/PackageStatCards.jsx";
import PackagePrivilegesSection from "../components/packageDetail/PackagePrivilegesSection.jsx";
import { fetchPackageDetail } from "../api/packagesApi.js";
import { mapDtoToDetailView } from "../lib/mapPackageFromApi.ts";
import { formatVnd } from "../lib/packageHelpers.js";
import Footer from "../components/Footer.jsx";
import { registrationPath } from "../lib/registrationRoutes.js";

const TYPE_BREADCRUMB = {
  INTERNET: { section: "Internet Wifi", href: "/#internet" },
  SPEEDX: { section: "SpeedX", href: "/#internet" },
  FPT_PLAY: { section: "Truyền hình", href: "/#truyen-hinh" },
  CAMERA: { section: "Camera", href: "/#camera" },
  SERVICE: { section: "Dịch vụ", href: "/#dich-vu" },
};

export default function PackageDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { code, id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const raw = await fetchPackageDetail({ code, id });
        if (!cancelled) setDetail(mapDtoToDetailView(raw));
      } catch (e) {
        if (!cancelled) {
          const msg = e?.response?.data?.message ?? e?.message;
          setError(typeof msg === "string" ? msg : "Không tải được thông tin gói.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, id]);

  const breadcrumb = TYPE_BREADCRUMB[detail?.type ?? "INTERNET"] ?? TYPE_BREADCRUMB.INTERNET;
  const equipmentItems = detail?.includedEquipment ?? [];
  const privileges = detail?.privileges ?? [];

  const openRegister = () => {
    if (!detail?.id) return;
    navigate(
      registrationPath({
        packageId: detail.id,
        from: location.pathname + location.search,
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Navbar
        onOpenLogin={() => navigate("/login")}
        onOpenLead={openRegister}
      />

      <div className="border-b border-slate-100 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center gap-1.5 px-4 py-3 text-sm text-slate-500 sm:px-6">
          <Link to="/" className="inline-flex items-center text-[#0066b3] hover:underline">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link to={breadcrumb.href} className="hover:text-[#0066b3] hover:underline">
            {breadcrumb.section}
          </Link>
          {detail ? (
            <>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span className="font-medium text-slate-800">{detail.name}</span>
            </>
          ) : null}
        </nav>
      </div>

      {loading ? (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="h-52 animate-pulse rounded-none bg-slate-300" />
          <div className="mx-auto mt-10 h-10 w-2/3 max-w-md animate-pulse rounded bg-slate-200" />
          <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
          <p className="text-red-600">{error}</p>
          <Link to="/" className="mt-4 inline-block font-medium text-[#0066b3] hover:underline">
            Về trang chủ
          </Link>
        </div>
      ) : detail ? (
        <>
          <PackageDetailHero
            type={detail.type}
            heroHeadline={detail.heroHeadline ?? detail.displayCode}
            heroImage={detail.heroImage}
            accentImage={detail.accentImage}
            lifestyleImageUrl={detail.lifestyleImageUrl}
          />

          <div className="relative z-10 -mt-2 pb-32 pt-4">
            <PackageStatCards
              name={detail.name}
              price={detail.price}
              downloadMbps={detail.downloadMbps}
              uploadMbps={detail.uploadMbps}
              specLine={detail.specLine}
              maxDevices={detail.maxDevices}
            />

            {detail.detailBullets.length > 0 || detail.promoBadge ? (
              <section className="mx-auto mt-8 max-w-5xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:mt-10 sm:p-8">
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">Thông tin chi tiết</h3>
                {detail.detailBullets.length > 0 ? (
                  <ul className="mt-5 space-y-4">
                    {detail.detailBullets.map((line) => (
                      <li
                        key={line}
                        className="flex gap-3 text-sm leading-relaxed text-slate-700 sm:text-base"
                      >
                        <Check
                          className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                          strokeWidth={2.5}
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {detail.promoBadge ? (
                  <p className="mt-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    {detail.promoBadge}
                  </p>
                ) : null}
              </section>
            ) : null}

            {equipmentItems.length > 0 ? (
              <section className="mx-auto mt-8 max-w-5xl sm:mt-10">
                <h3 className="px-4 text-xl font-bold text-slate-900 sm:px-0 sm:text-2xl">
                  Nhận thêm trong gói này
                </h3>
                <div
                  className={`mt-5 px-4 sm:px-0 ${
                    equipmentItems.length === 1
                      ? "flex justify-center"
                      : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {equipmentItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-100 bg-white px-6 py-8 text-center shadow-sm"
                    >
                      <div className="flex h-36 w-full items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="max-h-full max-w-[10rem] object-contain"
                          />
                        ) : detail.accentImage ? (
                          <img
                            src={detail.accentImage}
                            alt=""
                            className="max-h-full max-w-[10rem] object-contain"
                          />
                        ) : (
                          <Router className="h-20 w-20 text-slate-300" strokeWidth={1} />
                        )}
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-800">{item.label}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {privileges.length > 0 ? (
              <div className="mx-auto mt-8 max-w-5xl px-4 sm:mt-10 sm:px-0">
                <PackagePrivilegesSection
                  privileges={privileges}
                  lifestyleImageUrl={detail.lifestyleImageUrl}
                  heroImage={detail.heroImage}
                  onRegister={openRegister}
                />
              </div>
            ) : null}

            {detail.tagline ? (
              <p className="mx-auto mt-8 max-w-5xl px-4 text-center text-sm text-slate-600 sm:px-0">
                {detail.tagline}
              </p>
            ) : null}
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/95 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
            <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
              {detail.heroImage ? (
                <img
                  src={detail.heroImage}
                  alt=""
                  className="hidden h-11 w-11 rounded-lg border border-slate-100 object-cover sm:block"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900 sm:text-base">
                  {detail.name}
                </p>
                {typeof detail.price === "number" ? (
                  <p className="text-xs text-slate-500 sm:hidden">
                    {formatVnd(detail.price)}/tháng
                  </p>
                ) : null}
              </div>
              {typeof detail.price === "number" ? (
                <span className="hidden shrink-0 text-xl font-extrabold text-[#0066b3] sm:inline">
                  {formatVnd(detail.price)}
                </span>
              ) : null}
              <button
                type="button"
                onClick={openRegister}
                className="shrink-0 rounded-lg bg-[#0066b3] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0056a3] sm:px-8 sm:py-3"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </>
      ) : null}

      <Footer />
    </div>
  );
}
