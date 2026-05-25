import { ArrowUp, Wifi } from "lucide-react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

/**
 * @param {{
 *   slides?: { id: string; title: string; subtitle?: string; image?: string }[];
 *   onRegister?: () => void;
 *   onUpgrade?: () => void;
 * }} props
 */
export default function Hero({ slides = [], onRegister, onUpgrade }) {
  const hasSlides = slides.length > 0;

  return (
    <section className="bg-light pb-12 pt-8 sm:pb-16 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {hasSlides ? (
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop={slides.length > 1}
            autoplay={{ delay: 5200, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="hero-swiper !overflow-visible rounded-3xl shadow-soft [&_.swiper-pagination-bullet-active]:bg-primary"
          >
            {slides.map((s) => (
              <SwiperSlide key={s.id}>
                <div className="relative aspect-[16/10] min-h-[220px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#0066b3] to-[#1e3799] sm:aspect-[21/9] sm:min-h-[320px] md:min-h-[380px]">
                  {s.image ? (
                    <img
                      src={s.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/85 via-secondary/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:max-w-xl">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/90">
                      FPT Telecom
                    </p>
                    <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                      {s.title}
                    </h1>
                    {s.subtitle ? (
                      <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-lg">
                        {s.subtitle}
                      </p>
                    ) : null}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#0066b3] to-[#1e3799] px-6 py-14 text-center text-white shadow-soft sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
              FPT Telecom
            </p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Sản phẩm dịch vụ</h1>
            <p className="mt-3 text-sm text-white/85">
              Đang tải danh sách gói cước…
            </p>
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-5 shadow-soft sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <button
              type="button"
              onClick={onRegister}
              className="inline-flex flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-transparent bg-white px-6 py-4 text-base font-semibold text-secondary shadow-sm ring-1 ring-slate-100 transition hover:bg-light sm:max-w-md sm:flex-none sm:min-w-[240px] sm:px-10 sm:py-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Wifi className="h-6 w-6" strokeWidth={2} />
              </span>
              Đăng ký ngay
            </button>
            <button
              type="button"
              onClick={onUpgrade}
              className="inline-flex flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-transparent bg-white px-6 py-4 text-base font-semibold text-secondary shadow-sm ring-1 ring-slate-100 transition hover:bg-light sm:max-w-md sm:flex-none sm:min-w-[240px] sm:px-10 sm:py-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                <ArrowUp className="h-6 w-6" strokeWidth={2} />
              </span>
              Nâng cấp ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
