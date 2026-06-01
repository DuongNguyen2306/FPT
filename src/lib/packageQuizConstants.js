export const HOME_NEEDS_QUIZ_CODE = "home-needs";

/** @param {{ displayOrder?: number }[]} items */
export function sortQuizByDisplayOrder(items) {
  return [...(items ?? [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

/** @type {import('../types/api').PackageQuizPublic} */
export const FALLBACK_HOME_NEEDS_QUIZ = {
  id: "fallback",
  code: HOME_NEEDS_QUIZ_CODE,
  tagline: "Tìm gói phù hợp với nhu cầu của bạn",
  icon: "wifi",
  questions: [
    {
      code: "wifi-usage",
      title: "Bạn chủ yếu sử dụng WiFi tại nhà để làm gì?",
      description: "Chọn một hoặc nhiều mục.",
      multiSelect: true,
      displayOrder: 0,
      options: [
        { code: "study", label: "Học tập / Làm việc", icon: "laptop", displayOrder: 0 },
        { code: "media", label: "Giải trí / Phim ảnh", icon: "clapperboard", displayOrder: 1 },
        { code: "game", label: "Chơi game", icon: "gamepad", displayOrder: 2 },
        { code: "smarthome", label: "Nhà thông minh", icon: "home", displayOrder: 3 },
      ],
    },
    {
      code: "household-size",
      title: "Hộ gia đình bạn có khoảng bao nhiêu người dùng mạng?",
      description: "Chọn một mục phù hợp nhất.",
      multiSelect: false,
      displayOrder: 1,
      options: [
        { code: "solo", label: "1–2 người", icon: "user", displayOrder: 0 },
        { code: "family", label: "3–5 người", icon: "users", displayOrder: 1 },
        { code: "large", label: "Trên 5 người", icon: "users", displayOrder: 2 },
      ],
    },
    {
      code: "priority",
      title: "Bạn ưu tiên điều gì nhất?",
      description: "Chọn một mục.",
      multiSelect: false,
      displayOrder: 2,
      options: [
        { code: "combo-tv", label: "Truyền hình / Combo TV", icon: "play-circle", displayOrder: 0 },
        { code: "speed", label: "Tốc độ / Game", icon: "zap", displayOrder: 1 },
        { code: "security", label: "Camera / An ninh", icon: "cctv", displayOrder: 2 },
        { code: "value", label: "Tiết kiệm chi phí", icon: "wallet", displayOrder: 3 },
      ],
    },
  ],
};

/** @type {Record<string, string>} */
export const PACKAGE_TYPE_LABELS = {
  INTERNET: "Internet Wifi",
  SPEEDX: "SpeedX",
  FPT_PLAY: "FPT Play",
  CAMERA: "Camera",
  SERVICE: "Dịch vụ",
};

/** @type {Record<string, string>} */
export const PACKAGE_TYPE_HOME_HASH = {
  INTERNET: "#internet",
  SPEEDX: "#internet",
  FPT_PLAY: "#truyen-hinh",
  CAMERA: "#camera",
  SERVICE: "#dich-vu",
};

/**
 * @param {import('../types/api').PackageQuizRecommendResult} result
 */
export function buildQuizResultsPath(result) {
  if (result.resultsPath) return result.resultsPath;
  const types = (result.recommendedTypes ?? []).join(",");
  const primary = result.primaryType ?? "";
  const q = new URLSearchParams();
  if (types) q.set("types", types);
  if (primary) q.set("primary", primary);
  const qs = q.toString();
  return qs ? `/ket-qua-tu-van?${qs}` : "/ket-qua-tu-van";
}
