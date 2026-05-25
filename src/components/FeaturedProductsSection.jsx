import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PackageCard from "./PackageCard.jsx";
import "swiper/css";
import "swiper/css/navigation";

const TABS = [
  { id: "personal", label: "Internet cá nhân", audiences: ["personal"] },
  { id: "family", label: "Internet gia đình", audiences: ["family", "personal"] },
  { id: "gamer", label: "Internet game thủ", audiences: ["gamer", "personal"] },
  {
    id: "combo-camera",
    label: "Combo Internet Camera",
    audiences: ["combo-camera", "personal"],
  },
  {
    id: "combo-tv",
    label: "Combo Internet Truyền hình",
    audiences: ["combo-tv", "personal"],
  },
];

export default function FeaturedProductsSection({
  packages,
  loading,
  onRegister,
  onViewDetails,
}) {
  const [activeTab, setActiveTab] = useState("personal");
  const [location, setLocation] = useState("Hà Nội");
  const [locationOpen, setLocationOpen] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const filtered = useMemo(() => {
    const tab = TABS.find((t) => t.id === activeTab) ?? TABS[0];
    const list = packages.filter((p) => tab.audiences.includes(p.audience ?? "personal"));
    return list.length ? list : packages;
  }, [packages, activeTab]);

  return (
    <section className="py-8 sm:py-10">
      <div className="mb-6 text-center sm:mb-8">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl lg:text-[1.65rem]">
          Khám phá sản phẩm nổi bật tại{" "}
          <span className="relative inline-block">
            <button
              type="button"
              onClick={() => setLocationOpen((v) => !v)}
              className="font-bold text-[#0066b3] underline decoration-[#0066b3]/40 underline-offset-4 hover:text-secondary"
            >
              {locationOpen ? "Chọn vị trí" : location}
            </button>
            {locationOpen ? (
              <span className="absolute left-1/2 top-full z-20 mt-2 w-48 -translate-x-1/2 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                {["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ"].map((city) => (
                  <button
                    key={city}
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-light"
                    onClick={() => {
                      setLocation(city);
                      setLocationOpen(false);
                    }}
                  >
                    <MapPin className="h-3.5 w-3.5 text-secondary" />
                    {city}
                  </button>
                ))}
              </span>
            ) : null}
          </span>
        </h2>
      </div>

      <div className="scrollbar-hide -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                active
                  ? "border-secondary bg-white text-secondary shadow-sm"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="relative px-1 sm:px-10">
        <button
          ref={prevRef}
          type="button"
          className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:border-secondary hover:text-secondary sm:flex"
          aria-label="Trước"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          ref={nextRef}
          type="button"
          className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:border-secondary hover:text-secondary sm:flex"
          aria-label="Sau"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[26rem] w-[min(88vw,17.5rem)] shrink-0 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">
            Chưa có gói cho danh mục này.
          </p>
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView="auto"
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            onSwiper={(swiper) => {
              setTimeout(() => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.destroy();
                swiper.navigation.init();
                swiper.navigation.update();
              });
            }}
            className="featured-swiper !overflow-visible pb-2"
          >
            {filtered.map((pkg) => (
              <SwiperSlide key={pkg.id} className="!h-auto !w-auto">
                <PackageCard
                  pkg={pkg}
                  variant="carousel"
                  onRegister={() => onRegister(pkg.id)}
                  onViewDetails={() => onViewDetails?.(pkg)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div className="mt-4 flex justify-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={() => prevRef.current?.click()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
            aria-label="Trước"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => nextRef.current?.click()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
            aria-label="Sau"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}