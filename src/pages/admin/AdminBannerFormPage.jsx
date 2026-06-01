import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PackageImagePicker from "../../components/admin/PackageImagePicker.jsx";
import {
  createStandaloneBanner,
  getAdminBanner,
  listAllAdminPackages,
  savePackageBanner,
  updateStandaloneBanner,
  uploadBannerImage,
} from "../../api/adminBanners.js";
import { findAdminPackageById } from "../../api/adminPackages.js";
import { isBannerOnlyPackage } from "../../lib/packageHelpers.js";
import { validateImageFile, mapPackageApiError } from "../../lib/packageFormValidate.js";

/**
 * @param {{ mode: 'create' | 'edit'; linkType?: 'package' | 'standalone' }} props
 */
export default function AdminBannerFormPage({ mode, linkType }) {
  const { packageId: packageIdParam, bannerId: bannerIdParam } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";
  const isPackageEdit = linkType === "package";

  const [packages, setPackages] = useState([]);
  const [packageId, setPackageId] = useState(packageIdParam ?? "");
  const [standaloneId, setStandaloneId] = useState(
    !isPackageEdit && isEdit ? bannerIdParam ?? "" : ""
  );
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toastKind, setToastKind] = useState("success");

  const selectedPkg = packages.find((p) => String(p.id ?? p._id) === packageId);
  const linkedToPackage = !!packageId;

  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [bannerPreview]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isEdit) {
        setLoading(false);
        try {
          const all = await listAllAdminPackages();
          if (!cancelled) setPackages(all);
        } catch {
          /* optional list */
        }
        return;
      }

      setLoading(true);
      try {
        const all = await listAllAdminPackages();
        if (!cancelled) setPackages(all);

        if (isPackageEdit && packageIdParam) {
          const pkg =
            all.find((p) => String(p.id ?? p._id) === packageIdParam) ??
            (await findAdminPackageById(packageIdParam));
          if (!pkg) throw new Error("Không tìm thấy gói.");
          if (!cancelled) {
            setPackageId(String(pkg.id ?? pkg._id));
            setBannerImage(pkg.bannerImage ?? "");
            setTitle(pkg.name ?? "");
            setSubtitle(pkg.tagline ?? "");
            setSortOrder(String(pkg.sortOrder ?? 0));
            setIsActive(pkg.isActive !== false);
          }
        } else if (bannerIdParam) {
          try {
            const b = await getAdminBanner(bannerIdParam);
            if (!cancelled) {
              setStandaloneId(String(b.id ?? b._id ?? bannerIdParam));
              setBannerImage(b.imageUrl ?? b.bannerImage ?? "");
              setTitle(b.title ?? b.name ?? "");
              setSubtitle(b.subtitle ?? b.tagline ?? "");
              setSortOrder(String(b.sortOrder ?? 0));
              setIsActive(b.isActive !== false);
              if (b.packageId) setPackageId(String(b.packageId));
            }
          } catch (err) {
            if (err?.response?.status === 404) {
              const pkg =
                all.find((p) => String(p.id ?? p._id) === bannerIdParam) ??
                (await findAdminPackageById(bannerIdParam));
              if (!pkg) throw new Error("Không tìm thấy banner.");
              if (!cancelled) {
                setStandaloneId(String(pkg.id ?? pkg._id));
                setBannerImage(pkg.bannerImage ?? "");
                setTitle(pkg.name ?? "");
                setSubtitle(pkg.tagline ?? "");
                setSortOrder(String(pkg.sortOrder ?? 0));
                setIsActive(pkg.isActive !== false);
                if (!isBannerOnlyPackage(pkg)) {
                  setPackageId(String(pkg.id ?? pkg._id));
                }
              }
            } else {
              throw err;
            }
          }
        }
      } catch (err) {
        if (!cancelled) setError(mapPackageApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEdit, isPackageEdit, packageIdParam, bannerIdParam]);

  useEffect(() => {
    if (!isEdit) {
      listAllAdminPackages().then(setPackages).catch(() => {});
    }
  }, [isEdit]);

  useEffect(() => {
    if (linkedToPackage && selectedPkg) {
      setTitle(selectedPkg.name ?? "");
      setSubtitle(selectedPkg.tagline ?? "");
    }
  }, [linkedToPackage, selectedPkg?.id]);

  const onBannerFileChange = async (file) => {
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    if (!file) {
      setBannerFile(null);
      setBannerPreview(null);
      return;
    }
    const err = validateImageFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    const preview = URL.createObjectURL(file);
    setBannerFile(file);
    setBannerPreview(preview);
    setBannerUploading(true);
    try {
      const up = await uploadBannerImage(file);
      setBannerImage(up.url);
      setBannerFile(null);
      URL.revokeObjectURL(preview);
      setBannerPreview(null);
      if (up.fallback) {
        setToastKind("warning");
        setToast("Mạng chậm, đã dùng ảnh dự phòng");
      } else {
        setToastKind("success");
        setToast("Đã tải ảnh banner lên.");
      }
    } catch (err) {
      setError(mapPackageApiError(err));
    } finally {
      setBannerUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setToast("");

    if (!bannerImage.trim() && !bannerFile) {
      setError("Chọn ảnh banner từ máy (tỉ lệ 21:9).");
      return;
    }

    const slideTitle = linkedToPackage
      ? (selectedPkg?.name ?? title).trim()
      : title.trim();
    const slideSubtitle = linkedToPackage
      ? (selectedPkg?.tagline ?? subtitle).trim()
      : subtitle.trim();

    setSaving(true);
    try {
      let url = bannerImage.trim();
      if (bannerFile) {
        const up = await uploadBannerImage(bannerFile);
        url = up.url;
        if (up.fallback) {
          setToastKind("warning");
          setToast("Mạng chậm, đã dùng ảnh dự phòng");
        }
      }

      const order = Number(sortOrder) || 0;

      if (linkedToPackage) {
        await savePackageBanner(packageId, url, { sortOrder: order, isActive });
      } else if (isEdit && standaloneId) {
        await updateStandaloneBanner(standaloneId, {
          imageUrl: url,
          title: slideTitle || undefined,
          subtitle: slideSubtitle || undefined,
          sortOrder: order,
          isActive,
        });
      } else {
        await createStandaloneBanner({
          imageUrl: url,
          title: slideTitle || undefined,
          subtitle: slideSubtitle || undefined,
          sortOrder: order,
          isActive,
        });
      }

      setToastKind("success");
      setToast(isEdit ? "Đã cập nhật banner." : "Đã thêm banner trang chủ.");
      setTimeout(() => navigate("/admin/banners", { replace: true }), 400);
    } catch (err) {
      setError(mapPackageApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-500">Đang tải…</p>;
  }

  return (
    <div className="max-w-2xl">
      <Link to="/admin/banners" className="text-sm text-secondary hover:underline">
        ← Danh sách banner
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">
        {isEdit ? "Sửa banner" : "Thêm banner trang chủ"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Chỉ cần <strong>ảnh banner</strong> (21:9) là lưu được. Gói, tiêu đề, phụ đề đều tùy chọn.
      </p>

      {toast ? (
        <p
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            toastKind === "warning"
              ? "bg-amber-50 text-amber-900"
              : "bg-emerald-50 text-emerald-800"
          }`}
        >
          {toast}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <label htmlFor="banner-pkg" className="text-sm font-medium text-slate-700">
            Gói cước gắn banner{" "}
            <span className="font-normal text-slate-400">(tùy chọn)</span>
          </label>
          <select
            id="banner-pkg"
            value={packageId}
            onChange={(e) => {
              const nextId = e.target.value;
              setPackageId(nextId);
              const p = packages.find((x) => String(x.id ?? x._id) === nextId);
              if (p) {
                setTitle(p.name ?? "");
                setSubtitle(p.tagline ?? "");
                setSortOrder(String(p.sortOrder ?? 0));
                setIsActive(p.isActive !== false);
                if (!bannerImage && p.bannerImage) setBannerImage(p.bannerImage);
              }
            }}
            disabled={(isEdit && isPackageEdit) || saving || bannerUploading}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 disabled:bg-slate-50"
          >
            <option value="">— Không gắn gói —</option>
            {packages.map((p) => {
              const pid = String(p.id ?? p._id);
              return (
                <option key={pid} value={pid}>
                  {p.name} ({p.code}){p.bannerImage ? " · đã có banner" : ""}
                </option>
              );
            })}
          </select>
          {linkedToPackage && selectedPkg ? (
            <p className="mt-2 text-xs text-slate-500">
              Tiêu đề / phụ đề lấy từ gói (có thể sửa bên dưới).
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-500">
              Đang tạo banner độc lập — không cần chọn gói.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="banner-title" className="text-sm font-medium text-slate-700">
                Tiêu đề slide{" "}
                <span className="font-normal text-slate-400">(tùy chọn)</span>
              </label>
              <input
                id="banner-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving || bannerUploading}
                placeholder="VD: Internet Giga"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="banner-subtitle" className="text-sm font-medium text-slate-700">
                Phụ đề slide{" "}
                <span className="font-normal text-slate-400">(tùy chọn)</span>
              </label>
              <input
                id="banner-subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                disabled={saving || bannerUploading}
                placeholder="VD: Tốc độ cao, ổn định"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-[#0066b3]/20 bg-[#0066b3]/[0.03] p-5">
          <PackageImagePicker
            label="Ảnh banner (21:9)"
            variant="banner"
            required={!bannerImage.trim()}
            file={bannerFile}
            previewUrl={bannerPreview}
            existingUrl={bannerImage}
            onFileChange={onBannerFileChange}
            disabled={saving}
            uploading={bannerUploading}
          />
        </div>

        <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
          <div>
            <label htmlFor="banner-order" className="text-sm font-medium text-slate-700">
              Thứ tự trên carousel
            </label>
            <input
              id="banner-order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">Số nhỏ hiển thị trước.</p>
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              {linkedToPackage ? "Gói hiển thị trên website" : "Hiển thị banner"}
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving || bannerUploading}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu…
              </>
            ) : isEdit ? (
              "Cập nhật banner"
            ) : (
              "Lưu banner"
            )}
          </button>
          <Link
            to="/admin/banners"
            className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
