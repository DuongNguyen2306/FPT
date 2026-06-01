import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Image, LayoutGrid, LogOut, Menu, Sparkles, Users } from "lucide-react";
import { logoutAll } from "../lib/logoutAuth.js";
import { useAdminStore } from "../stores/adminStore.js";

const NAV = [
  { to: "/admin/packages", label: "Gói cước", icon: LayoutGrid },
  { to: "/admin/banners", label: "Banner trang chủ", icon: Image },
  { to: "/admin/navigation", label: "Menu điều hướng", icon: Menu },
  { to: "/admin/package-quiz", label: "Gợi ý gói / Quiz", icon: Sparkles },
  { to: "/admin/leads", label: "Khách đăng ký", icon: Users },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const admin = useAdminStore((s) => s.admin);

  const handleLogout = async () => {
    await logoutAll();
    navigate("/login?role=admin", { replace: true });
  };

  const displayName =
    admin?.fullName?.trim() || admin?.username?.trim() || admin?.email?.trim() || "Admin";

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-[#1e2a5a] text-white">
        <div className="border-b border-white/10 px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">FPT Telecom</p>
          <p className="mt-1 text-sm font-bold">Khu quản trị</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin/packages" || to === "/admin/banners" || to === "/admin/navigation" || to === "/admin/package-quiz"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <p className="mb-2 truncate px-1 text-xs text-white/50" title={displayName}>
            {displayName}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center border-b border-slate-200 bg-white px-4 sm:px-6">
          <p className="truncate text-sm text-slate-600">
            Xin chào, <span className="font-semibold text-slate-900">{displayName}</span>
          </p>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
