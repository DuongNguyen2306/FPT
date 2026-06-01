import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Pencil, Search } from "lucide-react";
import {
  deleteAdminPackage,
  fetchAllAdminPackages,
  patchAdminPackage,
} from "../../api/adminPackages.js";
import { formatVnd } from "../../lib/adminFormat.js";
import { matchesPackageSearch, sortAdminPackages } from "../../lib/adminPackageList.js";
import { friendlyApiError, PACKAGE_TYPE_LABELS } from "../../lib/userFacingText.js";

const TYPES = ["", "INTERNET", "SPEEDX", "FPT_PLAY", "CAMERA", "SERVICE"];

/** @type {readonly { value: string; label: string }[]} */
const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất trước" },
  { value: "oldest", label: "Cũ nhất trước" },
  { value: "sortOrder", label: "Thứ tự hiển thị" },
];

export default function AdminPackagesPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [type, setType] = useState("");
  const [isActive, setIsActive] = useState("");
  const [sort, setSort] = useState("newest");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      /** BE chỉ nhận page, limit (max 100), type, isActive — sort/tìm kiếm xử lý client */
      /** @type {Record<string, string | number | boolean>} */
      const params = {};
      if (type) params.type = type;
      if (isActive !== "") params.isActive = isActive === "true";

      let list = await fetchAllAdminPackages(params);
      if (search) {
        list = list.filter((pkg) => matchesPackageSearch(pkg, search));
      }
      list = sortAdminPackages(list, sort);

      const start = (page - 1) * limit;
      setItems(list.slice(start, start + limit));
      setTotal(list.length);
    } catch (err) {
      setToast(friendlyApiError(err, "Không tải được danh sách gói."));
    } finally {
      setLoading(false);
    }
  }, [page, limit, type, isActive, sort, search]);

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
      setToast(friendlyApiError(err, "Không tải được danh sách gói."));
    }
  };

  const handleRestore = async (pkg) => {
    const id = pkg.id ?? pkg._id;
    try {
      await patchAdminPackage(id, { isActive: true });
      setToast("Đã bật lại gói.");
      load();
    } catch (err) {
      setToast(friendlyApiError(err, "Không tải được danh sách gói."));
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setType("");
    setIsActive("");
    setSort("newest");
    setPage(1);
  };

  const hasFilters = search || type || isActive !== "" || sort !== "newest";

  return (
    <div>
      <div className="mb-4 rounded-xl border border-[#0066b3]/20 bg-[#0066b3]/5 px-4 py-3 text-sm text-slate-700">
        <strong className="text-slate-900">Banner carousel:</strong> quản lý tại menu{" "}
        <Link to="/admin/banners" className="font-semibold text-[#0066b3] hover:underline">
          Banner trang chủ
        </Link>
        . Ở đây chỉ thêm/sửa gói và ảnh sản phẩm.
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý gói cước</h1>
          <p className="mt-1 text-sm text-slate-500">Thêm, sửa và ẩn gói trên website.</p>
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

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative min-w-[12rem] flex-1 sm:min-w-[16rem]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm tên, mã gói, display code…"
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
        </div>

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          aria-label="Lọc loại gói"
        >
          <option value="">Tất cả loại</option>
          {TYPES.filter(Boolean).map((t) => (
            <option key={t} value={t}>
              {PACKAGE_TYPE_LABELS[t] ?? t}
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
          aria-label="Lọc trạng thái"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đang bán</option>
          <option value="false">Đã ẩn</option>
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          aria-label="Sắp xếp"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Xóa bộ lọc
          </button>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[800px] w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Banner / SP</th>
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
                  {search ? "Không tìm thấy gói phù hợp." : "Chưa có gói nào."}
                </td>
              </tr>
            ) : (
              items.map((pkg) => {
                const id = pkg.id ?? pkg._id;
                const active = pkg.isActive !== false;
                const banner = pkg.bannerImage;
                const product = pkg.heroImage ?? pkg.imageUrl;
                return (
                  <tr key={id} className="border-b border-slate-50 hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <div className="text-center">
                          {banner ? (
                            <img
                              src={banner}
                              alt=""
                              className="h-9 w-16 rounded border border-slate-200 object-cover"
                            />
                          ) : (
                            <span className="flex h-9 w-16 items-center justify-center rounded border border-dashed border-slate-200 text-[10px] text-slate-400">
                              Banner
                            </span>
                          )}
                          <span className="mt-0.5 block text-[10px] text-slate-400">Banner</span>
                        </div>
                        <div className="text-center">
                          {product ? (
                            <img
                              src={product}
                              alt=""
                              className="h-9 w-9 rounded border border-slate-200 object-cover"
                            />
                          ) : (
                            <span className="flex h-9 w-9 items-center justify-center rounded border border-dashed border-slate-200 text-[10px] text-slate-400">
                              SP
                            </span>
                          )}
                          <span className="mt-0.5 block text-[10px] text-slate-400">Sản phẩm</span>
                        </div>
                      </div>
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
                          title="Sửa gói"
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
          {search ? (
            <>
              Tìm thấy {total} gói — trang {page}/{totalPages}
            </>
          ) : (
            <>
              Tổng {total} gói — trang {page}/{totalPages}
            </>
          )}
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
