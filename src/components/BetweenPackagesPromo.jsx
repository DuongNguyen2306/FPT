import { Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Thanh ưu đãi đặt giữa hai loại gói: Internet và Truyền hình (FPT Play).
 */
export default function BetweenPackagesPromo({ onPickCombo }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl border-2 border-amber-200/50 bg-gradient-to-r from-fpt via-orange-600 to-[#b91c1c] px-5 py-7 text-white shadow-xl ring-1 ring-white/15 sm:px-8 sm:py-8"
    >
      <div className="pointer-events-none absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-amber-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-8 top-0 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex flex-col items-stretch gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left lg:items-center">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-inner ring-1 ring-white/40">
            <Sparkles className="h-7 w-7 text-amber-100" strokeWidth={1.75} />
          </span>
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-100 sm:text-sm">
              Ưu đãi nổi bật
            </p>
            <p className="mt-1 text-sm font-semibold leading-snug sm:text-base">
              Giảm thêm khi đăng ký online & chọn gói combo — kết hợp Internet tốc độ cao với FPT Play cho cả nhà.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:shrink-0">
          <a
            href="tel:19006600"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-bold text-fpt-blue shadow-md transition hover:bg-white sm:w-auto"
          >
            <Phone className="h-4 w-4 shrink-0" />
            1900 6600
          </a>
          {onPickCombo ? (
            <button
              type="button"
              onClick={onPickCombo}
              className="w-full rounded-full border-2 border-white/70 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:w-auto"
            >
              Xem Combo Internet + TV
            </button>
          ) : null}
        </div>
      </div>
    </motion.aside>
  );
}
