import { ArrowDown, ArrowUp, Check, Gauge } from "lucide-react";
import {
  PACKAGE_CARD_MAX_WIDTH_CLASS,
  packageCardHeaderClass,
} from "../../lib/packageCardLayout.js";

/**
 * @param {number | null | undefined} price
 */
function formatPrice(price) {
  if (price == null || Number.isNaN(Number(price))) return null;
  return Number(price).toLocaleString("vi-VN");
}

function HeaderVisual({ heroImage, displayCode, tagline }) {
  return (
    <>
      {heroImage ? (
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />
      ) : null}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#0056a3]/90 via-[#0056a3]/50 to-transparent"
        aria-hidden
      />
      <div className="relative z-[1] flex h-full flex-col justify-center px-4 pr-14">
        {displayCode ? (
          <p className="text-sm font-extrabold uppercase leading-tight tracking-wide text-white sm:text-base">
            {displayCode}
          </p>
        ) : null}
        {tagline ? (
          <p className="mt-1 line-clamp-2 text-[0.65rem] font-medium leading-snug text-white/90 sm:text-xs">
            {tagline}
          </p>
        ) : null}
      </div>
    </>
  );
}

/**
 * @param {{
 *   id: string;
 *   name: string;
 *   displayCode?: string;
 *   tagline?: string;
 *   promoBadge?: string;
 *   heroImage?: string;
 *   price?: number;
 *   downloadMbps?: number;
 *   uploadMbps?: number;
 *   specLine?: string;
 *   features?: string[];
 *   onRegister?: (id: string) => void;
 *   onViewDetails?: () => void;
 *   previewMode?: boolean;
 * }} props
 */
export default function CompactPackageCard({
  id,
  name,
  displayCode,
  tagline,
  promoBadge,
  heroImage,
  price,
  downloadMbps,
  uploadMbps,
  specLine,
  features = [],
  onRegister,
  onViewDetails,
  previewMode = false,
}) {
  const strip = promoBadge?.trim();
  const list = (Array.isArray(features) ? features : []).slice(0, 3);
  const down = downloadMbps ?? null;
  const up = uploadMbps ?? down;
  const hasSpeed = down != null || up != null;
  const priceText = formatPrice(price);

  return (
    <article
      className={`group mx-auto flex h-full w-full ${PACKAGE_CARD_MAX_WIDTH_CLASS} shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:mx-0`}
    >
      {strip ? (
        <div className="bg-[#1e2a5a] px-3 py-1.5 text-center">
          <p className="line-clamp-1 text-[0.65rem] font-semibold text-white sm:text-xs">{strip}</p>
        </div>
      ) : null}

      {!previewMode && onViewDetails ? (
        <button
          type="button"
          onClick={() => onViewDetails()}
          className={`${packageCardHeaderClass} block w-full text-left transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2`}
          aria-label={`Xem chi tiết gói ${name}`}
        >
          <HeaderVisual heroImage={heroImage} displayCode={displayCode} tagline={tagline} />
        </button>
      ) : (
        <div className={packageCardHeaderClass}>
          <HeaderVisual heroImage={heroImage} displayCode={displayCode} tagline={tagline} />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900">{name}</h3>

          <div className="mt-2 flex items-baseline gap-0.5">
            {priceText != null ? (
              <>
                <span className="text-2xl font-extrabold text-[#0066b3]">{priceText}</span>
                <span className="text-sm font-medium text-slate-500">đ/tháng</span>
              </>
            ) : previewMode ? (
              <span className="text-lg font-bold text-slate-400">Giá tiền</span>
            ) : (
              <span className="text-lg font-bold text-slate-600">Liên hệ</span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
            <div className="min-w-0 flex-1 text-sm font-semibold text-slate-800">
              {hasSpeed ? (
                <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  {down != null ? (
                    <span className="inline-flex items-center gap-0.5">
                      <ArrowDown className="h-3.5 w-3.5 text-[#0066b3]" strokeWidth={2.5} />
                      {down} Mbps
                    </span>
                  ) : null}
                  {up != null ? (
                    <span className="inline-flex items-center gap-0.5">
                      <ArrowUp className="h-3.5 w-3.5 text-[#0066b3]" strokeWidth={2.5} />
                      {up} Mbps
                    </span>
                  ) : null}
                </span>
              ) : specLine ? (
                <span className="line-clamp-1">{specLine}</span>
              ) : (
                <span className="text-slate-400">—</span>
              )}
            </div>
            <Gauge className="h-8 w-8 shrink-0 text-[#0066b3]/70" strokeWidth={1.5} aria-hidden />
          </div>

          {list.length > 0 ? (
            <ul className="mt-3 space-y-1.5">
              {list.map((line) => (
                <li key={line} className="flex gap-2 text-xs leading-snug text-slate-600">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={3} />
                  <span className="line-clamp-1 min-w-0 flex-1">{line}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {!previewMode ? (
        <div className="flex flex-col gap-2 border-t border-slate-50 px-4 pb-4 pt-0">
          <button
            type="button"
            onClick={() => onRegister?.(id)}
            className="w-full rounded-xl bg-[#0066b3] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0056a3]"
          >
            Đăng ký ngay
          </button>
          <button
            type="button"
            onClick={() => onViewDetails?.()}
            className="w-full rounded-xl bg-gray-50 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-100"
          >
            Xem chi tiết
          </button>
        </div>
      ) : (
        <div className="border-t border-slate-50 px-4 pb-4 pt-3">
          <p className="text-center text-xs text-slate-400">Nút CTA — xem trên website</p>
        </div>
      )}
    </article>
  );
}
