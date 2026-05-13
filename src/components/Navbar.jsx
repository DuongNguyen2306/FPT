import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { href: "#internet", label: "Internet" },
  { href: "#truyen-hinh", label: "Truyền hình" },
  { href: "#camera", label: "Camera" },
  { href: "#dich-vu", label: "Dịch vụ" },
];

export default function Navbar({ onRegister }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <a href="#" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-fpt text-sm font-extrabold text-white">
            FPT
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-fpt-blue-dark sm:inline">
            Telecom
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-fpt"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:19006600"
            className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-fpt-blue-dark sm:flex"
          >
            <Phone className="h-4 w-4 text-fpt" aria-hidden />
            <span>1900 6600</span>
          </a>
          <button
            type="button"
            onClick={onRegister}
            className="hidden rounded-full border-2 border-fpt px-4 py-2 text-sm font-semibold text-fpt transition-colors hover:bg-fpt hover:text-white sm:inline-flex"
          >
            Đăng nhập
          </button>

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
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-fpt"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="tel:19006600"
                className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-fpt-blue-dark"
              >
                <Phone className="h-4 w-4 text-fpt" />
                1900 6600
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onRegister?.();
                }}
                className="mt-1 rounded-full border-2 border-fpt py-2.5 text-sm font-semibold text-fpt hover:bg-fpt hover:text-white"
              >
                Đăng nhập
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
