import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Pencil } from "lucide-react";
import {
  deleteAdminPackage,
  listAdminPackages,
  patchAdminPackage,
} from "../../api/adminPackages.js";
import { formatVnd } from "../../lib/adminFormat.js";
import { PACKAGE_TYPE_LABELS } from "../../lib/userFacingText.js";

const TYPES = ["", "INTERNET", "SPEEDX", "FPT_PLAY", "CAMERA", "SERVICE"];

function getApiError(err) {
  const msg = err?.response?.data?.message ?? err?.message;
  return typeof msg === "string" ? msg : "Đã có lỗi.";
}

export default function AdminPackagesPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [type, setType] = useState("");
  const [isActive, setIsActive] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (type) params.type = type;
      if (isActive !== "") params.isActive = isActive === "true";
      const data = await listAdminPackages(params);
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setToast(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, [page, limit, type, isActive]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleHide = async (pkg) => {
    const id = pkg.id ?? pkg._id;
    const name = pkg.name ?? pkg.code;
    if (!window.confirm(`Ẩn gói "${name}" khỏi trang bán hàng?`)) return;
    try {
      await deleteAdminPackage(id);
      setToast("Đã ẩn gói.");
      load();
    } catch (err) {
      setToast(getApiError(err));
    }
  };

  const handleRestore = async (pkg) => {
    const id = pkg.id ?? pkg._id;
    try {
      await patchAdminPackage(id, { isActive: true });
      setToast("Đã bật lại gói.");
      load();
    } catch (err) {
      setToast(getApiError(err));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý gói cước</h1>
          <p className="mt-1 text-sm text-slate-500">Thêm, sửa và ẩn gói khỏi trang bán hàng.</p>
        </div>
        <Link
          to="/admin/packages/new"
          className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          + Thêm gói
        </Link>
      </div>

      {toast ? (
        <p className="mb-4 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">{toast}</p>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">Tất cả loại</option>
          {TYPES.filter(Boolean).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={isActive}
          onChange={(e) => {
            setIsActive(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đang bán</option>
          <option value="false">Đã ẩn</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[800px] w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 w-16">Ảnh</th>
              <th className="px-4 py-3">Gói</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Giá</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thứ tự</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                  Đang tải…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                  Chưa có gói nào.
                </td>
              </tr>
            ) : (
              items.map((pkg) => {
                const id = pkg.id ?? pkg._id;
                const active = pkg.isActive !== false;
                const hero = pkg.heroImage ?? pkg.imageUrl;
                return (
                  <tr key={id} className="border-b border-slate-50 hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      {hero ? (
                        <img
                          src={hero}
                          alt=""
                          className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{pkg.name}</p>
                      <p className="text-xs text-slate-500">{pkg.displayCode ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      {PACKAGE_TYPE_LABELS[pkg.type] ?? pkg.type}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{pkg.code}</td>
                    <td className="px-4 py-3">{formatVnd(pkg.price ?? pkg.monthlyPrice)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {active ? "Đang bán" : "Đã ẩn"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{pkg.sortOrder ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          title="Sửa"
                          onClick={() =>
                            navigate(`/admin/packages/${id}/edit`, { state: { pkg } })
                          }
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {active ? (
                          <button
                            type="button"
                            title="Ẩn gói"
                            onClick={() => handleHide(pkg)}
                            className="rounded-lg p-2 text-amber-700 hover:bg-amber-50"
                          >
                            <EyeOff className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Bật lại"
                            onClick={() => handleRestore(pkg)}
                            className="rounded-lg p-2 text-emerald-700 hover:bg-emerald-50"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                      </div>
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
          Tổng {total} gói — trang {page}/{totalPages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-40"
          >
            Trước
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
