import { motion } from "framer-motion";
import { Check, Gauge } from "lucide-react";
import { formatVnd } from "../lib/packageHelpers.js";

/**
 * Thẻ SpeedX theo mẫu FPT: ảnh dọc trái (~40%), nội dung trắng phải (~60%), không dải khuyến mãi trên đỉnh.
 */
export default function SpeedXCard({ item, onRegister, onViewDetails }) {
  const list = Array.isArray(item.features) ? item.features : [];

  return (
    <motion.article
      layout
      initial={false}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="flex w-[min(92vw,22.5rem)] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft sm:w-[23.5rem] md:min-h-[26rem] md:w-[26rem] md:flex-row lg:w-[27.5rem]"
    >
      {/* Ảnh lifestyle — full chiều cao cột trái */}
      <div className="relative h-52 w-full shrink-0 overflow-hidden bg-gradient-to-br from-[#0066b3] to-[#1e3799] md:h-auto md:min-h-[280px] md:w-[40%]">
        {item.heroImage ? (
          <img
            src={item.heroImage}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/25 to-transparent md:bg-gradient-to-r" />
      </div>

      {/* Nội dung — nền trắng */}
      <div className="flex min-w-0 flex-1 flex-col bg-white p-5 md:w-[60%] md:py-6 md:pl-5 md:pr-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500">
          {item.displayCode}
        </p>
        <h3 className="mt-1.5 text-lg font-bold leading-tight text-secondary sm:text-xl">
          {item.shortName}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{item.tagline}</p>

        <div className="mt-4 flex flex-wrap items-baseline gap-x-1 gap-y-0">
          <span className="text-2xl font-extrabold tracking-tight text-secondary sm:text-[1.75rem]">
            {typeof item.price === "number" ? formatVnd(item.price) : "Liên hệ"}
          </span>
          <span className="text-sm font-medium text-slate-500">/tháng</span>
        </div>

        <div className="mt-5 flex gap-3 rounded-2xl bg-light px-3 py-3">
          <Gauge className="mt-0.5 h-9 w-9 shrink-0 text-primary" strokeWidth={1.5} />
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
              {item.specCaption}
            </p>
            <p className="mt-1 text-sm font-bold leading-snug text-secondary sm:text-base">
              {item.specLine}
            </p>
          </div>
        </div>

        <ul className="mt-4 flex-1 space-y-2">
          {list.map((line) => (
            <li key={line} className="flex gap-2 text-xs text-slate-700 sm:text-[0.8125rem]">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="leading-snug">{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onRegister(item.id)}
            className="w-full rounded-2xl bg-secondary py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            Đăng ký ngay
          </button>
          <button
            type="button"
            onClick={() => onViewDetails?.(item)}
            className="w-full rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-secondary transition hover:bg-slate-200"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </motion.article>
  );
}
