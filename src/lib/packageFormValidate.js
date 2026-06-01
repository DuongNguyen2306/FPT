const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * @param {File | null | undefined} file
 * @returns {string | null}
 */
export function validateImageFile(file) {
  if (!file) return null;
  if (!IMAGE_TYPES.includes(file.type)) {
    return "Ảnh chỉ chấp nhận JPEG, PNG, WebP hoặc GIF.";
  }
  if (file.size > MAX_BYTES) {
    return "Ảnh tối đa 5MB.";
  }
  return null;
}

/**
 * @param {import('../types/admin').PackageFormValues} values
 * @param {{ isCreate: boolean; heroFile?: File | null; heroImageUrl?: string }} opts
 * @returns {string | null}
 */
export function validatePackageForm(values, opts) {
  const { heroFile } = opts;

  if (!values.code?.trim()) return "Mã gói không được để trống.";
  if (!values.name?.trim()) return "Tên gói không được để trống.";
  if (!values.tagline?.trim()) return "Tagline không được để trống.";
  if (!values.type) return "Chọn loại gói.";
  if (!values.billingCycle) return "Chọn chu kỳ cước.";

  const heroErr = validateImageFile(heroFile);
  if (heroErr) return heroErr;

  return null;
}

export function mapPackageApiError(err) {
  const status = err?.response?.status;
  const msg = err?.response?.data?.message ?? err?.message;
  const text = Array.isArray(msg) ? msg.join(", ") : typeof msg === "string" ? msg : "Đã có lỗi.";

  if (status === 401) {
    return "Phiên đăng nhập hết hạn hoặc chưa đăng nhập admin. Vui lòng đăng xuất và đăng nhập lại.";
  }
  if (status === 403) {
    return (
      text && text !== "Forbidden resource"
        ? text
        : "Không có quyền thao tác (403). Đăng xuất và đăng nhập lại bằng tài khoản quản trị."
    );
  }
  if (status === 400) return text || "Dữ liệu không hợp lệ.";
  if (status === 409) return text || "Mã gói đã tồn tại.";
  if (status === 503) return text || "Hệ thống lưu ảnh chưa sẵn sàng. Liên hệ kỹ thuật.";
  if (err?.code === "ERR_NETWORK" || err?.message === "Network Error") {
    return "Không kết nối được máy chủ.";
  }
  return text;
}
