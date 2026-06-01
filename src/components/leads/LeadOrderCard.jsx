import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { truncateOrderId } from "../registration/RegistrationSuccessCard.jsx";
import { formatVnd } from "../../lib/packageHelpers.js";
import {
  formatLeadDateTime,
  getLeadStatusBadgeClass,
  getLeadStatusLabel,
} from "../../lib/leadStatus.js";

/**
 * @param {{
 *   order: import('../../types/api').LeadPublicItem;
 *   showPhone?: boolean;
 * }} props
 */
export default function LeadOrderCard({ order, showPhone = false }) {
  const snap = order.packageSnapshot;

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mã đơn</p>
          <p className="font-mono text-sm font-bold text-secondary" title={order.id}>
            {truncateOrderId(order.id)}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${getLeadStatusBadgeClass(order.status)}`}
        >
          {getLeadStatusLabel(order.status)}
        </span>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Thời gian</dt>
          <dd className="font-medium text-slate-800">{formatLeadDateTime(order.createdAt)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Họ tên</dt>
          <dd className="font-medium text-slate-800">{order.fullName}</dd>
        </div>
        {showPhone ? (
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Điện thoại</dt>
            <dd className="font-medium text-slate-800">{order.phone}</dd>
          </div>
        ) : null}
        {snap?.name ? (
          <div className="flex justify-between gap-4">
            <dt className="flex items-center gap-1 text-slate-500">
              <Package className="h-3.5 w-3.5" aria-hidden />
              Gói
            </dt>
            <dd className="text-right font-medium text-slate-800">
              {snap.name}
              {typeof snap.price === "number" ? (
                <span className="mt-0.5 block text-primary">{formatVnd(snap.price)}/tháng</span>
              ) : null}
            </dd>
          </div>
        ) : null}
        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
          <dt className="text-slate-500">Địa chỉ lắp đặt</dt>
          <dd className="font-medium text-slate-800 sm:max-w-[60%] sm:text-right">
            {order.installAddress}
          </dd>
        </div>
      </dl>

      {snap?.code ? (
        <Link
          to={`/goi/${encodeURIComponent(snap.code)}`}
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Xem gói dịch vụ
        </Link>
      ) : null}
    </article>
  );
}
