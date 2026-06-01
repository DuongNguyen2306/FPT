import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MegaMenuColumn from "./MegaMenuColumn.jsx";

/**
 * @param {{
 *   groups: import('../../lib/transformMegaMenuData').MegaMenuColumnGroup[];
 *   open: boolean;
 *   onClose: () => void;
 *   onHoverZone?: () => void;
 *   onLeaveZone?: () => void;
 *   loading?: boolean;
 *   zoneRef?: import('react').RefObject<HTMLElement | null>;
 * }} props
 */
export default function MegaMenuPanel({
  groups,
  open,
  onClose,
  onHoverZone,
  onLeaveZone,
  loading = false,
  zoneRef,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      const root = zoneRef?.current ?? panelRef.current;
      if (root?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, onClose, zoneRef]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute left-0 right-0 top-full z-50 hidden md:block"
          onMouseEnter={onHoverZone}
          onMouseLeave={onLeaveZone}
        >
          <div className="h-2" aria-hidden />
          <div className="overflow-hidden rounded-b-3xl border-t border-slate-100 bg-white shadow-2xl">
            <div className="mx-auto max-w-7xl p-8">
              {loading ? (
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
                        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                      </div>
                      {Array.from({ length: 4 }).map((__, j) => (
                        <div key={j} className="h-3 max-w-[9rem] animate-pulse rounded bg-slate-100" />
                      ))}
                    </div>
                  ))}
                </div>
              ) : groups.length === 0 ? (
                <p className="text-center text-sm text-slate-500">Chưa có sản phẩm hiển thị.</p>
              ) : (
                <div
                  className="grid gap-8"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(Math.max(groups.length, 1), 4)}, minmax(0, 1fr))`,
                  }}
                >
                  {groups.map((group) => (
                    <MegaMenuColumn key={group.id} group={group} onNavigate={onClose} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
