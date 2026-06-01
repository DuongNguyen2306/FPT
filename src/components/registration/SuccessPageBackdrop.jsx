/**
 * Nền trang success: slate-50 + blur blobs góc trên-trái / dưới-phải.
 * @param {{ children: import('react').ReactNode }} props
 */
export default function SuccessPageBackdrop({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-400/20 blur-[120px] sm:-left-32 sm:-top-32" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-orange-400/20 blur-[120px] sm:-bottom-32 sm:-right-32" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
