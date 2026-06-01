import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listPackagesCached } from "../../lib/packagesCatalog.js";
import { mapPackageToProductPlan } from "../../lib/mapPackageFromApi.ts";
import { friendlyApiError } from "../../lib/userFacingText.js";
import { isBannerOnlyPackage } from "../../lib/packageHelpers.js";
import CompactPackageCard from "./CompactPackageCard.jsx";
import PackageCardSkeleton from "./PackageCardSkeleton.jsx";
import { PACKAGE_LIST_TABS, filterPackagesByTab } from "./packageListTabs.js";

const SKELETON_COUNT = 4;

/**
 * Danh sách gói Internet dạng card nhỏ gọn + tab lọc.
 * @param {{
 *   onRegister?: (packageId: string) => void;
 *   onViewDetails?: (pkg: import('../../lib/mapPackageFromApi').ProductPlanItem) => void;
 *   packages?: import('../../lib/mapPackageFromApi').ProductPlanItem[];
 *   loading?: boolean;
 *   error?: string;
 *   selfFetch?: boolean;
 * }} props
 */
export default function PackageList({
  onRegister,
  onViewDetails,
  packages: packagesProp,
  loading: loadingProp,
  error: errorProp,
  selfFetch = true,
}) {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("personal");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(selfFetch);
  const [error, setError] = useState("");

  const loadPackages = useCallback(async () => {
    if (!selfFetch) return;
    setLoading(true);
    setError("");
    try {
      const raw = await listPackagesCached("INTERNET");
      const mapped = raw
        .filter((p) => !isBannerOnlyPackage(p))
        .map((p) => mapPackageToProductPlan(p, "INTERNET"));
      setPackages(mapped);
    } catch (err) {
      setError(friendlyApiError(err, "Không tải được danh sách gói."));
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, [selfFetch]);

  useEffect(() => {
    if (selfFetch) {
      loadPackages();
    }
  }, [selfFetch, loadPackages]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!tab) return;
    const valid = PACKAGE_LIST_TABS.some((t) => t.id === tab);
    if (valid) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (window.location.hash !== "#internet") return;
    const el = document.getElementById("internet");
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(t);
  }, [searchParams, activeTab]);

  const sourcePackages = selfFetch ? packages : (packagesProp ?? []);
  const isLoading = selfFetch ? loading : (loadingProp ?? false);
  const loadError = selfFetch ? error : (errorProp ?? "");

  const filtered = useMemo(
    () => filterPackagesByTab(sourcePackages, activeTab),
    [sourcePackages, activeTab]
  );

  return (
    <section className="py-6 sm:py-8" aria-labelledby="package-list-heading">
      <div className="mb-6 text-center sm:mb-8">
        <h2
          id="package-list-heading"
          className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl"
        >
          Khám phá gói Internet phù hợp với bạn
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Chọn danh mục để xem các gói cước được thiết kế riêng cho nhu cầu của bạn
        </p>
      </div>

      <div
        className="scrollbar-hide -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-2.5 sm:overflow-visible sm:px-0"
        role="tablist"
        aria-label="Danh mục gói cước"
      >
        {PACKAGE_LIST_TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                active
                  ? "border-[#2563eb] bg-[#2563eb] text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {loadError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center">
          <p className="text-sm text-red-700">{loadError}</p>
          {selfFetch ? (
            <button
              type="button"
              onClick={loadPackages}
              className="mt-3 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Thử lại
            </button>
          ) : null}
        </div>
      ) : null}

      {!loadError && isLoading ? (
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="flex h-full justify-center">
              <PackageCardSkeleton />
            </div>
          ))}
        </div>
      ) : null}

      {!loadError && !isLoading && filtered.length === 0 ? (
        <p className="py-14 text-center text-sm text-slate-500">
          Chưa có gói cho danh mục này.
        </p>
      ) : null}

      {!loadError && !isLoading && filtered.length > 0 ? (
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((pkg) => (
            <div key={pkg.id} className="flex h-full justify-center">
            <CompactPackageCard
              id={pkg.id}
              name={pkg.name}
              displayCode={pkg.displayCode}
              tagline={pkg.tagline}
              promoBadge={pkg.promoBadge}
              heroImage={pkg.heroImage}
              price={pkg.price}
              downloadMbps={pkg.downloadMbps}
              uploadMbps={pkg.uploadMbps}
              specLine={pkg.specLine}
              features={pkg.features}
              onRegister={onRegister}
              onViewDetails={() => onViewDetails?.(pkg)}
            />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
