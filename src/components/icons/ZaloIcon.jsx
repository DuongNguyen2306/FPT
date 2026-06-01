/**
 * Logo Zalo — path chat bubble (dùng chung).
 * @see https://zalo.me brand colors #0068FF
 */
const BUBBLE_24 =
  "M8.1 7.25c-1.4 1.05-2.25 2.6-2.25 4.3 0 3.1 2.8 5.6 6.25 5.6.7 0 1.4-.1 2.05-.3l3.6 1.95-.95-3.4c.95-.9 1.55-2.15 1.55-3.55 0-2.75-2.6-5-5.8-5-1.7 0-3.25.6-4.45 1.6z";

const BUBBLE_48 =
  "M16.2 14.5c-2.8 2.1-4.5 5.2-4.5 8.6 0 6.2 5.6 11.2 12.5 11.2 1.4 0 2.8-.2 4.1-.6l7.2 3.9-1.9-6.8c1.9-1.8 3.1-4.3 3.1-7.1 0-5.5-5.2-10-11.6-10-3.4 0-6.5 1.2-8.9 3.2z";

/**
 * Icon Zalo đầy đủ (nền xanh + bubble trắng) — dùng trên nền sáng.
 * @param {{ className?: string }} props
 */
export function ZaloLogoIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="12" fill="#0068FF" />
      <path d={BUBBLE_24} fill="#ffffff" />
    </svg>
  );
}

/**
 * Chỉ hình chat trắng — dùng trên nút / FAB nền #0068FF (không vẽ vòng trắng che logo).
 * @param {{ className?: string }} props
 */
export function ZaloMarkIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d={BUBBLE_24} fill="currentColor" />
    </svg>
  );
}

/**
 * Logo lớn cho FAB (bubble trắng, không circle — nền đã là xanh Zalo).
 * @param {{ className?: string }} props
 */
export function ZaloFabIcon({ className = "h-8 w-8" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d={BUBBLE_48} fill="currentColor" />
    </svg>
  );
}
