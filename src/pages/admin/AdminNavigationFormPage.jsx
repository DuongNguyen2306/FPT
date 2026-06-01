import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
import { listAllAdminPackages } from "../../api/adminBanners.js";
import {
  createAdminNavigation,
  getAdminNavigation,
  updateAdminNavigation,
} from "../../api/navigationApi.js";
import { NAV_ICON_OPTIONS } from "../../lib/navigationIcons.js";

function getApiError(err) {
  const msg = err?.response?.data?.message ?? err?.message;
  return typeof msg === "string" ? msg : "Đã có lỗi.";
}

function emptyItem(displayOrder = 0) {
  return {
    label: "",
    link: "",
    packageCode: "",
    displayOrder,
    isNew: false,
    isVisible: true,
  };
}

/**
 * @param {{ mode: 'create' | 'edit' }} props
 */
export default function AdminNavigationFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [packages, setPackages] = useState([]);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("wifi");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isVisible, setIsVisible] = useState(true);
  const [items, setItems] = useState([emptyItem(0)]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    listAllAdminPackages().then(setPackages).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getAdminNavigation(id);
        if (cancelled) return;
        setTitle(data.title ?? "");
        setIcon(data.icon ?? "wifi");
        setDisplayOrder(String(data.displayOrder ?? 0));
        setIsVisible(data.isVisible !== false);
        const sorted = [...(data.items ?? [])].sort(
          (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        );
        setItems(
          sorted.length
            ? sorted.map((it, i) => ({
                label: it.label ?? "",
                link: it.link ?? "",
                packageCode: it.packageCode ?? "",
                displayOrder: it.displayOrder ?? i,
                isNew: !!it.isNew,
                isVisible: it.isVisible !== false,
              }))
            : [emptyItem(0)]
        );
      } catch (err) {
        if (!cancelled) setError(getApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEdit, id]);

  const updateItem = (index, patch) => {
    setItems((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, emptyItem(prev.length)]);
  };

  const removeItem = (index) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const moveItem = (index, direction) => {
    const next = index + direction;
    setItems((prev) => {
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      copy.splice(next, 0, removed);
      return copy.map((row, i) => ({ ...row, displayOrder: i }));
    });
  };

  const applyPackage = (index, packageId) => {
    const pkg = packages.find((p) => String(p.id ?? p._id) === packageId);
    if (!pkg?.code) return;
    updateItem(index, {
      packageCode: pkg.code,
      link: `/goi/${pkg.code}`,
      label: items[index]?.label?.trim() ? items[index].label : pkg.name ?? pkg.code,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Vui lòng nhập tiêu đề nhóm.");
      return;
    }

    const bodyItems = items
      .map((row, i) => ({
        label: row.label.trim(),
        link: row.link.trim(),
        packageCode: row.packageCode.trim() || undefined,
        displayOrder: Number.isFinite(Number(row.displayOrder)) ? Number(row.displayOrder) : i,
        isNew: !!row.isNew,
        isVisible: !!row.isVisible,
      }))
      .filter((row) => row.label);

    if (!bodyItems.length) {
      setError("Thêm ít nhất một mục menu con có nhãn.");
      return;
    }

    const body = {
      title: trimmedTitle,
      icon,
      displayOrder: Number(displayOrder) || 0,
      isVisible,
      items: bodyItems,
    };

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateAdminNavigation(id, body);
        setToast("Đã lưu nhóm menu.");
      } else {
        await createAdminNavigation(body);
        setToast("Đã tạo nhóm menu.");
        navigate("/admin/navigation", { replace: true });
      }
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Đang tải…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link to="/admin/navigation" className="text-sm font-medium text-secondary hover:underline">
          ← Menu điều hướng
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {isEdit ? "Sửa nhóm menu" : "Thêm nhóm menu"}
        </h1>
      </div>

      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}
      {toast ? (
        <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{toast}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
            Thông tin nhóm
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">Tiêu đề cột</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Internet - Wifi"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Icon</span>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {NAV_ICON_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Thứ tự hiển thị</span>
              <input
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">Hiển thị trên mega-menu</span>
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Mục menu con
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm mục
            </button>
          </div>

          <div className="space-y-4">
            {items.map((row, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-100 bg-slate-50/50 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase text-slate-500">
                    Mục #{index + 1}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveItem(index, -1)}
                      className="rounded p-1.5 text-slate-500 hover:bg-white disabled:opacity-40"
                      title="Lên"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === items.length - 1}
                      onClick={() => moveItem(index, 1)}
                      className="rounded p-1.5 text-slate-500 hover:bg-white disabled:opacity-40"
                      title="Xuống"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length <= 1}
                      className="rounded p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40"
                      title="Xóa mục"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-xs font-medium text-slate-600">Nhãn</span>
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) => updateItem(index, { label: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                      placeholder="Internet Wi-Fi 7"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-xs font-medium text-slate-600">
                      Gắn gói (tùy chọn — tự điền link)
                    </span>
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) applyPackage(index, e.target.value);
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="">— Chọn gói —</option>
                      {packages.map((p) => (
                        <option key={p.id ?? p._id} value={String(p.id ?? p._id)}>
                          {p.name} ({p.code})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-slate-600">
                      Mã gói (packageCode)
                    </span>
                    <input
                      type="text"
                      value={row.packageCode}
                      onChange={(e) => updateItem(index, { packageCode: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono"
                      placeholder="internet-giga"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-slate-600">Link</span>
                    <input
                      type="text"
                      value={row.link}
                      onChange={(e) => updateItem(index, { link: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                      placeholder="/goi/internet-giga hoặc /#internet"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-slate-600">Thứ tự</span>
                    <input
                      type="number"
                      min={0}
                      value={row.displayOrder}
                      onChange={(e) => updateItem(index, { displayOrder: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={row.isNew}
                        onChange={(e) => updateItem(index, { isNew: e.target.checked })}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-700">Tag「Mới」</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={row.isVisible}
                        onChange={(e) => updateItem(index, { isVisible: e.target.checked })}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-700">Hiển thị</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isEdit ? "Lưu thay đổi" : "Tạo nhóm"}
          </button>
          <Link
            to="/admin/navigation"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
