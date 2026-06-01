import { useMemo, useState } from "react";
import { FileSearch } from "lucide-react";
import PackageCard from "../packages/PackageCard.jsx";
import PackageDetailModal from "../packages/PackageDetailModal.jsx";
import { packageFormToPreviewProps } from "../../lib/packageFormPreview.js";
import { packageFormValuesToDetailModalData } from "../../lib/packageDetailModal.js";

/**
 * @param {{
 *   values: import('../../types/admin').PackageFormValues;
 *   heroPreviewUrl?: string | null;
 *   accentPreviewUrl?: string | null;
 * }} props
 */
export default function AdminPackageLivePreview({
  values,
  heroPreviewUrl = null,
  accentPreviewUrl = null,
}) {
  const [detailOpen, setDetailOpen] = useState(false);

  const cardProps = useMemo(
    () => packageFormToPreviewProps(values, { heroImageUrl: heroPreviewUrl }),
    [values, heroPreviewUrl]
  );

  const detailModalData = useMemo(
    () =>
      packageFormValuesToDetailModalData(values, {
        heroPreviewUrl,
        accentPreviewUrl,
      }),
    [values, heroPreviewUrl, accentPreviewUrl]
  );

  return (
    <aside className="space-y-4 xl:sticky xl:top-6">
      <div>
        <p className="mb-3 text-sm font-semibold text-slate-800">Xem trước</p>
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex justify-center">
            <PackageCard
              {...cardProps}
              previewMode={false}
              onRegister={() => {}}
              onViewDetails={() => setDetailOpen(true)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <button
          type="button"
          onClick={() => setDetailOpen(true)}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
        >
          <FileSearch className="h-3.5 w-3.5" aria-hidden />
          Xem popup chi tiết
        </button>
      </div>

      <PackageDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        packageData={detailModalData}
        onRegister={() => setDetailOpen(false)}
      />
    </aside>
  );
}
