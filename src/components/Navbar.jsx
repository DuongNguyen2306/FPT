import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { loadSiteNavigation } from "../lib/buildSiteNavigation.js";
import { getZaloUrl } from "../lib/env.js";
import { PhoneIcon, ZaloMarkIcon } from "./icons/NavbarIcons.jsx";
import MegaMenuPanel from "./navigation/MegaMenuPanel.jsx";
import MobileNavAccordion from "./navigation/MobileNavAccordion.jsx";
import ServicesNavTrigger from "./navigation/ServicesNavTrigger.jsx";
import NavbarSearch from "./navigation/NavbarSearch.jsx";
import { useAuthStore } from "../stores/authStore.js";
import { logoutAll } from "../lib/logoutAuth.js";

const ZALO_URL = getZaloUrl();

export default function Navbar({ onOpenLogin, onOpenLead }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [displayGroups, setDisplayGroups] = useState([]);
  const [navLoading, setNavLoading] = useState(true);
  const megaHeaderRef = useRef(null);
  const closeTimerRef = useRef(null);

  const user = useAuthStore((s) => s.user);
  const displayName = user?.fullName || user?.username || null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setNavLoading(true);
      try {
        const { displayGroups: groups } = await loadSiteNavigation();
        if (!cancelled) setDisplayGroups(groups);
      } catch {
        if (!cancelled) setDisplayGroups([]);
      } finally {
        if (!cancelled) setNavLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showMegaMenu = displayGroups.length > 0;

  const handleLogout = async () => {
    await logoutAll();
    setMobileOpen(false);
  };

  const closeMega = () => setMegaOpen(false);

  const cancelCloseMega = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleCloseMega = () => {
    cancelCloseMega();
    closeTimerRef.current = window.setTimeout(() => {
      setMegaOpen(false);
      closeTimerRef.current = null;
    }, 160);
  };

  const openMega = () => {
    cancelCloseMega();
    setMegaOpen(true);
  };

  useEffect(() => () => cancelCloseMega(), []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        ref={megaHeaderRef}
        className="fixed left-0 right-0 top-0 z-50 h-20 border-b border-gray-100 bg-white/90 backdrop-blur-md"
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* Trái: Logo + Sản phẩm dịch vụ */}
          <div className="flex min-w-0 flex-1 items-center gap-0 md:flex-initial">
            <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setMobileOpen(false)}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0066b3] to-orange-500 text-sm font-extrabold text-white shadow-sm">
                FPT
              </span>
              <span className="hidden text-sm font-bold tracking-tight text-slate-800 sm:inline">
                Telecom
              </span>
            </Link>

            {showMegaMenu ? (
              <div
                className="relative ml-6 hidden md:ml-8 md:block"
                onMouseEnter={openMega}
                onMouseLeave={scheduleCloseMega}
              >
                <ServicesNavTrigger open={megaOpen} onOpen={openMega} />
              </div>
            ) : null}
          </div>

          {/* Giữa: Tìm kiếm (tablet+) */}
          <div className="mx-2 hidden min-w-0 flex-1 justify-center md:flex md:max-w-[14rem] lg:max-w-xs xl:max-w-sm">
            <NavbarSearch onNavigate={() => setMegaOpen(false)} />
          </div>

          {/* Phải: Desktop actions */}
          <div className="hidden shrink-0 items-center space-x-3 lg:flex lg:space-x-5 xl:space-x-6">
            <a
              href="tel:19006600"
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 transition-colors hover:text-orange-600"
            >
              <PhoneIcon className="h-4 w-4" />
              <span>1900 6600</span>
            </a>

            {displayName ? (
              <Link
                to="/don-cua-toi"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-[#0066b3]"
              >
                Đơn của tôi
              </Link>
            ) : (
              <Link
                to="/tra-cuu-don"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-[#0066b3]"
              >
                Tra cứu đơn
              </Link>
            )}

            <a
              href={ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#0068ff] px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-100 transition-all hover:bg-[#0056d6]"
            >
              <ZaloMarkIcon className="h-4 w-4 shrink-0" />
              Chat Zalo
            </a>

            <button
              type="button"
              onClick={onOpenLead}
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-100 transition-all hover:bg-orange-600"
            >
              Đăng ký dịch vụ
            </button>

            {displayName ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Đăng xuất
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Đăng nhập
              </button>
            )}
          </div>

          {/* Mobile: Zalo nhanh + menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-[#0068ff] px-3 py-2 text-[11px] font-bold text-white shadow-sm"
              aria-label="Chat Zalo"
            >
              <ZaloMarkIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:inline">Zalo</span>
            </a>
            <button
              type="button"
              className="inline-flex rounded-lg p-2 text-gray-700 hover:bg-gray-50"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {showMegaMenu ? (
          <MegaMenuPanel
            groups={displayGroups}
            open={megaOpen}
            onClose={closeMega}
            onHoverZone={openMega}
            onLeaveZone={scheduleCloseMega}
            loading={navLoading}
            zoneRef={megaHeaderRef}
          />
        ) : null}
      </header>

      {/* Chừa chỗ cho header fixed */}
      <div className="h-20 shrink-0" aria-hidden />

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
              aria-label="Đóng menu"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="fixed bottom-0 right-0 top-20 z-[61] flex w-[min(100%,20rem)] flex-col overflow-y-auto border-l border-gray-100 bg-white shadow-2xl lg:hidden"
            >
              <div className="flex flex-col gap-1 p-4">
                <div className="mb-2 md:hidden">
                  <NavbarSearch
                    onNavigate={() => setMobileOpen(false)}
                    placeholder="Tìm gói cước…"
                  />
                </div>

                {showMegaMenu ? (
                  <MobileNavAccordion
                    groups={displayGroups}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ) : navLoading ? (
                  <div className="space-y-2 px-2 py-3">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                  </div>
                ) : null}

                <a
                  href="tel:19006600"
                  className="mt-3 flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-3 text-sm font-bold text-orange-500"
                >
                  <PhoneIcon className="h-5 w-5" />
                  1900 6600
                </a>

                {displayName ? (
                  <>
                    <p className="px-2 pt-2 text-xs text-gray-500">Xin chào, {displayName}</p>
                    <Link
                      to="/don-cua-toi"
                      className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      Đơn của tôi
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/tra-cuu-don"
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#0066b3]"
                    onClick={() => setMobileOpen(false)}
                  >
                    Tra cứu đơn
                  </Link>
                )}

                <a
                  href={ZALO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0068ff] py-3 text-sm font-bold text-white shadow-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  <ZaloMarkIcon className="h-5 w-5" />
                  Chat Zalo
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenLead?.();
                  }}
                  className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 hover:bg-orange-600"
                >
                  Đăng ký dịch vụ
                </button>

                {displayName ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
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
                    className="w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Đăng nhập
                  </button>
                )}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
