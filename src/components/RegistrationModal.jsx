import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createLead } from "../api/leadsApi.js";
import { normalizeVNPhone, validateVNPhoneMessage } from "../lib/phone.js";

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
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setPackageId(defaultPackageId ?? packages[0]?.id ?? "");
      setSubmitted(false);
      setPhoneError("");
      setSubmitError("");
      setLoading(false);
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
    const msg = validateVNPhoneMessage(value);
    if (msg) {
      setPhoneError(msg);
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setSubmitError("Vui lòng nhập họ và tên.");
      return;
    }
    if (!validatePhone(phone)) return;
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
      if (packageId) {
        body.packageId = packageId;
      }
      await createLead(body);
      setSubmitted(true);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 429) {
        setSubmitError("Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.");
      } else {
        const msg =
          err?.response?.data?.message ??
          err?.response?.data?.error ??
          err?.message;
        setSubmitError(typeof msg === "string" ? msg : "Gửi không thành công. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setPhone(digits);
    if (phoneError) setPhoneError("");
    if (submitError) setSubmitError("");
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
          <motion.button
            type="button"
            aria-label="Đóng"
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[101] w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 id={titleId} className="text-lg font-bold text-secondary">
                Đăng ký dịch vụ
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-500 hover:bg-light hover:text-slate-800"
                aria-label="Đóng hộp thoại"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-5 py-10 text-center"
                >
                  <p className="text-base font-medium text-slate-800">
                    Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 rounded-full bg-primary px-8 py-2.5 text-sm font-semibold text-white hover:brightness-95"
                  >
                    Đóng
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4 px-5 py-5"
                >
                  {submitError ? (
                    <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
                  ) : null}

                  <div>
                    <label htmlFor="reg-name" className="text-sm font-medium text-slate-700">
                      Họ và tên
                    </label>
                    <input
                      id="reg-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2"
                      placeholder="Nguyễn Văn A"
                      autoComplete="name"
                      required
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
                      onChange={handlePhoneChange}
                      onBlur={() => phone && validatePhone(phone)}
                      className={`mt-1.5 w-full rounded-2xl border px-3 py-2.5 text-sm outline-none ring-primary/20 transition focus:ring-2 ${
                        phoneError ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-primary"
                      }`}
                      placeholder="0901234567"
                      autoComplete="tel"
                    />
                    {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
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
                      className="mt-1.5 w-full resize-none rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2"
                      placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="reg-pkg" className="text-sm font-medium text-slate-700">
                      Gói cước bạn quan tâm
                    </label>
                    <select
                      id="reg-pkg"
                      value={packageId}
                      onChange={(e) => setPackageId(e.target.value)}
                      disabled={!packages.length}
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-2 disabled:opacity-50"
                    >
                      {packages.length === 0 ? (
                        <option value="">Chưa chọn gói</option>
                      ) : (
                        packages.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-light"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !packages.length}
                      className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95 disabled:opacity-60"
                    >
                      {loading ? "Đang gửi…" : "Hoàn tất đăng ký"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
