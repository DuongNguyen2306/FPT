import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { patchPackageRegistration } from "../api/adminLeads.js";
import { fetchAllAdminPackages } from "../api/adminPackages.js";
import { formatDateTime } from "../lib/adminFormat.js";
import { LEAD_STATUS_LABEL } from "../lib/leadStatus.js";

const CUSTOM_PACKAGE = "__custom__";
const STATUS_OPTIONS = Object.entries(LEAD_STATUS_LABEL).map(([value, label]) => ({
  value,
  label,
}));

export default function LeadDetailDrawer({ lead, onClose, onSaved }) {
  const [status, setStatus] = useState(lead?.status ?? "NEW");
  const [adminNote, setAdminNote] = useState("");
  const [packageSelect, setPackageSelect] = useState("");
  const [customPackageName, setCustomPackageName] = useState("");
  const [installAddress, setInstallAddress] = useState("");
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [addressError, setAddressError] = useState("");

  const packageOptions = useMemo(() => {
    const names = packages
      .filter((p) => p.isActive !== false)
      .map((p) => p.name)
      .filter(Boolean);
    const unique = [...new Set(names)];
    const current = lead?.packageSnapshot?.name?.trim();
    if (current && !unique.includes(current)) {
      unique.unshift(current);
    }
    return unique;
  }, [packages, lead?.packageSnapshot?.name]);

  const resolvedPackageName =
    packageSelect === CUSTOM_PACKAGE ? customPackageName.trim() : packageSelect.trim();

  const addressValid = installAddress.trim().length >= 5;

  useEffect(() => {
    if (!lead) return;

    const initialName = lead.packageSnapshot?.name?.trim() ?? "";
    const initialNote = lead.adminNotes ?? lead.adminNote ?? "";

    setStatus(lead.status ?? "NEW");
    setAdminNote(initialNote);
    setInstallAddress(lead.installAddress ?? "");
    setCustomPackageName("");
    setError("");
    setAddressError("");

    setPackageSelect(initialName || "");
    setCustomPackageName("");

    let cancelled = false;
    setPackagesLoading(true);
    (async () => {
      try {
        const items = await fetchAllAdminPackages();
        if (cancelled) return;
        setPackages(items ?? []);
        const activeNames = (items ?? [])
          .filter((p) => p.isActive !== false)
          .map((p) => p.name)
          .filter(Boolean);
        if (initialName && !activeNames.includes(initialName)) {
          setPackageSelect(initialName);
        } else if (initialName) {
          setPackageSelect(initialName);
        } else {
          setPackageSelect("");
        }
      } catch {
        if (!cancelled) setPackages([]);
        if (initialName) setPackageSelect(initialName);
      } finally {
        if (!cancelled) setPackagesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lead]);

  if (!lead) return null;

  const leadId = lead._id ?? lead.id;

  const onSave = async () => {
    if (!addressValid) {
      setAddressError("Địa chỉ lắp đặt cần ít nhất 5 ký tự.");
      return;
    }
    if (!resolvedPackageName) {
      setError("Vui lòng chọn hoặc nhập tên gói quan tâm.");
      return;
    }

    setSaving(true);
    setError("");
    setAddressError("");
    try {
      await patchPackageRegistration(leadId, {
        packageName: resolvedPackageName,
        status,
        adminNotes: adminNote,
        address: installAddress.trim(),
      });
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

          <label className="block text-sm font-medium text-slate-700">Gói quan tâm</label>
          <select
            value={packageSelect}
            onChange={(e) => {
              setPackageSelect(e.target.value);
              setError("");
            }}
            disabled={packagesLoading}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 disabled:bg-slate-50"
          >
            <option value="">{packagesLoading ? "Đang tải gói…" : "— Chọn gói —"}</option>
            {packageOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            <option value={CUSTOM_PACKAGE}>Khác (nhập tên gói)</option>
          </select>
          {packageSelect === CUSTOM_PACKAGE ? (
            <input
              type="text"
              value={customPackageName}
              onChange={(e) => {
                setCustomPackageName(e.target.value);
                setError("");
              }}
              placeholder="Tên gói tùy chỉnh"
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          ) : null}

          <label className="mt-4 block text-sm font-medium text-slate-700">Địa chỉ lắp đặt</label>
          <textarea
            value={installAddress}
            onChange={(e) => {
              setInstallAddress(e.target.value);
              if (e.target.value.trim().length >= 5) setAddressError("");
            }}
            rows={3}
            className="mt-1 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5"
            placeholder="Số nhà, đường, quận, thành phố…"
          />
          {addressError ? <p className="mt-1 text-xs text-red-600">{addressError}</p> : null}

          <label className="mt-4 block text-sm font-medium text-slate-700">Trạng thái</label>
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
            disabled={saving || !addressValid || !resolvedPackageName}
            className="w-full rounded-xl bg-secondary py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </div>
      </aside>
    </div>
  );
}
