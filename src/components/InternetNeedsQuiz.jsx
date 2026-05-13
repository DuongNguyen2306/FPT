import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  Gamepad2,
  Laptop,
  Shield,
  Tv,
  Wifi,
} from "lucide-react";

const OPTIONS = [
  {
    id: "work",
    label: "Làm việc/Học tập tại nhà/Cơ bản",
    Icon: Laptop,
  },
  {
    id: "family",
    label: "Gia đình/Giám sát/Bảo mật",
    Icon: Shield,
  },
  {
    id: "entertain",
    label: "Truyền hình/Giải trí/Thể thao",
    Icon: Tv,
  },
  {
    id: "gaming",
    label: "Gaming/Streaming",
    Icon: Gamepad2,
  },
];

export default function InternetNeedsQuiz() {
  const [picked, setPicked] = useState(() => new Set());

  const toggle = useCallback((id) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleContinue = () => {
    const el = document.getElementById("truyen-hinh");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const canContinue = picked.size > 0;

  return (
    <section className="relative isolate overflow-hidden py-14 sm:py-20">
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#9b1c3a] via-[#6e1028] to-[#3f0a16]"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(105deg, transparent, transparent 40px, rgba(251,191,36,0.06) 40px, rgba(251,191,36,0.06) 80px)",
        }}
        aria-hidden
      />
      <div
        className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-amber-400/25 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-rose-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-amber-200/40 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/25 bg-gradient-to-br from-white/15 to-white/[0.07] p-6 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:rounded-[2rem] sm:p-9 lg:p-10">
          <div
            className="pointer-events-none absolute -left-6 -top-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/30 to-fpt-blue/40 opacity-90 shadow-lg ring-2 ring-white/30 sm:h-28 sm:w-28"
            aria-hidden
          >
            <Wifi className="h-12 w-12 text-white drop-shadow-md sm:h-14 sm:w-14" strokeWidth={1.25} />
          </div>

          <div className="relative pt-10 text-center sm:pt-8">
            <p className="text-sm font-semibold tracking-wide text-amber-100/90 sm:text-base">
              Gói Internet dành cho bạn
            </p>

            <div className="mt-5 flex justify-center">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <span
                  className="absolute inset-0 rounded-full border-2 border-sky-300/50"
                  aria-hidden
                />
                <span className="absolute inset-1 rounded-full border border-white/20" aria-hidden />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-fpt-blue text-lg font-extrabold text-white shadow-lg">
                  1
                </span>
              </div>
            </div>

            <h2 className="mt-6 text-xl font-bold leading-snug text-white sm:text-2xl">
              Bạn chủ yếu sử dụng WiFi tại nhà để làm gì?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-rose-100/90 sm:text-base">
              Lựa chọn nhu cầu của bạn để gợi ý gói internet với tốc độ phù hợp.
            </p>
            <p className="mt-2 text-xs text-amber-100/80 sm:text-sm">(Chọn được nhiều lựa chọn)</p>
          </div>

          <div className="relative mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {OPTIONS.map((opt) => {
              const active = picked.has(opt.id);
              const Icon = opt.Icon;
              return (
                <motion.button
                  key={opt.id}
                  type="button"
                  onClick={() => toggle(opt.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex min-h-[8.5rem] flex-col items-center justify-center rounded-2xl border-2 px-3 py-4 text-center shadow-md transition-colors sm:min-h-[9.5rem] sm:rounded-3xl sm:px-4 ${
                    active
                      ? "border-amber-300/90 bg-white text-fpt-blue shadow-amber-900/20"
                      : "border-white/40 bg-white/95 text-fpt-blue hover:border-amber-200/80 hover:bg-white"
                  }`}
                >
                  <span
                    className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded border-2 sm:right-3 sm:top-3 sm:h-6 sm:w-6 ${
                      active
                        ? "border-fpt-blue bg-fpt-blue text-white"
                        : "border-slate-300 bg-white text-transparent"
                    }`}
                    aria-hidden
                  >
                    {active ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} /> : null}
                  </span>
                  <Icon
                    className={`h-9 w-9 sm:h-10 sm:w-10 ${active ? "text-fpt-blue" : "text-blue-600"}`}
                    strokeWidth={1.35}
                  />
                  <span className="mt-3 text-[0.7rem] font-semibold leading-snug sm:text-xs">
                    {opt.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              disabled={!canContinue}
              onClick={handleContinue}
              className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold shadow-lg transition sm:text-base ${
                canContinue
                  ? "bg-gradient-to-r from-slate-200 to-white text-slate-800 hover:from-white hover:to-slate-100"
                  : "cursor-not-allowed bg-white/25 text-white/50"
              }`}
            >
              Tiếp tục
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <AnimatePresence>
            {picked.size > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="mt-4 text-center text-xs text-amber-100/90 sm:text-sm"
              >
                Đã chọn {picked.size} nhu cầu — bấm Tiếp tục để xem gói Truyền hình & các gói bên dưới.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
