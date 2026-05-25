import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutGrid, LogOut, Users } from "lucide-react";
import { logoutAll } from "../lib/logoutAuth.js";
import { useAdminStore } from "../stores/adminStore.js";

const NAV = [
  { to: "/admin/packages", label: "Gói cước", icon: LayoutGrid },
  { to: "/admin/leads", label: "Khách đăng ký", icon: Users },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const admin = useAdminStore((s) => s.admin);

  const handleLogout = async () => {
    await logoutAll();
    navigate("/login?role=admin", { replace: true });
  };

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
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <p className="truncate text-sm text-slate-600">
            Xin chào, <span className="font-semibold text-slate-900">{admin?.email}</span>
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
