import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PackageFormFields from "../../admin/PackageFormFields.jsx";
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

export default function AdminPackageFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = mode === "edit";

  const [values, setValues] = useState(EMPTY_PACKAGE_FORM);
  const [heroFile, setHeroFile] = useState(null);
  const [accentFile, setAccentFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
  const [accentPreview, setAccentPreview] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    return () => {
      if (heroPreview) URL.revokeObjectURL(heroPreview);
      if (accentPreview) URL.revokeObjectURL(accentPreview);
    };
  }, [heroPreview, accentPreview]);

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

  const onHeroFileChange = (file) => {
    if (heroPreview) URL.revokeObjectURL(heroPreview);
    setHeroFile(file);
    setHeroPreview(file ? URL.createObjectURL(file) : null);
  };

  const onAccentFileChange = (file) => {
    if (accentPreview) URL.revokeObjectURL(accentPreview);
    setAccentFile(file);
    setAccentPreview(file ? URL.createObjectURL(file) : null);
  };

  const imageErrors = useMemo(
    () => ({
      hero: validateImageFile(heroFile) ?? undefined,
      accent: validateImageFile(accentFile) ?? undefined,
    }),
    [heroFile, accentFile]
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
    if (imageErrors.hero || imageErrors.accent) {
      setError(imageErrors.hero || imageErrors.accent);
      return;
    }

    setSaving(true);
    try {
      const body = packageFormToBody(values);

      if (isEdit) {
        const patchBody = { ...body };
        if (!heroFile) {
          delete patchBody.heroImage;
          delete patchBody.imageUrl;
        }
        if (!accentFile) {
          delete patchBody.accentImage;
        }
        if (heroFile) {
          const up = await uploadAdminImage(heroFile, "telecom-packages/heroes");
          patchBody.heroImage = up.url;
          patchBody.imageUrl = up.url;
        }
        if (accentFile) {
          const up = await uploadAdminImage(accentFile, "telecom-packages/modems");
          patchBody.accentImage = up.url;
        }
        await patchAdminPackage(id, patchBody);
        setToast("Đã cập nhật gói.");
      } else {
        await createAdminPackageSmart(
          values,
          { heroFile, accentFile, heroImageUrl: values.heroImage?.trim() },
          body
        );
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

  return (
    <div>
      <Link to="/admin/packages" className="text-sm text-secondary hover:underline">
        ← Danh sách gói
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">
        {isEdit ? "Sửa gói cước" : "Thêm gói cước"}
      </h1>

      {toast ? (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{toast}</p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 max-w-3xl">
        <PackageFormFields
          values={values}
          onChange={setValues}
          isEdit={isEdit}
          heroFile={heroFile}
          accentFile={accentFile}
          heroPreview={heroPreview}
          accentPreview={accentPreview}
          onHeroFileChange={onHeroFileChange}
          onAccentFileChange={onAccentFileChange}
          imageErrors={imageErrors}
          disabled={saving}
        />
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
            to="/admin/packages"
            className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
