import { useState } from "react";
import { Check, Copy, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { formatVnd } from "../../lib/packageHelpers.js";

function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return String(iso);
  }
}

/** @param {string} id */
export function truncateOrderId(id) {
  const s = String(id ?? "").trim();
  if (!s) return "—";
  if (s.length <= 14) return s;
  return `${s.slice(0, 7)}...${s.slice(-4)}`;
}

/**
 * @param {{ label: string; children: import('react').ReactNode }} props
 */
function DetailRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</dt>
      <dd className="min-w-0 text-sm font-bold text-gray-800 sm:text-right">{children}</dd>
    </div>
  );
}

/**
 * @param {{
 *   orderId: string;
 *   createdAt?: string;
 *   packageName: string;
 *   speed?: string | null;
 *   price?: number | null;
 *   customerName: string;
 *   phone: string;
 *   address: string;
 *   packageDetailPath?: string | null;
 *   onGoHome?: () => void;
 *   phone?: string | null;
 * }} props
 */
export default function RegistrationSuccessCard({
  orderId,
  createdAt,
  packageName,
  speed = null,
  price = null,
  customerName,
  phone,
  address,
  packageDetailPath = null,
  onGoHome,
}) {
  const [copied, setCopied] = useState(false);
  const shortId = truncateOrderId(orderId);

  const copyOrderId = async () => {
    if (!orderId) return;
    try {
      await navigator.clipboard.writeText(String(orderId));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <article className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] sm:p-10">
      {/* Header */}
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
        <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden />
      </div>
      <h1 className="mb-2 text-2xl font-extrabold text-emerald-600">Đăng ký thành công</h1>
      <p className="mx-auto max-w-md text-sm text-gray-500">
        Cảm ơn bạn đã đăng ký{" "}
        <span className="font-semibold text-gray-700">{packageName}</span>. Nhân viên FPT Telecom sẽ
        liên hệ trong thời gian sớm nhất để xác nhận đơn hàng.
      </p>

      {/* Body */}
      <div className="my-6 border-t border-b border-gray-100 py-6 text-left">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Thông tin gói cước
            </h2>
            <dl className="space-y-4">
              <DetailRow label="Mã đơn">
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-mono text-xs" title={orderId}>
                    {shortId}
                  </span>
                  <button
                    type="button"
                    onClick={copyOrderId}
                    className="inline-flex rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                    aria-label="Sao chép mã đơn"
                  >
                    {copied ? (
                      <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </span>
              </DetailRow>
              <DetailRow label="Thời gian">{formatDateTime(createdAt)}</DetailRow>
              <DetailRow label="Gói đăng ký">{packageName}</DetailRow>
              {speed ? <DetailRow label="Tốc độ">{speed}</DetailRow> : null}
              {price != null ? (
                <DetailRow label="Giá dự kiến">
                  <span className="text-blue-700">{formatVnd(price)}/tháng</span>
                </DetailRow>
              ) : null}
            </dl>
          </section>

          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Thông tin khách hàng
            </h2>
            <dl className="space-y-4">
              <DetailRow label="Họ tên">{customerName}</DetailRow>
              <DetailRow label="Điện thoại">{phone}</DetailRow>
              <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-4">
                <dt className="shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Địa chỉ lắp đặt
                </dt>
                <dd className="text-sm font-bold text-gray-800 md:max-w-[58%] md:text-right">
                  {address}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:space-x-4">
        <button
          type="button"
          onClick={onGoHome}
          className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 sm:w-auto"
        >
          Về trang chủ
        </button>
        {packageDetailPath ? (
          <Link
            to={packageDetailPath}
            className="w-full rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 sm:w-auto"
          >
            Xem chi tiết gói
          </Link>
        ) : null}
      </div>

      {phone ? (
        <p className="mt-5 text-center text-sm">
          <Link
            to={`/tra-cuu-don?phone=${encodeURIComponent(phone)}`}
            className="font-medium text-orange-500 transition-colors hover:text-orange-600"
          >
            Xem tất cả đơn đăng ký của số này
          </Link>
        </p>
      ) : null}
    </article>
  );
}
