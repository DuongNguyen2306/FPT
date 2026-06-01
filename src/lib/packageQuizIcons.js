import {
  Camera,
  Clapperboard,
  Gamepad2,
  HelpCircle,
  Home,
  Laptop,
  PlayCircle,
  Shield,
  Sparkles,
  Tv,
  User,
  Users,
  Wallet,
  Wifi,
  Zap,
} from "lucide-react";

/** @type {Record<string, import('lucide-react').LucideIcon>} */
const MAP = {
  wifi: Wifi,
  laptop: Laptop,
  clapperboard: Clapperboard,
  gamepad: Gamepad2,
  gamepad2: Gamepad2,
  home: Home,
  "play-circle": PlayCircle,
  play: PlayCircle,
  tv: Tv,
  camera: Camera,
  cctv: Camera,
  shield: Shield,
  sparkles: Sparkles,
  service: Sparkles,
  zap: Zap,
  speedx: Zap,
  user: User,
  users: Users,
  wallet: Wallet,
};

/** @param {string} [code] */
export function resolvePackageQuizIcon(code) {
  const key = String(code ?? "")
    .trim()
    .toLowerCase();
  return MAP[key] ?? HelpCircle;
}

export const PACKAGE_QUIZ_ICON_OPTIONS = [
  { id: "wifi", label: "Wi-Fi" },
  { id: "laptop", label: "Laptop" },
  { id: "clapperboard", label: "Giải trí" },
  { id: "gamepad", label: "Game" },
  { id: "home", label: "Smart home" },
  { id: "play-circle", label: "Play" },
  { id: "camera", label: "Camera" },
  { id: "shield", label: "Dịch vụ" },
  { id: "zap", label: "Tốc độ" },
  { id: "user", label: "Cá nhân" },
  { id: "users", label: "Gia đình" },
  { id: "wallet", label: "Tiết kiệm" },
];
