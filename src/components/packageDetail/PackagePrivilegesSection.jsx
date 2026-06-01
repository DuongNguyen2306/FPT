import { Wifi } from "lucide-react";
import { resolvePrivilegeIcon } from "../../lib/privilegeIcons.js";

/**
 * @param {{
 *   privileges: { title: string; description?: string; icon?: string; imageUrl?: string }[];
 *   lifestyleImageUrl?: string;
 *   heroImage?: string;
 *   onRegister: () => void;
 * }} props
 */
export default function PackagePrivilegesSection({
  privileges,
  lifestyleImageUrl,
  heroImage,
  onRegister,
}) {
  if (!privileges.length) return null;

  const sideImage = lifestyleImageUrl ?? heroImage;

  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-10">
      <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">Đặc quyền dành riêng cho bạn</h3>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="grid grid-cols-1 gap-5 min-[420px]:grid-cols-2">
          {privileges.map((item, index) => {
            const Icon = resolvePrivilegeIcon(item.icon);
            const customImg = item.imageUrl?.trim();
            return (
              <div key={`${item.title}-${index}`} className="flex flex-col items-start gap-3">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#e8f4fc] text-[#0066b3]">
                  {customImg ? (
                    <img src={customImg} alt="" className="h-8 w-8 object-contain" />
                  ) : (
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  )}
                </span>
                <div>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  {item.description ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {sideImage ? (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-white to-sky-50 md:min-h-[240px] lg:min-h-[300px]">
            <img
              src={sideImage}
              alt=""
              className="h-full min-h-[300px] w-full object-cover object-center"
            />
            <span className="pointer-events-none absolute -right-4 top-8 h-24 w-24 rounded-full bg-orange-400/20" />
            <Wifi className="pointer-events-none absolute bottom-10 right-8 h-16 w-16 text-orange-500/40" />
          </div>
        ) : null}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={onRegister}
          className="min-w-[200px] rounded-lg bg-[#0066b3] px-10 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-[#0056a3]"
        >
          Đăng ký ngay
        </button>
      </div>
    </section>
  );
}
