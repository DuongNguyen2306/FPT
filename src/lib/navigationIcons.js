import { Cctv, Home, PlayCircle, ShieldCheck, Wifi } from "lucide-react";

/** @type {{ id: string; label: string; Icon: import('lucide-react').LucideIcon }[]} */
export const NAV_ICON_OPTIONS = [
  { id: "wifi", label: "Wi-Fi / Internet", Icon: Wifi },
  { id: "play-circle", label: "Truyền hình", Icon: PlayCircle },
  { id: "cctv", label: "Camera", Icon: Cctv },
  { id: "home-wifi", label: "Nâng cấp / Smart home", Icon: Home },
  { id: "shield", label: "Dịch vụ / Bảo mật", Icon: ShieldCheck },
];

/**
 * @param {string} [iconId]
 */
export function resolveNavIcon(iconId) {
  const hit = NAV_ICON_OPTIONS.find((o) => o.id === iconId);
  return hit?.Icon ?? Wifi;
}
