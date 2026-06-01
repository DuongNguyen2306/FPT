import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Check, Gauge, Info } from "lucide-react";
import { formatVnd } from "../lib/packageHelpers.js";
import {
  PACKAGE_CARD_CAROUSEL_WIDTH_CLASS,
  packageCardHeaderClass,
} from "../lib/packageCardLayout.js";

function HeaderVisual({ heroImage, accentImage, displayCode, tagline }) {
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
      {accentImage ? (
        <img
          src={accentImage}
          alt=""
          className="absolute bottom-3 right-3 z-[2] h-14 w-14 object-contain drop-shadow-md sm:h-16 sm:w-16"
          loading="lazy"
        />
      ) : null}
      <div className="relative z-[1] flex h-full flex-col justify-center px-4 pr-20">
        <p className="text-sm font-extrabold uppercase leading-tight tracking-wide text-white sm:text-base">
          {displayCode}
        </p>
        {tagline ? (
          <p className="mt-1 line-clamp-2 text-[0.65rem] font-medium leading-snug text-white/90 sm:text-xs">
            {tagline}
          </p>
        ) : null}
      </div>
    </>
  );
}

export default function ProductPlanCard({
  id,
  displayCode,
  name,
  tagline,
  promoBadge,
  heroImage,
  accentImage,
  price,
  priceNote = "/tháng",
  priceDisplay,
  specCaption = "Tốc độ (tải xuống / tải lên)",
  downloadMbps,
  uploadMbps,
  specLine,
  features,
  onRegister,
  onViewDetails,
  variant = "carousel",
}) {
  const list = Array.isArray(features) ? features : [];
  const strip = promoBadge?.trim();
  const hasSpeed = downloadMbps != null || uploadMbps != null;
  const down = downloadMbps ?? null;
  const up = uploadMbps ?? down;

  const widthClass =
    variant === "carousel"
      ? `h-full ${PACKAGE_CARD_CAROUSEL_WIDTH_CLASS} shrink-0`
      : variant === "grid"
        ? `h-full w-full min-w-[min(92vw,23rem)] shrink-0 snap-center md:min-w-0`
        : "h-full w-full max-w-[23rem]";

  return (
    <motion.article
      layout
      className={`${widthClass} flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]`}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {strip ? (
        <div className="bg-[#1e2a5a] px-3 py-2 text-center">
          <p className="text-[0.7rem] font-semibold leading-snug text-white sm:text-xs">{strip}</p>
        </div>
      ) : null}

      {onViewDetails ? (
        <button
          type="button"
          onClick={() => onViewDetails()}
          className={`${packageCardHeaderClass} block w-full text-left transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2`}
          aria-label={`Xem chi tiết gói ${name}`}
        >
          <HeaderVisual
            heroImage={heroImage}
            accentImage={accentImage}
            displayCode={displayCode}
            tagline={tagline}
          />
        </button>
      ) : (
        <div className={packageCardHeaderClass}>
          <HeaderVisual
            heroImage={heroImage}
            accentImage={accentImage}
            displayCode={displayCode}
            tagline={tagline}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold text-slate-900">{name}</h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-1">
          {priceDisplay ? (
            <span className="text-xl font-extrabold text-[#0066b3] sm:text-2xl">{priceDisplay}</span>
          ) : typeof price === "number" ? (
            <>
              <span className="text-xl font-extrabold text-[#0066b3] sm:text-2xl">
                {formatVnd(price)}
              </span>
              {priceNote ? (
                <span className="text-sm font-medium text-slate-500">{priceNote}</span>
              ) : null}
            </>
          ) : (
            <span className="text-lg font-bold text-slate-700">Liên hệ</span>
          )}
          <button
            type="button"
            className="ml-0.5 rounded-full p-0.5 text-slate-400 hover:text-[#0066b3]"
            aria-label="Thông tin giá"
          >
            <Info className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] font-medium text-slate-500">{specCaption}</p>
            {hasSpeed ? (
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-bold text-slate-800">
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
              </p>
            ) : specLine ? (
              <p className="mt-0.5 text-sm font-bold text-slate-800">{specLine}</p>
            ) : (
              <p className="mt-0.5 text-sm text-slate-500">—</p>
            )}
          </div>
          <Gauge className="h-9 w-9 shrink-0 text-primary/80" strokeWidth={1.25} />
        </div>

        <ul className="mt-3 flex-1 space-y-1.5">
          {list.map((line) => (
            <li key={line} className="flex gap-2 text-[0.8125rem] leading-snug text-slate-700">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-emerald-600">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-col gap-2">
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
            className="w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-[#0066b3] transition hover:bg-slate-200"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </motion.article>
  );
}
