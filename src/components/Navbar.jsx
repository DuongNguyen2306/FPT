import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore.js";
import { logoutAll } from "../lib/logoutAuth.js";

const LINKS = [
  { href: "#internet", label: "Internet" },
  { href: "#truyen-hinh", label: "Truyền hình" },
  { href: "#camera", label: "Camera" },
  { href: "#dich-vu", label: "Dịch vụ" },
];

export default function Navbar({ onOpenLogin, onOpenLead }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  const displayName = user?.fullName || user?.username || null;

  const handleLogout = async () => {
    await logoutAll();
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 shadow-soft backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600 text-sm font-extrabold text-white shadow-sm">
            FPT
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-secondary sm:inline">
            Telecom
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="group relative px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-primary"
            >
              {l.label}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 origin-center scale-x-0 rounded-full bg-primary transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="tel:19006600"
            className="hidden items-center gap-2 text-sm font-bold text-primary sm:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden />
            <span>1900 6600</span>
          </a>

          {displayName ? (
            <span className="hidden max-w-[10rem] truncate text-xs font-medium text-slate-600 sm:inline">
              {displayName}
            </span>
          ) : null}

          <button
            type="button"
            onClick={onOpenLead}
            className="hidden rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-light sm:inline-flex"
          >
            Đăng ký dịch vụ
          </button>

          {displayName ? (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-200 sm:inline-flex"
            >
              Đăng xuất
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="hidden rounded-full border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white sm:inline-flex"
            >
              Đăng nhập
            </button>
          )}

          <button
            type="button"
            className="inline-flex rounded-lg p-2 text-slate-700 md:hidden"
            aria-expanded={mobileOpen}
            aria-label="Mở menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-slate-100 bg-white md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-light hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <a
                href="tel:19006600"
                className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-primary"
              >
                <Phone className="h-4 w-4" />
                1900 6600
              </a>
              {displayName ? (
                <p className="px-3 pt-1 text-xs text-slate-500">Xin chào, {displayName}</p>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenLead?.();
                }}
                className="mt-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-light"
              >
                Đăng ký dịch vụ
              </button>
              {displayName ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 rounded-full bg-slate-100 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-200"
                >
                  Đăng xuất
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenLogin?.();
                  }}
                  className="mt-1 rounded-full border-2 border-primary py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
