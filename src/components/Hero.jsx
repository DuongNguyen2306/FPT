import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    title: "Internet tốc độ cao",
    subtitle: "Ổn định cho làm việc, học tập & giải trí tại nhà.",
    gradientClass: "bg-gradient-to-br from-sky-100 via-white to-amber-50",
  },
  {
    id: 2,
    title: "Ưu đãi đăng ký mới",
    subtitle: "Hỗ trợ lắp đặt nhanh — tư vấn gói phù hợp theo nhu cầu.",
    gradientClass: "bg-gradient-to-br from-indigo-50 via-white to-orange-50",
  },
  {
    id: 3,
    title: "Trải nghiệm Wi-Fi 6",
    subtitle: "Phủ sóng tốt hơn, nhiều thiết bị cùng lúc.",
    gradientClass: "bg-gradient-to-br from-blue-50 via-white to-slate-50",
  },
];

export default function Hero({ onRegister, onUpgrade }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[index];

  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIndex((i) => (i + 1) % SLIDES.length);

  return (
    <section className="relative overflow-hidden">
      <div
        className={`absolute inset-0 transition-all duration-700 ${slide.gradientClass}`}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-fpt">
                  FPT Telecom
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-fpt-blue-dark sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  {slide.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onRegister}
                className="inline-flex items-center justify-center rounded-full bg-fpt px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 hover:shadow-md"
              >
                Đăng ký ngay
              </button>
              <button
                type="button"
                onClick={onUpgrade}
                className="inline-flex items-center justify-center rounded-full border-2 border-fpt bg-white px-8 py-3 text-sm font-semibold text-fpt transition hover:bg-orange-50"
              >
                Nâng cấp ngay
              </button>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur hover:border-fpt hover:text-fpt"
                aria-label="Slide trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === index ? "w-8 bg-fpt" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Chuyển tới slide ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur hover:border-fpt hover:text-fpt"
                aria-label="Slide sau"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="relative"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/60 bg-white/40 shadow-xl shadow-slate-200/60 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-fpt/10 via-transparent to-fpt-blue/10" />
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80"
                alt="Minh họa kết nối Internet tại nhà"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <div className="pointer-events-none absolute -bottom-6 -left-4 hidden h-24 w-24 rounded-3xl bg-fpt/15 blur-2xl sm:block" />
            <div className="pointer-events-none absolute -right-4 -top-4 hidden h-28 w-28 rounded-full bg-fpt-blue/10 blur-2xl sm:block" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
