import { getZaloUrl } from "../lib/env.js";
import { ZaloFabIcon } from "./icons/ZaloIcon.jsx";

/**
 * @param {{ raised?: boolean }} props — raised=true khi trang có thanh CTA dưới cùng
 */
export default function ZaloChatFab({ raised = false }) {
  const url = getZaloUrl();
  if (!url) return null;

  const positionClass = raised
    ? "bottom-[max(5.5rem,calc(env(safe-area-inset-bottom,0px)+4.5rem))] right-4 sm:right-6"
    : "bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-4 sm:bottom-6 sm:right-6";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nhắn tin Zalo"
      title="Nhắn tin Zalo"
      className={`group fixed z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#0068FF] text-white shadow-[0_4px_20px_rgba(0,104,255,0.45)] transition hover:scale-105 hover:bg-[#0056d6] hover:shadow-[0_6px_28px_rgba(0,104,255,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0068FF] focus-visible:ring-offset-2 sm:h-16 sm:w-16 ${positionClass}`}
    >
      <ZaloFabIcon className="h-9 w-9 sm:h-10 sm:w-10" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 sm:block">
        Nhắn tin Zalo
      </span>
    </a>
  );
}
