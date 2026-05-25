import { Gauge, Headphones, Smartphone, Wifi } from "lucide-react";

const ICONS = [Wifi, Gauge, Smartphone, Headphones];

/**
 * @param {{
 *   privileges: { title: string; description?: string }[];
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
    <section className="mx-auto max-w-5xl rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
      <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">Đặc quyền dành riêng cho bạn</h3>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="grid gap-5 sm:grid-cols-2">
          {privileges.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <div key={item.title} className="flex flex-col items-start gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4fc] text-[#0066b3]">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
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
          <div className="relative hidden overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-white to-sky-50 lg:block">
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
