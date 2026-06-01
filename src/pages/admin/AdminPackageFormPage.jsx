import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PackageFormFields from "../../admin/PackageFormFields.jsx";
import AdminPackageLivePreview from "../../components/admin/AdminPackageLivePreview.jsx";
import {
  createAdminPackageSmart,
  findAdminPackageById,
  patchAdminPackage,
} from "../../api/adminPackages.js";
import { uploadAdminImage } from "../../api/adminUploads.js";
import {
  EMPTY_PACKAGE_FORM,
  packageFormToBody,
  packageToFormValues,
} from "../../lib/adminFormat.js";
import { validateImageFile, validatePackageForm, mapPackageApiError } from "../../lib/packageFormValidate.js";

const PRODUCT_FOLDER = "telecom-packages/products";
const MODEM_FOLDER = "telecom-packages/modems";
const BANNER_FOLDER = "telecom-packages/banners";

export default function AdminPackageFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = mode === "edit";

  const [values, setValues] = useState(EMPTY_PACKAGE_FORM);
  const [heroFile, setHeroFile] = useState(null);
  const [accentFile, setAccentFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
  const [accentPreview, setAccentPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);
  const [accentUploading, setAccentUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toastKind, setToastKind] = useState("success");

  useEffect(() => {
    return () => {
      if (heroPreview) URL.revokeObjectURL(heroPreview);
      if (accentPreview) URL.revokeObjectURL(accentPreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [heroPreview, accentPreview, bannerPreview]);

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const fromState = location.state?.pkg;
        const pkg =
          fromState && String(fromState.id ?? fromState._id) === id
            ? fromState
            : await findAdminPackageById(id);
        if (!pkg) throw new Error("Không tìm thấy gói.");
        if (!cancelled) setValues(packageToFormValues(pkg));
      } catch (err) {
        if (!cancelled) setError(mapPackageApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEdit, id, location.state]);

  const uploadFromFile = async (file, kind) => {
    const config = {
      hero: {
        folder: PRODUCT_FOLDER,
        setUploading: setHeroUploading,
        onDone: (url) => setValues((v) => ({ ...v, heroImage: url })),
        clearFile: () => {
          setHeroFile(null);
          if (heroPreview) URL.revokeObjectURL(heroPreview);
          setHeroPreview(null);
        },
        successMsg: "Đã tải ảnh sản phẩm lên.",
      },
      accent: {
        folder: MODEM_FOLDER,
        setUploading: setAccentUploading,
        onDone: (url) => setValues((v) => ({ ...v, accentImage: url })),
        clearFile: () => {
          setAccentFile(null);
          if (accentPreview) URL.revokeObjectURL(accentPreview);
          setAccentPreview(null);
        },
        successMsg: "Đã tải ảnh phụ lên.",
      },
      banner: {
        folder: BANNER_FOLDER,
        setUploading: setBannerUploading,
        onDone: (url) => setValues((v) => ({ ...v, bannerImage: url })),
        clearFile: () => {
          setBannerFile(null);
          if (bannerPreview) URL.revokeObjectURL(bannerPreview);
          setBannerPreview(null);
        },
        successMsg: "Đã tải ảnh banner lên.",
      },
    }[kind];

    config.setUploading(true);
    try {
      const up = await uploadAdminImage(file, config.folder);
      config.onDone(up.url);
      config.clearFile();
      if (up.fallback) {
        setToastKind("warning");
        setToast("Mạng chậm, đã dùng ảnh dự phòng");
      } else {
        setToastKind("success");
        setToast(config.successMsg);
      }
    } catch (err) {
      setError(mapPackageApiError(err));
    } finally {
      config.setUploading(false);
    }
  };

  const onHeroFileChange = (file) => {
    if (heroPreview) URL.revokeObjectURL(heroPreview);
    if (!file) {
      setHeroFile(null);
      setHeroPreview(null);
      return;
    }
    const err = validateImageFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
    void uploadFromFile(file, "hero");
  };

  const onAccentFileChange = (file) => {
    if (accentPreview) URL.revokeObjectURL(accentPreview);
    if (!file) {
      setAccentFile(null);
      setAccentPreview(null);
      return;
    }
    const err = validateImageFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setAccentFile(file);
    setAccentPreview(URL.createObjectURL(file));
    void uploadFromFile(file, "accent");
  };

  const onBannerFileChange = (file) => {
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
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
    void uploadFromFile(file, "banner");
  };

  const imageErrors = useMemo(
    () => ({
      hero: validateImageFile(heroFile) ?? undefined,
      accent: validateImageFile(accentFile) ?? undefined,
      banner: validateImageFile(bannerFile) ?? undefined,
    }),
    [heroFile, accentFile, bannerFile]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setToast("");

    const validation = validatePackageForm(values, {
      isCreate: !isEdit,
      heroFile,
      heroImageUrl: values.heroImage,
    });
    if (validation) {
      setError(validation);
      return;
    }
    if (imageErrors.hero || imageErrors.accent || imageErrors.banner) {
      setError(imageErrors.hero || imageErrors.accent || imageErrors.banner);
      return;
    }

    setSaving(true);
    try {
      const body = packageFormToBody(values);
      if (isEdit) {
        const patchBody = { ...body };
        if (heroFile) {
          const up = await uploadAdminImage(heroFile, PRODUCT_FOLDER);
          patchBody.heroImage = up.url;
          patchBody.imageUrl = up.url;
        }
        if (accentFile) {
          const up = await uploadAdminImage(accentFile, MODEM_FOLDER);
          patchBody.accentImage = up.url;
        }
        await patchAdminPackage(id, patchBody);
        setToastKind("success");
        setToast("Đã cập nhật gói.");
      } else {
        await createAdminPackageSmart(
          values,
          { heroFile, accentFile, bannerFile, heroImageUrl: values.heroImage?.trim() },
          body
        );
        setToastKind("success");
        setToast("Đã tạo gói thành công.");
      }

      setTimeout(() => {
        navigate("/admin/packages", { replace: true });
      }, 400);
    } catch (err) {
      setError(mapPackageApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-500">Đang tải gói…</p>;
  }

  const heroPreviewForCard = heroPreview || values.heroImage || null;
  const accentPreviewForModal = accentPreview || values.accentImage || null;

  return (
    <div className="-m-4 min-h-[calc(100vh-4rem)] bg-slate-50 p-6 sm:-m-6 sm:p-6">
      <Link to="/admin/packages" className="text-sm text-secondary hover:underline">
        ← Danh sách gói
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">
        {isEdit ? "Sửa gói cước" : "Thêm gói cước"}
      </h1>
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

      <form onSubmit={onSubmit} className="mt-6">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <PackageFormFields
                values={values}
                onChange={setValues}
                isEdit={isEdit}
                heroFile={heroFile}
                accentFile={accentFile}
                bannerFile={bannerFile}
                heroPreview={heroPreview}
                accentPreview={accentPreview}
                bannerPreview={bannerPreview}
                onHeroFileChange={onHeroFileChange}
                onAccentFileChange={onAccentFileChange}
                onBannerFileChange={onBannerFileChange}
                imageErrors={imageErrors}
                heroUploading={heroUploading}
                accentUploading={accentUploading}
                bannerUploading={bannerUploading}
                disabled={saving || heroUploading || accentUploading}
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang lưu…
                  </>
                ) : isEdit ? (
                  "Cập nhật"
                ) : (
                  "Tạo gói"
                )}
              </button>
              <Link
                to="/admin/banners/new"
                className="rounded-xl border border-[#0066b3]/30 px-6 py-3 text-sm font-semibold text-[#0066b3] hover:bg-[#0066b3]/5"
              >
                Thêm banner cho gói này
              </Link>
              <Link
                to="/admin/packages"
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700"
              >
                Hủy
              </Link>
            </div>
          </div>

          <div className="xl:col-span-5">
            <AdminPackageLivePreview
              values={values}
              heroPreviewUrl={heroPreviewForCard}
              accentPreviewUrl={accentPreviewForModal}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
