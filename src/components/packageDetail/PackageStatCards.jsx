import { Gauge, Laptop, Smartphone, Tablet } from "lucide-react";
import { formatVnd } from "../../lib/packageHelpers.js";

/**
 * @param {{
 *   name: string;
 *   price?: number;
 *   downloadMbps?: number;
 *   uploadMbps?: number;
 *   specLine?: string;
 *   maxDevices?: number;
 * }} props
 */
export default function PackageStatCards({
  name,
  price,
  downloadMbps,
  uploadMbps,
  specLine,
  maxDevices,
}) {
  const down = downloadMbps;
  const up = uploadMbps ?? down;
  const showDevices = maxDevices != null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <h2 className="text-center text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">{name}</h2>

      <div
        className={`mt-8 grid gap-4 ${showDevices ? "md:grid-cols-3" : "md:grid-cols-2"}`}
      >
        <div className="flex min-h-[8.5rem] flex-col justify-center rounded-2xl border border-slate-100 bg-white px-5 py-6 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-600">Giá cước</p>
          <div className="mt-3 flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-1">
            <span className="text-xs text-slate-500">Chỉ từ</span>
            {typeof price === "number" ? (
              <span className="text-3xl font-extrabold text-[#0066b3] sm:text-4xl">
                {formatVnd(price)}
              </span>
            ) : (
              <span className="text-2xl font-bold text-slate-700">Liên hệ</span>
            )}
            <span className="text-sm text-slate-500">/tháng</span>
          </div>
        </div>

        <div className="flex min-h-[8.5rem] items-center gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-6 shadow-sm">
          <Gauge className="h-14 w-14 shrink-0 text-[#f37021]" strokeWidth={1.25} />
          <div className="min-w-0 text-left">
            <p className="text-sm font-medium text-slate-600">Tốc độ (tải xuống / tải lên)</p>
            {down != null ? (
              <>
                <p className="mt-1 text-3xl font-extrabold leading-none text-[#f37021] sm:text-4xl">
                  {down}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Mbps{up != null ? ` / ${up}Mbps` : ""}
                </p>
              </>
            ) : specLine ? (
              <p className="mt-2 text-lg font-bold text-slate-800">{specLine}</p>
            ) : (
              <p className="mt-2 text-slate-500">—</p>
            )}
          </div>
        </div>

        {showDevices ? (
          <div className="flex min-h-[8.5rem] items-center gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-6 shadow-sm">
            <div className="flex shrink-0 flex-col gap-0.5 text-[#28a745]">
              <div className="flex gap-0.5">
                <Smartphone className="h-6 w-6" strokeWidth={1.5} />
                <Tablet className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <Laptop className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-slate-600">Thiết bị (Kết nối)</p>
              <p className="mt-1 text-3xl font-extrabold leading-none text-[#28a745] sm:text-4xl">
                ≥{maxDevices}
              </p>
              <p className="mt-1 text-sm text-slate-500">Thiết bị</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
