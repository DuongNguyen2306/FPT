import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import {
  deleteAdminNavigation,
  listAdminNavigation,
  reorderAdminNavigation,
} from "../../api/navigationApi.js";
import { NAV_ICON_OPTIONS } from "../../lib/navigationIcons.js";

function getApiError(err) {
  const msg = err?.response?.data?.message ?? err?.message;
  return typeof msg === "string" ? msg : "Đã có lỗi.";
}

function iconLabel(iconId) {
  return NAV_ICON_OPTIONS.find((o) => o.id === iconId)?.label ?? iconId ?? "—";
}

export default function AdminNavigationPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [reordering, setReordering] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAdminNavigation();
      const list = [...(data.items ?? [])].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      );
      setItems(list);
    } catch (err) {
      setToast(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (item) => {
    if (!window.confirm(`Xóa nhóm menu "${item.title}"?`)) return;
    try {
      await deleteAdminNavigation(item.id);
      setToast("Đã xóa nhóm menu.");
      load();
    } catch (err) {
      setToast(getApiError(err));
    }
  };

  const moveItem = async (index, direction) => {
    const next = index + direction;
    if (next < 0 || next >= items.length) return;
    const reordered = [...items];
    const [removed] = reordered.splice(index, 1);
    reordered.splice(next, 0, removed);
    setItems(reordered);
    setReordering(true);
    try {
      await reorderAdminNavigation(reordered.map((g) => g.id));
      setToast("Đã cập nhật thứ tự.");
    } catch (err) {
      setToast(getApiError(err));
      load();
    } finally {
      setReordering(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Menu điều hướng</h1>
          <p className="mt-1 text-sm text-slate-500">
            Mega-menu「Sản phẩm dịch vụ」trên header trang khách — nhóm cột và link con.
          </p>
        </div>
        <Link
          to="/admin/navigation/new"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Thêm nhóm menu
        </Link>
      </div>

      {toast ? (
        <p className="mb-4 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">{toast}</p>
      ) : null}

      {loading ? (
        <p className="text-slate-500">Đang tải…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <p className="text-slate-600">Chưa có nhóm menu nào.</p>
          <Link
            to="/admin/navigation/new"
            className="mt-4 inline-block text-sm font-semibold text-secondary hover:underline"
          >
            + Thêm nhóm đầu tiên
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">TT</th>
                <th className="px-4 py-3">Tiêu đề</th>
                <th className="px-4 py-3">Icon</th>
                <th className="px-4 py-3">Số mục</th>
                <th className="px-4 py-3">Hiển thị</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">
                    {item.displayOrder ?? index}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.title}</td>
                  <td className="px-4 py-3 text-slate-600">{iconLabel(item.icon)}</td>
                  <td className="px-4 py-3 text-slate-600">{(item.items ?? []).length}</td>
                  <td className="px-4 py-3">
                    {item.isVisible !== false ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <Eye className="h-3.5 w-3.5" />
                        Có
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <EyeOff className="h-3.5 w-3.5" />
                        Ẩn
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        disabled={reordering || index === 0}
                        onClick={() => moveItem(index, -1)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                        title="Lên trên"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={reordering || index === items.length - 1}
                        onClick={() => moveItem(index, 1)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                        title="Xuống dưới"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/navigation/${item.id}/edit`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                        title="Xóa"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
