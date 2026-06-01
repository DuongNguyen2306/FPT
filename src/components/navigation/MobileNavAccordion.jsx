import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { resolveNavIcon } from "../../lib/navigationIcons.js";
import NavMenuLink from "./NavMenuLink.jsx";

/**
 * @param {{
 *   groups: import('../../types/api').NavigationMenuGroup[];
 *   onNavigate?: () => void;
 * }} props
 */
export default function MobileNavAccordion({ groups, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [openGroupId, setOpenGroupId] = useState(null);

  const handleNavigate = () => {
    onNavigate?.();
    setOpen(false);
    setOpenGroupId(null);
  };

  return (
    <div className="rounded-lg border border-slate-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-light"
        aria-expanded={open}
      >
        Sản phẩm dịch vụ
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="border-t border-slate-100 px-2 pb-2 pt-1">
          {groups.map((group) => {
            const Icon = resolveNavIcon(group.icon);
            const expanded = openGroupId === group.id;
            return (
              <div key={group.id} className="mt-1">
                <button
                  type="button"
                  onClick={() => setOpenGroupId((id) => (id === group.id ? null : group.id))}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-slate-800 hover:bg-light"
                  aria-expanded={expanded}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-primary">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">{group.title}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {expanded ? (
                  <ul className="mb-2 ml-10 space-y-2 border-l border-slate-100 pl-3">
                    {(group.items ?? []).map((item, index) => (
                      <li key={`${item.label}-${index}`}>
                        <NavMenuLink item={item} onNavigate={handleNavigate} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
