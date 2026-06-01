import { PACKAGE_CARD_MAX_WIDTH_CLASS } from "../../lib/packageCardLayout.js";

export default function PackageCardSkeleton() {
  return (
    <div
      className={`flex h-full w-full ${PACKAGE_CARD_MAX_WIDTH_CLASS} flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm`}
      aria-hidden
    >
      <div className="package-card-header w-full animate-pulse bg-slate-200" />
      <div className="flex flex-1 flex-col p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-8 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 h-14 animate-pulse rounded-xl bg-slate-100" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-3 w-full animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      </div>
      <div className="space-y-2 p-4 pt-0">
        <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}
