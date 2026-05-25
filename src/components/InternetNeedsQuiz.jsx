import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Clapperboard,
  Gamepad2,
  Home,
  Laptop,
  Wifi,
} from "lucide-react";

const OPTIONS = [
  {
    id: "study",
    label: "Học tập / Làm việc",
    Icon: Laptop,
  },
  {
    id: "media",
    label: "Giải trí / Phim ảnh",
    Icon: Clapperboard,
  },
  {
    id: "game",
    label: "Chơi game",
    Icon: Gamepad2,
  },
  {
    id: "smarthome",
    label: "Nhà thông minh",
    Icon: Home,
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
    document.getElementById("truyen-hinh")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const canContinue = picked.size > 0;

  return (
    <section className="border-y border-slate-100 bg-light py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-10">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
            <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:mb-0">
              <Wifi className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">Gói Internet dành cho bạn</p>
              <h2 className="mt-2 text-xl font-bold leading-snug text-secondary sm:text-2xl">
                Bạn chủ yếu sử dụng WiFi tại nhà để làm gì?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                Chọn một hoặc nhiều mục — chúng tôi gợi ý tốc độ và gói phù hợp.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {OPTIONS.map((opt) => {
              const active = picked.has(opt.id);
              const Icon = opt.Icon;
              return (
                <motion.button
                  key={opt.id}
                  type="button"
                  onClick={() => toggle(opt.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`flex min-h-[7.5rem] flex-col items-center justify-center rounded-3xl border-2 px-3 py-5 text-center shadow-sm transition-colors sm:min-h-[8.5rem] ${
                    active
                      ? "border-primary bg-primary/[0.06] text-secondary ring-2 ring-primary/25"
                      : "border-slate-200 bg-white text-secondary hover:border-primary/40"
                  }`}
                >
                  <Icon
                    className={`h-9 w-9 sm:h-10 sm:w-10 ${active ? "text-primary" : "text-secondary/80"}`}
                    strokeWidth={1.35}
                  />
                  <span className="mt-3 text-xs font-semibold leading-snug sm:text-sm">{opt.label}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              disabled={!canContinue}
              onClick={handleContinue}
              className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold shadow-sm transition sm:text-base ${
                canContinue
                  ? "bg-secondary text-white hover:brightness-110"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
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
                className="mt-4 text-center text-sm text-slate-500"
              >
                Đã chọn {picked.size} nhu cầu — tiếp theo xem gói Truyền hình & các dịch vụ bên dưới.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
