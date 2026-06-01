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
    <section className="w-full bg-white pb-6 pt-2 sm:pb-8 sm:pt-3">
      <div className="mx-auto w-full max-w-[1360px] px-2 sm:px-4 lg:px-5">
        {hasSlides ? (
          <div className="hero-carousel-wrap">
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              loop={slides.length > 1}
              autoplay={{ delay: 5200, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="hero-swiper hero-swiper-large !overflow-hidden rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] sm:rounded-3xl"
            >
              {slides.map((s) => {
                const hasText = !!(s.title?.trim() || s.subtitle?.trim());
                return (
                  <SwiperSlide key={s.id}>
                    <div className="hero-slide-frame relative w-full overflow-hidden bg-slate-200">
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.title?.trim() || "Banner FPT Telecom"}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0066b3] to-[#1e3799]" />
                      )}
                      {hasText ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/35 to-transparent" />
                          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10 lg:max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-wider text-white/90 sm:text-sm">
                              FPT Telecom
                            </p>
                            {s.title?.trim() ? (
                              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-tight">
                                {s.title}
                              </h1>
                            ) : null}
                            {s.subtitle?.trim() ? (
                              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/90 sm:mt-3 sm:text-lg md:text-xl">
                                {s.subtitle}
                              </p>
                            ) : null}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        ) : (
          <div className="hero-slide-frame flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066b3] to-[#1e3799] px-6 text-center text-white shadow-soft sm:rounded-3xl">
            <div className="py-16 sm:py-24">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80 sm:text-sm">
                FPT Telecom
              </p>
              <h1 className="mt-2 text-2xl font-extrabold sm:text-4xl">Sản phẩm dịch vụ</h1>
              <p className="mt-3 text-sm text-white/85 sm:text-base">Đang tải danh sách gói cước…</p>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:mt-8 sm:rounded-3xl sm:p-6 md:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-5">
            <button
              type="button"
              onClick={onRegister}
              className="inline-flex flex-1 items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-3.5 text-base font-semibold text-secondary shadow-sm transition hover:bg-slate-50 sm:max-w-sm sm:flex-none sm:min-w-[220px] sm:px-8 sm:py-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">
                <Wifi className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
              </span>
              Đăng ký ngay
            </button>
            <button
              type="button"
              onClick={onUpgrade}
              className="inline-flex flex-1 items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-3.5 text-base font-semibold text-secondary shadow-sm transition hover:bg-slate-50 sm:max-w-sm sm:flex-none sm:min-w-[220px] sm:px-8 sm:py-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary sm:h-11 sm:w-11">
                <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
              </span>
              Nâng cấp ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
