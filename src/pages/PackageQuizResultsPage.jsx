import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Home, RotateCcw } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import OfferCard from "../components/OfferCard.jsx";
import ZaloChatFab from "../components/ZaloChatFab.jsx";
import { fetchPackagesCatalog } from "../lib/packagesCatalog.js";
import { mapPackageToProductPlan } from "../lib/mapPackageFromApi.ts";
import {
  PACKAGE_TYPE_HOME_HASH,
  PACKAGE_TYPE_LABELS,
} from "../lib/packageQuizConstants.js";
import { packageDetailPath } from "../lib/packageRoutes.js";
import { registrationPath } from "../lib/registrationRoutes.js";
import { getZaloUrl } from "../lib/env.js";

const gridPackages =
  "grid grid-cols-1 place-items-center gap-6 sm:-mx-4 sm:flex sm:snap-x sm:snap-mandatory sm:gap-6 sm:overflow-x-auto sm:px-4 sm:pb-3 sm:scrollbar-hide md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-3";

/**
 * @param {import('../types/api').PackageDto & { recommendedType?: string }} dto
 */
function mapQuizPackageCard(dto) {
  const type = dto.recommendedType ?? dto.type ?? "INTERNET";
  return {
    ...mapPackageToProductPlan(dto, type),
    recommendedType: type,
  };
}

export default function PackageQuizResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  /** @type {import('../types/api').PackageQuizRecommendResult | undefined} */
  const stateResult = location.state?.result;

  const recommendedTypes = useMemo(() => {
    if (stateResult?.recommendedTypes?.length) return stateResult.recommendedTypes;
    const raw = searchParams.get("types");
    return raw ? raw.split(",").map((t) => t.trim()).filter(Boolean) : [];
  }, [stateResult, searchParams]);

  const primaryType =
    stateResult?.primaryType ?? searchParams.get("primary") ?? recommendedTypes[0] ?? "";

  const [filterType, setFilterType] = useState(null);
  const activeFilter = filterType ?? null;

  const catalogItems = useMemo(() => {
    if (stateResult?.packages?.length) {
      return stateResult.packages.map(mapQuizPackageCard);
    }
    return null;
  }, [stateResult]);

  const [fallbackItems, setFallbackItems] = useState(/** @type {ReturnType<typeof mapQuizPackageCard>[] | null} */ (null));
  const [loadingFallback, setLoadingFallback] = useState(false);

  useEffect(() => {
    if (catalogItems?.length) {
      setFallbackItems(null);
      setLoadingFallback(false);
      return;
    }
    if (!recommendedTypes.length) {
      setFallbackItems([]);
      setLoadingFallback(false);
      return;
    }
    let cancelled = false;
    setLoadingFallback(true);
    (async () => {
      try {
        const catalog = await fetchPackagesCatalog();
        if (cancelled) return;
        /** @type {Record<string, import('../types/api').PackageDto[]>} */
        const byType = {
          SPEEDX: catalog.speedx,
          INTERNET: catalog.internet,
          FPT_PLAY: catalog.play,
          CAMERA: catalog.camera,
          SERVICE: catalog.service,
        };
        const seen = new Set();
        const merged = [];
        for (const type of recommendedTypes) {
          for (const dto of byType[type] ?? []) {
            const id = String(dto.id ?? dto._id ?? dto.code ?? "");
            const key = `${id}:${type}`;
            if (seen.has(key)) continue;
            seen.add(key);
            merged.push(mapQuizPackageCard({ ...dto, recommendedType: type }));
          }
        }
        setFallbackItems(merged);
      } catch {
        if (!cancelled) setFallbackItems([]);
      } finally {
        if (!cancelled) setLoadingFallback(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [catalogItems, recommendedTypes]);

  const allItems = catalogItems ?? fallbackItems ?? [];
  const filtered = activeFilter
    ? allItems.filter((p) => p.recommendedType === activeFilter)
    : allItems;

  const rankings = stateResult?.rankings ?? [];
  const chips =
    rankings.length > 0
      ? rankings.map((r) => ({ type: r.packageType, label: r.label }))
      : recommendedTypes.map((t) => ({
          type: t,
          label: PACKAGE_TYPE_LABELS[t] ?? t,
        }));

  const message =
    stateResult?.message ??
    (recommendedTypes.length
      ? `Gợi ý: ${recommendedTypes.map((t) => PACKAGE_TYPE_LABELS[t] ?? t).join(", ")}.`
      : "Chưa có kết quả tư vấn.");

  const homeSectionHash =
    PACKAGE_TYPE_HOME_HASH[primaryType] ?? PACKAGE_TYPE_HOME_HASH.INTERNET;

  const openRegister = (pkgId) => {
    navigate(registrationPath({ packageId: pkgId, from: "/ket-qua-tu-van" }));
  };

  const openDetail = (pkg) => {
    const path = packageDetailPath({ code: pkg.code, id: pkg.id });
    if (path && path !== "/") navigate(path);
  };

  return (
    <div className="flex min-h-screen flex-col bg-light pb-24">
      <Navbar onOpenLogin={() => navigate("/login")} onOpenLead={() => navigate("/dang-ky")} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-center text-2xl font-bold text-secondary sm:text-3xl">
          Gói phù hợp với bạn
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[#0066b3] sm:text-base">
          {message}
        </p>

        {chips.length > 0 ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setFilterType(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                !activeFilter
                  ? "bg-secondary text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              Tất cả ({allItems.length})
            </button>
            {chips.map((c) => (
              <button
                key={c.type}
                type="button"
                onClick={() => setFilterType(c.type === activeFilter ? null : c.type)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  activeFilter === c.type
                    ? "bg-primary text-white"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        ) : null}

        {loadingFallback ? (
          <div className="mt-12 grid place-items-center gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 w-full max-w-sm animate-pulse rounded-3xl bg-white" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className={`mt-10 ${gridPackages} items-stretch`}>
            {filtered.map((item) => (
              <div key={`${item.id}-${item.recommendedType ?? ""}`} className="relative w-full max-w-sm">
                {item.recommendedType ? (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-secondary/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    {PACKAGE_TYPE_LABELS[item.recommendedType] ?? item.recommendedType}
                  </span>
                ) : null}
                <OfferCard
                  item={item}
                  variant="grid"
                  onRegister={openRegister}
                  onViewDetails={openDetail}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
            <p className="text-slate-600">
              Chưa có gói hiển thị cho bộ lọc này. Xem thêm trên trang chủ hoặc liên hệ tư vấn.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={{ pathname: "/", hash: homeSectionHash.replace(/^#/, "") }}
                className="rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
              >
                Xem thêm trên trang chủ
              </Link>
              <a
                href={getZaloUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Chat Zalo tư vấn
              </a>
            </div>
          </div>
        )}

        {!stateResult && !loadingFallback && allItems.length === 0 ? (
          <p className="mt-8 text-center text-sm text-slate-500">
            <Link to="/tu-van-goi" className="font-semibold text-secondary hover:underline">
              Làm lại khảo sát
            </Link>{" "}
            để nhận gợi ý gói cụ thể.
          </p>
        ) : null}
      </main>

      <Footer />
      <ZaloChatFab />

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Home className="h-4 w-4" aria-hidden />
            Trang chủ
          </Link>
          <Link
            to="/tu-van-goi"
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Làm lại tư vấn
          </Link>
        </div>
      </div>
    </div>
  );
}
