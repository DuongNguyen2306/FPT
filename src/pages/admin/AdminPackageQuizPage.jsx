import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteAdminPackageQuiz, listAdminPackageQuizzes } from "../../api/adminPackageQuiz.js";

function getApiError(err) {
  const msg = err?.response?.data?.message ?? err?.message;
  return typeof msg === "string" ? msg : "Đã có lỗi.";
}

export default function AdminPackageQuizPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAdminPackageQuizzes();
      setItems(data.items ?? []);
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
    const label = item.code || item.tagline || "quiz";
    if (!window.confirm(`Xóa bộ gợi ý "${label}"?`)) return;
    try {
      await deleteAdminPackageQuiz(item.id ?? item._id);
      setToast("Đã xóa.");
      load();
    } catch (err) {
      setToast(getApiError(err));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gợi ý gói / Quiz</h1>
          <p className="mt-1 text-sm text-slate-500">
            Cấu hình câu hỏi và trọng số loại gói (INTERNET, SpeedX, Play…).
          </p>
        </div>
        <Link
          to="/admin/package-quiz/new"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Thêm bộ quiz
        </Link>
      </div>

      {toast ? (
        <p className="mb-4 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">{toast}</p>
      ) : null}

      {loading ? (
        <p className="text-slate-500">Đang tải…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <p className="text-slate-600">Chưa có bộ quiz. Chạy seed BE hoặc tạo mới.</p>
          <Link
            to="/admin/package-quiz/new"
            className="mt-4 inline-block text-sm font-semibold text-secondary hover:underline"
          >
            + Thêm bộ quiz
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Tagline</th>
                <th className="px-4 py-3">Số câu</th>
                <th className="px-4 py-3">Hiển thị</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id ?? item._id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono text-xs">{item.code}</td>
                  <td className="px-4 py-3">{item.tagline ?? "—"}</td>
                  <td className="px-4 py-3">{(item.questions ?? []).length}</td>
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
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/package-quiz/${item.id ?? item._id}/edit`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
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
