import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const VN_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

function normalizePhone(raw) {
  let s = raw.trim().replace(/\s+/g, "");
  if (s.startsWith("+84")) s = "0" + s.slice(3);
  return s;
}

export default function RegistrationModal({
  open,
  onClose,
  packages,
  defaultPackageId,
}) {
  const titleId = useId();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [packageId, setPackageId] = useState(defaultPackageId ?? packages[0]?.id);
  const [phoneError, setPhoneError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setPackageId(defaultPackageId ?? packages[0]?.id);
      setSubmitted(false);
      setPhoneError("");
    }
  }, [open, defaultPackageId, packages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const validatePhone = (value) => {
    const n = normalizePhone(value);
    if (!n) {
      setPhoneError("Vui lòng nhập số điện thoại.");
      return false;
    }
    if (!VN_PHONE_REGEX.test(n)) {
      setPhoneError("Số điện thoại không hợp lệ (10 số, đầu 0 hoặc +84).");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePhone(phone)) return;
    setSubmitted(true);
  };

  const modal = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
          <motion.button
            type="button"
            aria-label="Đóng"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[101] w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 id={titleId} className="text-lg font-bold text-slate-900">
                Đăng ký dịch vụ
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                aria-label="Đóng hộp thoại"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitted ? (
              <div className="px-5 py-10 text-center">
                <p className="text-base font-medium text-slate-800">
                  Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  (Demo — không gửi dữ liệu thật.)
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 rounded-full bg-fpt px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
                <div>
                  <label htmlFor="reg-name" className="text-sm font-medium text-slate-700">
                    Họ và tên
                  </label>
                  <input
                    id="reg-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-fpt/30 transition focus:border-fpt focus:ring-2"
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="reg-phone" className="text-sm font-medium text-slate-700">
                    Số điện thoại
                  </label>
                  <input
                    id="reg-phone"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError("");
                    }}
                    onBlur={() => phone && validatePhone(phone)}
                    className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none ring-fpt/30 transition focus:ring-2 ${
                      phoneError ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-fpt"
                    }`}
                    placeholder="0901234567"
                    autoComplete="tel"
                  />
                  {phoneError && (
                    <p className="mt-1 text-xs text-red-600">{phoneError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-address" className="text-sm font-medium text-slate-700">
                    Địa chỉ lắp đặt
                  </label>
                  <textarea
                    id="reg-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-fpt/30 transition focus:border-fpt focus:ring-2"
                    placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                  />
                </div>

                <div>
                  <label htmlFor="reg-pkg" className="text-sm font-medium text-slate-700">
                    Gói cước
                  </label>
                  <select
                    id="reg-pkg"
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-fpt/30 transition focus:border-fpt focus:ring-2"
                  >
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-fpt py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                  >
                    Gửi đăng ký
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
