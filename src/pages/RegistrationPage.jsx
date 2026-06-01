import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import RegistrationStepper from "../components/registration/RegistrationStepper.jsx";
import OrderSummaryCard from "../components/registration/OrderSummaryCard.jsx";
import { getPackageById } from "../api/packagesApi.js";
import { createLead } from "../api/leadsApi.js";
import { formatVnd } from "../lib/packageHelpers.js";
import { normalizeVNPhone, validateVNPhoneMessage } from "../lib/phone.js";
import { friendlyApiError } from "../lib/userFacingText.js";
import ZaloChatFab from "../components/ZaloChatFab.jsx";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("packageId") ?? "";
  const from = searchParams.get("from") ?? "/";

  const [step, setStep] = useState(1);
  const [pkg, setPkg] = useState(null);
  const [pkgLoading, setPkgLoading] = useState(!!packageId);
  const [pkgError, setPkgError] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!packageId) {
      setPkgLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setPkgLoading(true);
      setPkgError("");
      try {
        const data = await getPackageById(packageId);
        if (!cancelled) setPkg(data);
      } catch (e) {
        if (!cancelled) setPkgError(friendlyApiError(e, "Không tải được thông tin gói."));
      } finally {
        if (!cancelled) setPkgLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [packageId]);

  const packageName = pkg?.name ?? pkg?.title ?? "Gói dịch vụ";
  const price = useMemo(() => {
    const v = pkg?.price ?? pkg?.monthlyPrice;
    return typeof v === "number" && !Number.isNaN(v) ? v : undefined;
  }, [pkg]);

  const validatePhone = (value) => {
    const msg = validateVNPhoneMessage(value);
    if (msg) {
      setPhoneError(msg);
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setPhone(digits);
    if (phoneError) setPhoneError("");
    if (submitError) setSubmitError("");
  };

  const step1Valid =
    fullName.trim().length > 0 && phone.length > 0 && !validateVNPhoneMessage(phone);

  const step2Valid = address.trim().length > 0;

  const canContinueStep1 = step1Valid && !pkgLoading && (!packageId || pkg);
  const canContinueStep2 = step2Valid;

  const goBack = () => {
    if (step === 1) {
      navigate(from.startsWith("/") ? from : "/");
      return;
    }
    setStep((s) => (s > 1 ? s - 1 : 1));
    setSubmitError("");
  };

  const handleContinue = async () => {
    if (step === 1) {
      if (!fullName.trim()) {
        setSubmitError("Vui lòng nhập họ tên.");
        return;
      }
      if (!validatePhone(phone)) return;
      setSubmitError("");
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!address.trim()) {
        setSubmitError("Vui lòng nhập địa chỉ lắp đặt.");
        return;
      }
      setSubmitError("");
      setLoading(true);
      try {
        const body = {
          fullName: fullName.trim(),
          phone: normalizeVNPhone(phone),
          installAddress: address.trim(),
        };
        if (packageId) body.packageId = packageId;
        const lead = await createLead(body);
        navigate("/dat-hang-thanh-cong", {
          replace: true,
          state: { lead, package: pkg ?? null, from: location.pathname },
        });
      } catch (err) {
        setSubmitError(friendlyApiError(err, "Gửi đăng ký không thành công. Vui lòng thử lại."));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f0f4f8]">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0066b3] to-orange-600 text-sm font-extrabold text-white shadow-sm">
              FPT
            </span>
            <span className="text-sm font-semibold tracking-tight text-slate-800">Telecom</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 pb-safe-cta sm:px-6 sm:py-10 lg:pb-10">
        <RegistrationStepper currentStep={step} />

        <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[1fr_340px] lg:items-start">
            <div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8">
                {step === 1 ? (
                  <>
                    <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                      Thông tin đăng ký
                    </h1>
                    <div className="mt-6 rounded-lg bg-slate-50 px-4 py-2.5">
                      <p className="text-sm font-semibold text-slate-800">Thông tin cá nhân</p>
                    </div>

                    {pkgError ? (
                      <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        {pkgError}
                      </p>
                    ) : null}
                    {submitError ? (
                      <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                        {submitError}
                      </p>
                    ) : null}

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="reg-fullname" className="text-sm font-medium text-slate-700">
                          Họ tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="reg-fullname"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (submitError) setSubmitError("");
                          }}
                          placeholder="Nhập họ tên"
                          autoComplete="name"
                          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#0066b3] focus:ring-2 focus:ring-[#0066b3]/20"
                        />
                      </div>
                      <div>
                        <label htmlFor="reg-phone" className="text-sm font-medium text-slate-700">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="reg-phone"
                          inputMode="numeric"
                          value={phone}
                          onChange={handlePhoneChange}
                          onBlur={() => phone && validatePhone(phone)}
                          placeholder="Nhập số điện thoại"
                          autoComplete="tel"
                          className={`mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                            phoneError
                              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                              : "border-slate-200 focus:border-[#0066b3] focus:ring-[#0066b3]/20"
                          }`}
                        />
                        {phoneError ? (
                          <p className="mt-1 text-xs text-red-600">{phoneError}</p>
                        ) : null}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Thanh toán</h1>
                    <div className="mt-6 rounded-lg bg-slate-50 px-4 py-2.5">
                      <p className="text-sm font-semibold text-slate-800">Thông tin lắp đặt</p>
                    </div>

                    {submitError ? (
                      <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                        {submitError}
                      </p>
                    ) : null}

                    <div className="mt-6">
                      <label htmlFor="reg-address" className="text-sm font-medium text-slate-700">
                        Địa chỉ lắp đặt <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="reg-address"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (submitError) setSubmitError("");
                        }}
                        rows={4}
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                        className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#0066b3] focus:ring-2 focus:ring-[#0066b3]/20"
                      />
                    </div>

                    <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                      <p className="text-sm font-semibold text-slate-800">Phương thức thanh toán</p>
                      <p className="mt-2 text-sm text-slate-600">
                        Thanh toán khi lắp đặt — nhân viên FPT sẽ hướng dẫn sau khi xác nhận đơn
                        hàng.
                      </p>
                      <p className="mt-3 text-sm text-slate-700">
                        <span className="font-medium">{packageName}</span>
                        {typeof price === "number" ? (
                          <span className="ml-2 font-bold text-[#0066b3]">{formatVnd(price)}/tháng</span>
                        ) : null}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={goBack}
                className="mt-4 text-sm font-medium text-[#0066b3] hover:underline"
              >
                Quay lại
              </button>
            </div>

            <OrderSummaryCard
              fullName={fullName}
              phone={phone}
              address={address}
              packageName={packageName}
              price={price}
              step={step}
              loading={loading}
              canContinue={step === 1 ? canContinueStep1 : canContinueStep2}
              onContinue={handleContinue}
              continueLabel={step === 1 ? "Tiếp tục" : "Xác nhận đăng ký"}
            />
          </div>
      </div>

      {step < 3 ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md pb-safe lg:hidden">
          <button
            type="button"
            onClick={handleContinue}
            disabled={
              loading ||
              (step === 1 ? !canContinueStep1 : !canContinueStep2)
            }
            className="w-full rounded-lg py-3.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 enabled:bg-[#0066b3] enabled:hover:bg-[#0056a3]"
          >
            {loading ? "Đang xử lý…" : step === 1 ? "Tiếp tục" : "Xác nhận đăng ký"}
          </button>
        </div>
      ) : null}

      <ZaloChatFab raised={step < 3} />
    </div>
  );
}
