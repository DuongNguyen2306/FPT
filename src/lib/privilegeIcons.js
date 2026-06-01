import {
  Wifi,
  Gauge,
  Smartphone,
  Headphones,
  Gift,
  Shield,
  Router,
  Headset,
  Zap,
} from "lucide-react";

/** @type {{ id: string; label: string; Icon: import('lucide-react').LucideIcon }[]} */
export const PRIVILEGE_ICON_OPTIONS = [
  { id: "wifi", label: "Wi-Fi", Icon: Wifi },
  { id: "speed", label: "Tốc độ", Icon: Gauge },
  { id: "app", label: "Ứng dụng / App", Icon: Smartphone },
  { id: "support", label: "Hỗ trợ 24/7", Icon: Headphones },
  { id: "headset", label: "Tư vấn", Icon: Headset },
  { id: "gift", label: "Quà tặng", Icon: Gift },
  { id: "shield", label: "Bảo mật", Icon: Shield },
  { id: "modem", label: "Thiết bị", Icon: Router },
  { id: "zap", label: "Ưu tiên", Icon: Zap },
];

/**
 * @param {string} [iconId]
 */
export function resolvePrivilegeIcon(iconId) {
  const hit = PRIVILEGE_ICON_OPTIONS.find((o) => o.id === iconId);
  return hit?.Icon ?? Wifi;
}
