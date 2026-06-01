import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Gauge,
  ArrowDown,
  ArrowUp,
  Router,
  Network,
  Gamepad2,
  Gift,
  Users,
} from "lucide-react";
import { formatVnd } from "../../lib/packageHelpers.js";
import { resolvePrivilegeIcon } from "../../lib/privilegeIcons.js";

/**
 * @param {{ icon: import('react').ElementType; label: string; value: string }} props
 */
function SpecRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 px-4 py-3 odd:bg-white even:bg-slate-50/80">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   packageData: import('../../lib/packageDetailModal.js').PackageDetailModalData | null;
 *   onRegister?: (packageId: string) => void;
 * }} props
 */
export default function PackageDetailModal({ isOpen, onClose, packageData, onRegister }) {
  const handleEscape = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleEscape);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = prev;
    };
  }, [isOpen, handleEscape]);

  if (!isOpen || !packageData) return null;

  const d = packageData;
  const down = d.downloadMbps;
  const up = d.uploadMbps ?? d.downloadMbps;
  const downloadText =
    down != null ? `${down} Mbps${up != null && up !== down ? "" : " (đối xứng)"}` : "Liên hệ tư vấn";
  const uploadText = up != null ? `${up} Mbps` : "Liên hệ tư vấn";
  const equipmentList = d.equipment ?? [];
  const equipmentText = equipmentList.length
    ? equipmentList.map((e) => e.label).filter(Boolean).join(" · ")
    : "Theo gói đăng ký";
  const content = (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-detail-modal-title"
        className="animate-scaleUp flex max-h-[min(92dvh,100%)] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {d.heroImage ? (
          <div className="relative h-36 shrink-0 overflow-hidden bg-slate-200 sm:h-44">
            <img src={d.heroImage} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/55"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-4 pr-12 sm:p-5">
              <h2 id="package-detail-modal-title" className="text-lg font-black text-white sm:text-xl">
                {d.name}
              </h2>
              {d.tagline ? <p className="mt-0.5 line-clamp-2 text-sm text-white/90">{d.tagline}</p> : null}
            </div>
          </div>
        ) : null}

        <header
          className={`relative shrink-0 border-b border-gray-100 px-4 pb-4 sm:px-6 ${
            d.heroImage ? "pt-4" : "pt-5 pr-12 sm:pt-6 sm:pr-14"
          }`}
        >
          {!d.heroImage ? (
            <>
              <h2 id="package-detail-modal-title" className="pr-2 text-xl font-black text-gray-800 sm:text-2xl">
                {d.name}
              </h2>
              {d.tagline ? <p className="mt-1 text-sm text-gray-500">{d.tagline}</p> : null}
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : null}
          {typeof d.price === "number" ? (
            <p className={`text-lg font-extrabold text-blue-600 ${d.heroImage ? "mt-2" : "mt-2"}`}>
              {formatVnd(d.price)}
              <span className="text-sm font-medium text-gray-500">/tháng</span>
            </p>
          ) : null}
          {d.promoBadge ? (
            <p className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              {d.promoBadge}
            </p>
          ) : null}
        </header>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
          {(d.accentImage || d.lifestyleImageUrl) && (
            <section>
              <div className="grid grid-cols-2 gap-3">
                {d.accentImage ? (
                  <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-slate-50 p-3">
                    <img
                      src={d.accentImage}
                      alt=""
                      className="h-24 w-full object-contain sm:h-28"
                    />
                  </div>
                ) : null}
                {d.lifestyleImageUrl ? (
                  <div
                    className={`flex items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-slate-50 p-3 ${
                      !d.accentImage ? "col-span-2" : ""
                    }`}
                  >
                    <img
                      src={d.lifestyleImageUrl}
                      alt=""
                      className="h-24 w-full rounded-lg object-cover sm:h-28"
                    />
                  </div>
                ) : null}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-700">
              <Gauge className="h-4 w-4 text-blue-600" aria-hidden />
              Thông số kỹ thuật
            </h3>
            <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100">
              <SpecRow icon={ArrowDown} label="Tốc độ Download" value={downloadText} />
              <SpecRow icon={ArrowUp} label="Tốc độ Upload" value={uploadText} />
              <SpecRow icon={Router} label="Thiết bị đi kèm" value={equipmentText} />
              {d.maxDevices != null ? (
                <SpecRow
                  icon={Users}
                  label="Thiết bị kết nối tối đa"
                  value={`${d.maxDevices} thiết bị`}
                />
              ) : null}
              <SpecRow icon={Network} label="Loại hạ tầng" value={d.infrastructure ?? "—"} />
              {d.qosTechnology ? (
                <SpecRow icon={Gamepad2} label="Công nghệ ưu tiên" value={d.qosTechnology} />
              ) : null}
            </div>
          </section>

          {equipmentList.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-700">
                Thiết bị trong gói
              </h3>
              <div
                className={`grid gap-3 ${
                  equipmentList.length === 1 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"
                }`}
              >
                {equipmentList.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm"
                  >
                    <div className="flex h-20 w-full items-center justify-center">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <Router className="h-10 w-10 text-gray-300" strokeWidth={1.25} aria-hidden />
                      )}
                    </div>
                    <p className="mt-2 text-xs font-semibold text-gray-800">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {d.privileges?.length > 0 ? (
            <section className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <h3 className="mb-3 text-sm font-bold text-slate-900">Đặc quyền</h3>
              <ul className="space-y-4">
                {d.privileges.map((item, index) => {
                  const Icon = resolvePrivilegeIcon(item.icon);
                  const customImg = item.imageUrl?.trim();
                  return (
                    <li key={`${item.title}-${index}`} className="flex gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8f4fc] text-[#0066b3]">
                        {customImg ? (
                          <img src={customImg} alt="" className="h-8 w-8 object-contain" />
                        ) : (
                          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900">{item.title}</p>
                        {item.description ? (
                          <p className="mt-0.5 text-sm text-slate-600">{item.description}</p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {d.perks?.length > 0 ? (
            <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-blue-900">
                <Gift className="h-4 w-4" aria-hidden />
                Ưu đãi &amp; tính năng
              </h3>
              <ul className="space-y-2 text-sm text-blue-950/90">
                {d.perks.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="space-y-2 border-t border-gray-100 pt-4 text-xs leading-relaxed text-gray-500">
            <p>
              <strong className="font-semibold text-gray-600">Phí hòa mạng / lắp đặt:</strong>{" "}
              {d.installFeeNote}
            </p>
            <p>
              <strong className="font-semibold text-gray-600">Cam kết &amp; điều khoản:</strong>{" "}
              {d.contractNote}
            </p>
          </section>
        </div>

        <footer className="shrink-0 border-t border-gray-100 bg-white p-4 pb-safe sm:px-6">
          <button
            type="button"
            onClick={() => {
              onRegister?.(d.id);
              onClose();
            }}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-center text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700"
          >
            Đăng ký gói này ngay
          </button>
        </footer>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
