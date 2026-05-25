import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import OfferCard from "../components/OfferCard.jsx";
import FeaturedProductsSection from "../components/FeaturedProductsSection.jsx";
import Footer from "../components/Footer.jsx";
import { registrationPath } from "../lib/registrationRoutes.js";
import SpeedXSection from "../components/SpeedXSection.jsx";
import InternetNeedsQuiz from "../components/InternetNeedsQuiz.jsx";
import BetweenPackagesPromo from "../components/BetweenPackagesPromo.jsx";
import { listPackages } from "../api/packagesApi.js";
import {
  findComboPackageId,
  mapPackageToProductPlan,
  mapPackageToSpeedX,
} from "../lib/mapPackageFromApi.ts";
import { friendlyApiError } from "../lib/userFacingText.js";
import { packageDetailPath } from "../lib/packageRoutes.js";

const gridPackages =
  "-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-3 scrollbar-hide md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4";

export default function HomePage() {
  const navigate = useNavigate();
  const [loadState, setLoadState] = useState({
    loading: true,
    error: "",
    speedx: [],
    internet: [],
    play: [],
    camera: [],
    service: [],
  });

  const reload = useCallback(async () => {
    setLoadState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const [speedxRaw, internetRaw, playRaw, cameraRaw, serviceRaw] = await Promise.all([
        listPackages("SPEEDX"),
        listPackages("INTERNET"),
        listPackages("FPT_PLAY"),
        listPackages("CAMERA"),
        listPackages("SERVICE"),
      ]);
      setLoadState({
        loading: false,
        error: "",
        speedx: speedxRaw.map((p) => mapPackageToSpeedX(p, "SPEEDX")),
        internet: internetRaw.map((p) => mapPackageToProductPlan(p, "INTERNET")),
        play: playRaw.map((p) => mapPackageToProductPlan(p, "FPT_PLAY")),
        camera: cameraRaw.map((p) => mapPackageToProductPlan(p, "CAMERA")),
        service: serviceRaw.map((p) => mapPackageToProductPlan(p, "SERVICE")),
      });
    } catch (e) {
      setLoadState((s) => ({
        ...s,
        loading: false,
        error: friendlyApiError(e, "Không tải được danh sách gói. Vui lòng thử lại sau."),
        speedx: [],
        internet: [],
        play: [],
        camera: [],
        service: [],
      }));
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const heroSlides = useMemo(() => {
    const pool = [...loadState.internet, ...loadState.speedx];
    return pool
      .filter((p) => p.heroImage)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        title: p.name ?? p.shortName ?? p.displayCode ?? "",
        subtitle: p.tagline ?? "",
        image: p.heroImage,
      }))
      .filter((s) => s.title);
  }, [loadState.internet, loadState.speedx]);

  const firstInternetId = loadState.internet[0]?.id ?? "";
  const secondInternetId = loadState.internet[1]?.id ?? firstInternetId;
  const comboId =
    findComboPackageId(loadState.internet) ?? secondInternetId ?? firstInternetId;

  const comboPromoText = useMemo(() => {
    const id = findComboPackageId(loadState.internet);
    if (!id) return undefined;
    const pkg = loadState.internet.find((p) => p.id === id);
    return pkg?.promoBadge?.trim() || undefined;
  }, [loadState.internet]);

  const openRegister = (pkgId) => {
    const id = pkgId || firstInternetId;
    navigate(registrationPath({ packageId: id || undefined, from: "/" }));
  };

  const openPackageDetail = (pkg) => {
    const path = packageDetailPath(pkg);
    if (path !== "/") navigate(path);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onOpenLogin={() => navigate("/login")}
        onOpenLead={() => openRegister(firstInternetId)}
      />

      {loadState.error ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
          <p>{loadState.error}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-2 rounded-full bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
          >
            Thử lại
          </button>
        </div>
      ) : null}

      <main>
        <Hero
          slides={heroSlides}
          onRegister={() => openRegister(firstInternetId)}
          onUpgrade={() => openRegister(secondInternetId)}
        />

        <section
          id="internet"
          className="scroll-mt-24 bg-white pb-16 pt-6 sm:pb-20 sm:pt-8"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loadState.loading ? (
              <div className="mb-10 h-40 animate-pulse rounded-3xl bg-light" />
            ) : (
              <SpeedXSection
                packages={loadState.speedx}
                onRegister={openRegister}
                onViewDetails={openPackageDetail}
              />
            )}

            <FeaturedProductsSection
              packages={loadState.internet}
              loading={loadState.loading}
              onRegister={openRegister}
              onViewDetails={openPackageDetail}
            />
          </div>
        </section>

        <InternetNeedsQuiz />

        <section
          id="truyen-hinh"
          className="scroll-mt-24 border-t border-slate-100 bg-white py-14 sm:py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
                Truyền hình FPT Play
              </h3>
              <p className="mx-auto mt-2 max-w-2xl text-slate-600">
                Gói xem đa dạng: giải trí, thể thao, trẻ em — chọn gói phù hợp hộ gia đình.
              </p>
            </div>
            <div className={`${gridPackages} items-stretch`}>
              {loadState.loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[28rem] min-w-[min(88vw,20rem)] shrink-0 animate-pulse rounded-3xl bg-light md:min-w-0"
                  />
                ))
              ) : loadState.play.length === 0 ? (
                <p className="col-span-full py-8 text-center text-slate-500">
                  Hiện chưa có gói truyền hình.
                </p>
              ) : (
                loadState.play.map((item) => (
                  <OfferCard
                    key={item.id}
                    item={item}
                    onRegister={openRegister}
                    onViewDetails={openPackageDetail}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        <div className="bg-light py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <BetweenPackagesPromo
              promoText={comboPromoText}
              onPickCombo={() => openRegister(comboId || firstInternetId)}
            />
          </div>
        </div>

        <section id="camera" className="bg-light py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
                Camera an ninh
              </h3>
              <p className="mx-auto mt-2 max-w-2xl text-slate-600">
                Combo camera trong / ngoài trời và gói lưu trữ cloud.
              </p>
            </div>
            <div className={`${gridPackages} items-stretch`}>
              {loadState.loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[28rem] min-w-[min(88vw,20rem)] shrink-0 animate-pulse rounded-3xl bg-slate-200/60 md:min-w-0"
                  />
                ))
              ) : loadState.camera.length === 0 ? (
                <p className="col-span-full py-8 text-center text-slate-500">
                  Hiện chưa có gói camera.
                </p>
              ) : (
                loadState.camera.map((item) => (
                  <OfferCard
                    key={item.id}
                    item={item}
                    onRegister={openRegister}
                    onViewDetails={openPackageDetail}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        <section
          id="dich-vu"
          className="scroll-mt-24 border-t border-slate-100 bg-white py-14 sm:py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
                Dịch vụ thêm
              </h3>
              <p className="mx-auto mt-2 max-w-2xl text-slate-600">
                Smart home, ưu tiên game, bảo hành mở rộng và thanh toán tự động.
              </p>
            </div>
            <div className={`${gridPackages} items-stretch`}>
              {loadState.loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[28rem] min-w-[min(88vw,20rem)] shrink-0 animate-pulse rounded-3xl bg-light md:min-w-0"
                  />
                ))
              ) : loadState.service.length === 0 ? (
                <p className="col-span-full py-8 text-center text-slate-500">
                  Hiện chưa có dịch vụ bổ sung.
                </p>
              ) : (
                loadState.service.map((item) => (
                  <OfferCard
                    key={item.id}
                    item={item}
                    onRegister={openRegister}
                    onViewDetails={openPackageDetail}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
