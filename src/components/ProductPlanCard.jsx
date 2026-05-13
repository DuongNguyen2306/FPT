import { motion } from "framer-motion";
import { Camera, Check, Gauge, Info, Sparkles, Tv, Wifi } from "lucide-react";

const STAT_ICONS = {
  gauge: Gauge,
  tv: Tv,
  camera: Camera,
  sparkles: Sparkles,
  wifi: Wifi,
};

function formatPrice(vnd) {
  return new Intl.NumberFormat("vi-VN").format(vnd) + "đ";
}

const defaultPromo = "Giảm 50k khi thanh toán Online +";

/**
 * Thẻ gói thống nhất (layout SpeedX): nền cam, badge xanh, ảnh, giá xanh, ô thông số, checklist, 2 nút.
 * @param {'scroll' | 'grid'} variant — scroll: width cố định cho carousel; grid: full ô lưới
 */
export default function ProductPlanCard({
  id,
  displayCode,
  name,
  tagline,
  promoBadge,
  heroImage,
  accentImage,
  price,
  priceNote,
  priceDisplay,
  specCaption,
  specLine,
  statIcon = "gauge",
  features,
  onRegister,
  variant = "grid",
}) {
  const Icon = STAT_ICONS[statIcon] ?? Gauge;
  const badgeText = promoBadge?.trim() || defaultPromo;
  const list = Array.isArray(features) ? features : [];

  const articleClass =
    variant === "scroll"
      ? "w-[min(100%,20rem)] shrink-0 snap-start"
      : "h-full w-full min-w-0";

  return (
    <motion.article
      layout
      className={`${articleClass} flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md ring-1 ring-slate-100/80`}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="relative overflow-hidden bg-fpt text-white">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="absolute left-3 top-3 z-10 max-w-[11rem] sm:max-w-[14rem]">
          <span className="inline-block rounded bg-fpt-blue px-2 py-1 text-[0.65rem] font-bold leading-tight text-white shadow-sm">
            {badgeText}
          </span>
        </div>

        <div className="flex gap-3 px-4 pb-5 pt-14 sm:px-5 sm:pb-6 sm:pt-16">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black leading-tight tracking-tight sm:text-xl">{displayCode}</h3>
            <p className="mt-2 text-[0.7rem] font-medium leading-relaxed text-white/95 sm:text-xs">{tagline}</p>
          </div>

          <div className="relative h-[7.25rem] w-[6.5rem] shrink-0 sm:h-[7.75rem] sm:w-[7rem]">
            <img
              src={heroImage}
              alt=""
              className="h-full w-full rounded-lg object-cover shadow-lg ring-2 ring-white/30"
            />
            <div className="absolute -bottom-1 -right-1 flex h-16 w-16 items-center justify-center rounded-lg bg-white p-1 shadow-lg ring-2 ring-white/50">
              <img src={accentImage} alt="" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h4 className="text-base font-bold text-slate-900 sm:text-lg">{name}</h4>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {priceDisplay ? (
            <span className="text-2xl font-extrabold tracking-tight text-blue-600 sm:text-[1.65rem]">
              {priceDisplay}
            </span>
          ) : typeof price === "number" ? (
            <>
              <span className="text-2xl font-extrabold tracking-tight text-blue-600 sm:text-[1.65rem]">
                {formatPrice(price)}
              </span>
              {priceNote ? (
                <span className="text-sm font-medium text-slate-500">{priceNote}</span>
              ) : null}
              <button
                type="button"
                className="inline-flex rounded-full p-1 text-blue-600 hover:bg-blue-50"
                title="Thông tin giá minh họa"
                aria-label="Thông tin giá"
              >
                <Info className="h-4 w-4" strokeWidth={2} />
              </button>
            </>
          ) : (
            <span className="text-xl font-bold text-slate-700">Liên hệ</span>
          )}
        </div>

        <div className="mt-4 flex items-stretch justify-between gap-3 rounded-xl bg-slate-100 px-3 py-3">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">
              {specCaption}
            </p>
            <p className="mt-1 text-sm font-bold leading-snug text-slate-800 sm:text-base">{specLine}</p>
          </div>
          <div className="flex shrink-0 items-center">
            <Icon className="h-10 w-10 text-fpt sm:h-11 sm:w-11" strokeWidth={1.5} />
          </div>
        </div>

        <ul className="mt-4 flex-1 space-y-2">
          {list.map((line) => (
            <li key={line} className="flex gap-2 text-xs text-slate-700 sm:text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="leading-snug">{line}</span>
            </li>
          ))}
        </ul>

        <div
          className={
            variant === "grid"
              ? "mt-auto flex flex-col gap-2 pt-5"
              : "mt-5 flex flex-col gap-2"
          }
        >
          <button
            type="button"
            onClick={() => onRegister(id)}
            className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Đăng ký ngay
          </button>
          <button
            type="button"
            className="w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-slate-200"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </motion.article>
  );
}
