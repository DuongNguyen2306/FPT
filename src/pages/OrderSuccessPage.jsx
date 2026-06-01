import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ZaloChatFab from "../components/ZaloChatFab.jsx";
import RegistrationSuccessCard from "../components/registration/RegistrationSuccessCard.jsx";
import SuccessPageBackdrop from "../components/registration/SuccessPageBackdrop.jsx";
import useConfettiCelebration from "../hooks/useConfettiCelebration.js";

/** Mock data — bật ?mock=1 trên URL để xem UI không cần đăng ký thật */
const MOCK_SUCCESS = {
  orderId: "6a16c03f2b8e4d1a9c8abb12",
  createdAt: new Date().toISOString(),
  packageName: "Internet Giga",
  speed: "300 Mbps / 300 Mbps",
  price: 195000,
  customerName: "Nguyễn Văn A",
  phone: "0912345678",
  address: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh",
  packageDetailPath: "/goi/internet-giga",
};

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const useMock = new URLSearchParams(location.search).get("mock") === "1";

  const lead = location.state?.lead;
  const pkg = location.state?.package;
  const hasLead = !!lead;

  useConfettiCelebration(hasLead || useMock);

  if (!hasLead && !useMock) {
    return (
      <SuccessPageBackdrop>
        <Navbar />
        <main className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-3xl items-center justify-center px-4 py-16 sm:px-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <p className="text-sm text-gray-500">
              Không tìm thấy thông tin đơn đăng ký. Vui lòng quay lại trang chủ.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700"
            >
              Về trang chủ
            </Link>
          </div>
        </main>
        <Footer />
      </SuccessPageBackdrop>
    );
  }

  let orderId;
  let createdAt;
  let packageName;
  let speed;
  let price;
  let customerName;
  let phone;
  let address;
  let packageDetailPath;

  if (useMock) {
    ({
      orderId,
      createdAt,
      packageName,
      speed,
      price,
      customerName,
      phone,
      address,
      packageDetailPath,
    } = MOCK_SUCCESS);
  } else {
    const snap = lead.packageSnapshot ?? {};
    packageName = snap.name ?? pkg?.name ?? pkg?.title ?? "Gói dịch vụ";
    price = snap.price ?? pkg?.price ?? pkg?.monthlyPrice ?? null;
    const download = pkg?.metadata?.downloadMbps ?? pkg?.downloadMbps ?? null;
    const upload = pkg?.metadata?.uploadMbps ?? pkg?.uploadMbps ?? null;
    speed =
      download || upload
        ? `${download ?? "—"} Mbps / ${upload ?? download ?? "—"} Mbps`
        : pkg?.specLine ?? null;
    orderId = lead.id;
    createdAt = lead.createdAt;
    customerName = lead.fullName;
    phone = lead.phone;
    address = lead.installAddress;
    packageDetailPath =
      pkg?.code != null
        ? `/goi/${encodeURIComponent(pkg.code)}`
        : pkg?.id != null
          ? `/goi/id/${encodeURIComponent(pkg.id)}`
          : null;
  }

  return (
    <SuccessPageBackdrop>
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-3xl items-center justify-center px-4 py-10 sm:px-6">
        <RegistrationSuccessCard
          orderId={orderId}
          createdAt={createdAt}
          packageName={packageName}
          speed={speed}
          price={price}
          customerName={customerName}
          phone={phone}
          address={address}
          packageDetailPath={packageDetailPath}
          onGoHome={() => navigate("/")}
        />
        {phone ? (
          <p className="mt-6 text-center text-sm text-slate-600">
            <Link
              to={`/tra-cuu-don?phone=${encodeURIComponent(phone)}`}
              className="font-semibold text-primary hover:underline"
            >
              Xem tất cả đơn đăng ký của số này
            </Link>
          </p>
        ) : null}
      </main>
      <Footer />
      <ZaloChatFab />
    </SuccessPageBackdrop>
  );
}
