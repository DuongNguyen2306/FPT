import { useCallback, useEffect, useState } from "react";
import LeadDetailDrawer from "../../admin/LeadDetailDrawer.jsx";
import { listAdminLeads } from "../../api/adminLeads.js";
import { formatDateTime } from "../../lib/adminFormat.js";

const STATUS_BADGE = {
  NEW: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-amber-100 text-amber-800",
  CONVERTED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-slate-200 text-slate-600",
};

const STATUS_LABEL = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  CONVERTED: "Chốt",
  CANCELLED: "Hủy",
};

function getApiError(err) {
  const msg = err?.response?.data?.message ?? err?.message;
  return typeof msg === "string" ? msg : "Đã có lỗi.";
}

export default function AdminLeadsPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (status) params.status = status;
      if (phone.trim()) params.phone = phone.trim();
      if (from) params.from = new Date(from).toISOString();
      if (to) params.to = new Date(to + "T23:59:59").toISOString();
      const data = await listAdminLeads(params);
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setToast(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, phone, from, to]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Khách đăng ký dịch vụ</h1>
      <p className="mt-1 text-sm text-slate-500">Danh sách yêu cầu tư vấn từ website.</p>

      {toast ? (
        <p className="mt-4 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">{toast}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">Tất cả trạng thái</option>
          {Object.keys(STATUS_LABEL).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          type="search"
          placeholder="Tìm SĐT"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          className="min-w-[10rem] rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => {
            setPage(1);
            load();
          }}
          className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white"
        >
          Lọc
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3">Khách</th>
              <th className="px-4 py-3">SĐT</th>
              <th className="px-4 py-3">Gói</th>
              <th className="px-4 py-3">Địa chỉ</th>
              <th className="px-4 py-3">TT</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  Đang tải…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  Chưa có yêu cầu nào.
                </td>
              </tr>
            ) : (
              items.map((lead) => {
                const lid = lead._id ?? lead.id;
                return (
                  <tr key={lid} className="border-b border-slate-50 hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      {formatDateTime(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium">{lead.fullName}</td>
                    <td className="px-4 py-3">{lead.phone}</td>
                    <td className="px-4 py-3">{lead.packageSnapshot?.name ?? "—"}</td>
                    <td className="max-w-[12rem] truncate px-4 py-3" title={lead.installAddress}>
                      {lead.installAddress}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          STATUS_BADGE[lead.status] ?? "bg-slate-100"
                        }`}
                      >
                        {STATUS_LABEL[lead.status] ?? lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelected(lead)}
                        className="text-secondary hover:underline"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <p>
          Tổng {total} — trang {page}/{totalPages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border px-3 py-1 disabled:opacity-40"
          >
            Trước
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-3 py-1 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      </div>

      <LeadDetailDrawer
        lead={selected}
        onClose={() => setSelected(null)}
        onSaved={() => {
          setToast("Đã cập nhật yêu cầu.");
          load();
        }}
      />
    </div>
  );
}
