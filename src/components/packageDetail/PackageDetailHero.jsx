import { Router, Wifi } from "lucide-react";

const TYPE_HERO = {
  INTERNET: { line1: "INTERNET", line2: "CHO CÁ NHÂN" },
  SPEEDX: { line1: "SPEEDX", line2: "INTERNET" },
  FPT_PLAY: { line1: "FPT PLAY", line2: "TRUYỀN HÌNH" },
  CAMERA: { line1: "FPT", line2: "CAMERA" },
  SERVICE: { line1: "DỊCH VỤ", line2: "FPT TELECOM" },
};

/**
 * @param {{
 *   type?: string;
 *   heroHeadline?: string;
 *   heroImage?: string;
 *   accentImage?: string | null;
 *   lifestyleImageUrl?: string;
 * }} props
 */
export default function PackageDetailHero({
  type = "INTERNET",
  heroHeadline,
  heroImage,
  accentImage,
  lifestyleImageUrl,
}) {
  const preset = TYPE_HERO[type] ?? TYPE_HERO.INTERNET;
  const parts = heroHeadline?.trim().split(/\s+/) ?? [];
  const line1 = parts.length > 1 ? parts.slice(0, -2).join(" ") : preset.line1;
  const line2 = parts.length > 1 ? parts.slice(-2).join(" ") : preset.line2;

  const sideImage = lifestyleImageUrl ?? heroImage;
  const deviceImage = accentImage ?? heroImage;

  return (
    <section className="package-detail-hero relative overflow-hidden bg-[#0088e8] pb-12 pt-10 sm:pb-16 sm:pt-12">
      <div className="package-detail-hero-pattern pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
          {deviceImage ? (
            <div className="order-2 flex w-full max-w-[200px] shrink-0 justify-center lg:order-1 lg:max-w-[240px]">
              <img
                src={deviceImage}
                alt=""
                className="max-h-44 w-auto object-contain drop-shadow-lg sm:max-h-52"
              />
            </div>
          ) : (
            <div className="order-2 hidden w-40 shrink-0 items-center justify-center lg:order-1 lg:flex">
              <Router className="h-24 w-24 text-white/30" strokeWidth={1} />
            </div>
          )}

          <div className="order-1 flex-1 text-center lg:order-2 lg:text-left">
            <h1 className="text-4xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              {line1}
            </h1>
            <p className="mt-1 text-4xl font-extrabold uppercase leading-none tracking-tight text-[#7ee8ff] sm:text-5xl lg:text-[3.25rem]">
              {line2}
            </p>
          </div>

          {sideImage ? (
            <div className="relative order-3 w-full max-w-xs shrink-0 lg:max-w-sm">
              <img
                src={sideImage}
                alt=""
                className="mx-auto max-h-56 w-full rounded-2xl object-cover object-top shadow-xl sm:max-h-64"
              />
              <Wifi
                className="absolute -left-1 top-6 h-10 w-10 text-white/50"
                strokeWidth={1.5}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f0f4f8] to-transparent"
        aria-hidden
      />
    </section>
  );
}
