import { motion } from "framer-motion";
import { resolvePackageQuizIcon } from "../../lib/packageQuizIcons.js";

/**
 * @param {{
 *   options: import('../../types/api').PackageQuizOption[];
 *   picked: Set<string>;
 *   multiSelect?: boolean;
 *   onPick: (code: string) => void;
 * }} props
 */
export default function PackageQuizOptionGrid({ options, picked, multiSelect = true, onPick }) {
  const cols =
    options.length <= 3
      ? "grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3"
      : "grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`mt-8 grid gap-3 sm:gap-4 ${cols}`}>
      {options.map((opt) => {
        const active = picked.has(opt.code);
        const Icon = resolvePackageQuizIcon(opt.icon);
        return (
          <motion.button
            key={opt.code}
            type="button"
            onClick={() => onPick(opt.code)}
            whileTap={{ scale: 0.98 }}
            aria-pressed={active}
            role={multiSelect ? "checkbox" : "radio"}
            aria-checked={active}
            className={`flex min-h-[6.5rem] flex-col items-center justify-center rounded-2xl border-2 px-2 py-4 text-center shadow-sm transition-all min-[400px]:min-h-[7rem] min-[400px]:rounded-3xl sm:min-h-[7.5rem] ${
              active
                ? "border-primary bg-primary/[0.06] text-slate-900 ring-2 ring-primary/20"
                : "border-slate-200 bg-white text-slate-800 hover:border-primary/40 hover:bg-slate-50/80"
            }`}
          >
            <Icon
              className={`h-9 w-9 sm:h-10 sm:w-10 ${active ? "text-primary" : "text-slate-600"}`}
              strokeWidth={1.35}
              aria-hidden
            />
            <span className="mt-3 text-xs font-semibold leading-snug sm:text-sm">{opt.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
