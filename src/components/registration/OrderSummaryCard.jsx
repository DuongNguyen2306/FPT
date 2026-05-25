import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatVnd } from "../../lib/packageHelpers.js";

function CollapseSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-800"
      >
        {title}
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
        )}
      </button>
      {open ? <div className="px-4 py-3">{children}</div> : null}
    </div>
  );
}

/**
 * @param {{
 *   fullName: string;
 *   phone: string;
 *   address?: string;
 *   packageName?: string;
 *   price?: number;
 *   step: 1 | 2 | 3;
 *   loading?: boolean;
 *   canContinue?: boolean;
 *   onContinue: () => void;
 *   continueLabel?: string;
 * }} props
 */
export default function OrderSummaryCard({
  fullName,
  phone,
  address = "",
  packageName,
  price,
  step,
  loading = false,
  canContinue = false,
  onContinue,
  continueLabel = "Tiếp tục",
}) {
  const displayName = fullName.trim() || "—";
  const displayPhone = phone.trim() || "—";
  const displayAddress = address.trim() || "—";
  const planLine = packageName ? `${packageName} - 1 tháng` : "—";

  return (
    <aside className="rounded-2xl border border-slate-100 bg-white shadow-sm lg:sticky lg:top-24">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-lg font-bold text-slate-900">Thông tin đơn hàng</h2>
      </div>

      <CollapseSection title="Thông tin lắp đặt">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Họ tên</dt>
            <dd className="font-medium text-slate-800">{displayName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Số điện thoại</dt>
            <dd className="font-medium text-slate-800">{displayPhone}</dd>
          </div>
          {step >= 2 ? (
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-slate-500">Địa chỉ</dt>
              <dd className="max-w-[60%] text-right font-medium text-slate-800">
                {displayAddress}
              </dd>
            </div>
          ) : null}
        </dl>
      </CollapseSection>

      <CollapseSection title="Thông tin thanh toán">
        <div className="flex items-start justify-between gap-3 text-sm">
          <span className="text-slate-700">{planLine}</span>
          {typeof price === "number" ? (
            <span className="shrink-0 font-semibold text-slate-800">{formatVnd(price)}</span>
          ) : (
            <span className="shrink-0 text-slate-500">Liên hệ</span>
          )}
        </div>
      </CollapseSection>

      <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Tạm tính</span>
          {typeof price === "number" ? (
            <span className="text-2xl font-extrabold text-[#0066b3]">{formatVnd(price)}</span>
          ) : (
            <span className="text-lg font-bold text-slate-600">Liên hệ</span>
          )}
        </div>

        {step < 3 ? (
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue || loading}
            className="mt-4 w-full rounded-lg py-3.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 enabled:bg-[#0066b3] enabled:hover:bg-[#0056a3]"
          >
            {loading ? "Đang xử lý…" : continueLabel}
          </button>
        ) : null}

        {step < 3 ? (
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Bằng việc tiếp tục, bạn đồng ý cho FPT Telecom liên hệ và xử lý dữ liệu theo{" "}
            <a href="#" className="text-[#0066b3] hover:underline">
              Chính sách xử lý dữ liệu cá nhân
            </a>
            .
          </p>
        ) : null}
      </div>
    </aside>
  );
}
