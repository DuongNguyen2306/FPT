import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  fetchAdminBannerCatalog,
  removeBannerItem,
} from "../../api/adminBanners.js";
import { PACKAGE_TYPE_LABELS } from "../../lib/userFacingText.js";

function getApiError(err) {
  const msg = err?.response?.data?.message ?? err?.message;
  return typeof msg === "string" ? msg : "Đã có lỗi.";
}

export default function AdminBannersPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminBannerCatalog();
      setItems(data.items);
    } catch (err) {
      setToast(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const standaloneItems = useMemo(
    () => items.filter((b) => b.kind === "standalone"),
    [items]
  );
  const packageItems = useMemo(() => items.filter((b) => b.kind === "package"), [items]);

  const shown =
    filter === "standalone"
      ? standaloneItems
      : filter === "package"
        ? packageItems
        : items;

  const editPath = (item) =>
    item.kind === "package"
      ? `/admin/banners/package/${item.packageId}/edit`
      : `/admin/banners/${item.id}/edit`;

  const handleRemove = async (item) => {
    const label = item.title || "banner";
    if (!window.confirm(`Gỡ "${label}" khỏi carousel trang chủ?`)) return;
    try {
      await removeBannerItem(item);
      setToast("Đã gỡ banner.");
      load();
    } catch (err) {
      setToast(getApiError(err));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Banner trang chủ</h1>
          <p className="mt-1 text-sm text-slate-500">
            Carousel 21:9. Có thể gắn gói cước hoặc banner độc lập (tiêu đề / phụ đề tự nhập).
          </p>
        </div>
        <Link
          to="/admin/banners/new"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Thêm banner
        </Link>
      </div>

      {toast ? (
        <p className="mb-4 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">{toast}</p>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { value: "all", label: `Tất cả (${items.length})` },
          { value: "standalone", label: `Độc lập (${standaloneItems.length})` },
          { value: "package", label: `Gắn gói (${packageItems.length})` },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              filter === tab.value
                ? "bg-secondary text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500">Đang tải…</p>
      ) : shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <p className="text-slate-600">Chưa có banner nào.</p>
          <Link
            to="/admin/banners/new"
            className="mt-4 inline-block text-sm font-semibold text-secondary hover:underline"
          >
            + Thêm banner đầu tiên
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((item) => (
            <article
              key={`${item.kind}-${item.id}`}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[21/9] bg-slate-100">
                <img src={item.image} alt="" className="h-full w-full object-cover" />
                <span
                  className={`absolute left-2 top-2 rounded px-2 py-0.5 text-xs font-medium text-white ${
                    item.kind === "standalone" ? "bg-violet-600" : "bg-[#0066b3]"
                  }`}
                >
                  {item.kind === "standalone" ? "Độc lập" : "Gắn gói"}
                </span>
                {!item.isActive ? (
                  <span className="absolute right-2 top-2 rounded bg-slate-900/70 px-2 py-0.5 text-xs text-white">
                    Đã ẩn
                  </span>
                ) : null}
              </div>
              <div className="p-4">
                <p className="font-semibold text-slate-900">{item.title?.trim() || "Banner"}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{item.subtitle || "—"}</p>
                {item.kind === "package" ? (
                  <p className="mt-1 text-xs text-slate-400">
                    {PACKAGE_TYPE_LABELS[item.type] ?? item.type} · {item.code}
                    {item.sortOrder != null ? ` · TT ${item.sortOrder}` : ""}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-400">
                    Banner độc lập{item.sortOrder != null ? ` · TT ${item.sortOrder}` : ""}
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(editPath(item))}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="rounded-lg border border-red-100 px-3 py-2 text-red-600 hover:bg-red-50"
                    title="Gỡ banner"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
