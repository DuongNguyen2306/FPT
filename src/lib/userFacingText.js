/** Nhãn loại gói — hiển thị cho người dùng / admin, không dùng enum thô. */
export const PACKAGE_TYPE_LABELS = {
  INTERNET: "Internet",
  SPEEDX: "SpeedX",
  FPT_PLAY: "Truyền hình",
  CAMERA: "Camera",
  SERVICE: "Dịch vụ",
};

export const SPEED_CAPTION = "Tốc độ (tải xuống / tải lên)";

/**
 * @param {unknown} err
 * @param {string} [fallback]
 */
export function friendlyApiError(err, fallback = "Đã có lỗi. Vui lòng thử lại.") {
  if (err?.code === "ERR_NETWORK" || err?.message === "Network Error") {
    return "Không kết nối được máy chủ. Vui lòng kiểm tra mạng và thử lại.";
  }
  const status = err?.response?.status;
  const msg = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message;
  if (status === 401) {
    const text = Array.isArray(msg) ? msg.join(", ") : typeof msg === "string" ? msg : "";
    if (text && !/unauthorized/i.test(text)) return text;
    return "Sai tài khoản hoặc mật khẩu.";
  }
  if (status === 403) {
    const text = Array.isArray(msg) ? msg.join(", ") : typeof msg === "string" ? msg : "";
    return text && text !== "Forbidden resource"
      ? text
      : "Không có quyền thao tác này (403). Đăng xuất và đăng nhập lại đúng loại tài khoản (admin / khách).";
  }
  if (status === 429) {
    return "Hệ thống đang quá tải (quá nhiều yêu cầu). Vui lòng đợi vài giây rồi bấm Thử lại.";
  }
  if (Array.isArray(msg)) return msg.join(", ");
  return typeof msg === "string" && msg.trim() ? msg : fallback;
}
