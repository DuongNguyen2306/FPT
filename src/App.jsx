import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import PackageCard from "./components/PackageCard.jsx";
import OfferCard from "./components/OfferCard.jsx";
import RegistrationModal from "./components/RegistrationModal.jsx";
import Footer from "./components/Footer.jsx";
import SpeedXSection from "./components/SpeedXSection.jsx";
import InternetNeedsQuiz from "./components/InternetNeedsQuiz.jsx";
import BetweenPackagesPromo from "./components/BetweenPackagesPromo.jsx";
import { CAMERA_PACKAGES, PLAY_PACKAGES, SERVICE_PACKAGES } from "./data/catalog.js";
import { SPEEDX_PACKAGES } from "./data/speedx.js";

const PACKAGES = [
  {
    id: "giga",
    name: "Internet Giga",
    displayCode: "INTERNET GIGA",
    tagline: "Ổn định cho làm việc, học tập & giải trí — modem Wi-Fi 6, phù hợp căn hộ nhỏ.",
    promoBadge: "Giảm 50k khi thanh toán Online +",
    price: 195000,
    downloadMbps: 300,
    uploadMbps: 300,
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80",
    accentImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=300&q=80",
    specCaption: "Tốc độ (Download/ Upload)",
    specLine: "↓ 300 Mbps · ↑ 300 Mbps",
    statIcon: "gauge",
    features: [
      "Tốc độ 300 Mbps (đối xứng)",
      "Modem Wi-Fi 6",
      "Kết nối lên đến 10 thiết bị",
      "Phủ sóng ổn định cho nhà ít tầng",
    ],
    badge: "Giảm 50k khi thanh toán Online",
  },
  {
    id: "meta",
    name: "Internet Meta",
    displayCode: "INTERNET META",
    tagline: "Tăng tốc cho game & 4K — nhiều thiết bị hơn, trải nghiệm mượt hơn trong ngày.",
    promoBadge: "Gói phổ biến · Ưu đãi Online +",
    price: 245000,
    downloadMbps: 500,
    uploadMbps: 500,
    heroImage:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&q=80",
    accentImage:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&q=80",
    specCaption: "Tốc độ (Download/ Upload)",
    specLine: "↓ 500 Mbps · ↑ 500 Mbps",
    statIcon: "gauge",
    features: [
      "Tốc độ 500 Mbps (đối xứng)",
      "Modem Wi-Fi 6 cao cấp",
      "Kết nối lên đến 20 thiết bị",
      "Ưu tiên game & streaming",
    ],
    badge: "Gói phổ biến",
  },
  {
    id: "sky",
    name: "Internet Sky",
    displayCode: "INTERNET SKY",
    tagline: "1 Gbps đối xứng — mesh phủ sóng nhiều tầng, lý tưởng smart home.",
    promoBadge: "Giảm 50k khi thanh toán Online +",
    price: 315000,
    downloadMbps: 1000,
    uploadMbps: 1000,
    heroImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80",
    accentImage:
      "https://images.unsplash.com/photo-1616627543104-0fb4b9e3a238?auto=format&fit=crop&w=300&q=80",
    specCaption: "Tốc độ (Download/ Upload)",
    specLine: "↓ 1 Gbps · ↑ 1 Gbps",
    statIcon: "gauge",
    features: [
      "Tốc độ 1 Gbps (đối xứng)",
      "Router Wi-Fi 6 Mesh",
      "Kết nối lên đến 40 thiết bị",
      "Hỗ trợ nhà nhiều tầng",
    ],
    badge: "Tốc độ tối đa",
  },
  {
    id: "combo",
    name: "Combo Internet + TV",
    displayCode: "COMBO NET + TV",
    tagline: "Một hóa đơn — Internet tốc độ cao kèm FPT Play trên Box TV.",
    promoBadge: "Tiết kiệm khi đóng trước 6 tháng +",
    price: 279000,
    downloadMbps: 300,
    uploadMbps: 300,
    heroImage:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=500&q=80",
    accentImage:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=300&q=80",
    specCaption: "Tốc độ (Download/ Upload)",
    specLine: "↓ 300 Mbps · ↑ 300 Mbps",
    statIcon: "tv",
    features: [
      "Internet 300 Mbps",
      "FPT Play — gói xem đa dạng",
      "Modem + Box TV",
      "Ưu đãi khi đóng cước 6 tháng",
    ],
    badge: "Tiết kiệm",
  },
];

const MODAL_PACKAGES = [
  ...SPEEDX_PACKAGES,
  ...PACKAGES,
  ...PLAY_PACKAGES,
  ...CAMERA_PACKAGES,
  ...SERVICE_PACKAGES,
].map((p) => ({
  id: p.id,
  name: p.shortName ?? p.name,
}));

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(PACKAGES[0].id);

  const openRegister = (pkgId) => {
    setSelectedPackageId(pkgId);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar onRegister={() => openRegister(PACKAGES[0].id)} />

      <main>
        <Hero
          onRegister={() => openRegister(PACKAGES[0].id)}
          onUpgrade={() => openRegister(PACKAGES[1].id)}
        />

        <section
          id="internet"
          className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 lg:px-8"
        >
          <SpeedXSection packages={SPEEDX_PACKAGES} onRegister={openRegister} />

          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Khám phá gói cước nổi bật
            </h2>
            <p className="mt-2 text-slate-600">
              Chọn gói phù hợp — đăng ký nhanh trong vài bước.
            </p>
          </div>

          <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {PACKAGES.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onRegister={() => openRegister(pkg.id)}
              />
            ))}
          </div>
        </section>

        <InternetNeedsQuiz />

        <section id="truyen-hinh" className="scroll-mt-24 border-t border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Truyền hình FPT Play
              </h3>
              <p className="mx-auto mt-2 max-w-2xl text-slate-600">
                Gói xem đa dạng: giải trí, thể thao, trẻ em — chọn gói phù hợp hộ gia đình.
              </p>
            </div>
            <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {PLAY_PACKAGES.map((item) => (
                <OfferCard key={item.id} item={item} onRegister={openRegister} />
              ))}
            </div>
          </div>
        </section>

        <div className="bg-slate-50 py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <BetweenPackagesPromo onPickCombo={() => openRegister("combo")} />
          </div>
        </div>

        <section id="camera" className="bg-slate-50 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Camera an ninh
              </h3>
              <p className="mx-auto mt-2 max-w-2xl text-slate-600">
                Combo camera trong / ngoài trời và gói lưu trữ cloud — minh họa bộ sản phẩm & dịch vụ kèm theo.
              </p>
            </div>
            <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {CAMERA_PACKAGES.map((item) => (
                <OfferCard key={item.id} item={item} onRegister={openRegister} />
              ))}
            </div>
          </div>
        </section>

        <section id="dich-vu" className="border-t border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Dịch vụ thêm
              </h3>
              <p className="mx-auto mt-2 max-w-2xl text-slate-600">
                Smart home, ưu tiên game, bảo hành mở rộng và thanh toán tự động — gói minh họa theo nhu cầu dự án.
              </p>
            </div>
            <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {SERVICE_PACKAGES.map((item) => (
                <OfferCard key={item.id} item={item} onRegister={openRegister} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <RegistrationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        packages={MODAL_PACKAGES}
        defaultPackageId={selectedPackageId}
      />
    </div>
  );
}
