import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { patchAdminLead } from "../api/adminLeads.js";
import { formatDateTime } from "../lib/adminFormat.js";

const STATUS_OPTIONS = [
  { value: "NEW", label: "Mới" },
  { value: "CONTACTED", label: "Đã liên hệ" },
  { value: "CONVERTED", label: "Chốt" },
  { value: "CANCELLED", label: "Hủy" },
];

export default function LeadDetailDrawer({ lead, onClose, onSaved }) {
  const [status, setStatus] = useState(lead?.status ?? "NEW");
  const [adminNote, setAdminNote] = useState(lead?.adminNote ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setAdminNote(lead.adminNote ?? "");
      setError("");
    }
  }, [lead]);

  if (!lead) return null;

  const leadId = lead._id ?? lead.id;

  const onSave = async () => {
    setSaving(true);
    setError("");
    try {
      await patchAdminLead(leadId, { status, adminNote });
      onSaved?.();
      onClose?.();
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message;
      setError(typeof msg === "string" ? msg : "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Đóng" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">Chi tiết yêu cầu</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 text-sm">
          <dl className="space-y-3">
            <div>
              <dt className="text-slate-500">Ngày tạo</dt>
              <dd className="font-medium">{formatDateTime(lead.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Họ tên</dt>
              <dd className="font-medium">{lead.fullName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">SĐT</dt>
              <dd className="font-medium">{lead.phone}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Địa chỉ lắp đặt</dt>
              <dd>{lead.installAddress}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Gói quan tâm</dt>
              <dd>{lead.packageSnapshot?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Nguồn</dt>
              <dd>{lead.source ?? "Website"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Tài khoản khách</dt>
              <dd>{lead.customerId ? "Đã liên kết" : "Chưa có"}</dd>
            </div>
          </dl>

          <hr className="my-6 border-slate-100" />

          {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

          <label className="block text-sm font-medium text-slate-700">Trạng thái</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-medium text-slate-700">Ghi chú admin</label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={5}
            className="mt-1 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5"
            placeholder="Gọi lại 18h, khách quan tâm gói…"
          />
        </div>

        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="w-full rounded-xl bg-secondary py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </div>
      </aside>
    </div>
  );
}
