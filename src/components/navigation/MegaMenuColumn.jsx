import { Link } from "react-router-dom";
import { resolveNavIcon } from "../../lib/navigationIcons.js";
import NavMenuLink from "./NavMenuLink.jsx";

/**
 * @param {{
 *   group: import('../../lib/transformMegaMenuData').MegaMenuColumnGroup;
 *   onNavigate?: () => void;
 * }} props
 */
export default function MegaMenuColumn({ group, onNavigate }) {
  const Icon = resolveNavIcon(group.icon);
  const items = group.items ?? [];
  const asTags = group.displayAsTags === true;

  return (
    <div className="min-w-0">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-primary">
          <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
        </span>
        <h3 className="text-sm font-bold text-gray-800">{group.title}</h3>
      </div>

      <ul className="space-y-0">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {asTags || item.isTag ? (
              <Link
                to={item.link}
                onClick={onNavigate}
                className="block py-1.5 text-left text-sm font-medium text-gray-500 transition-colors hover:text-[#0066b3]"
              >
                {item.label}
              </Link>
            ) : (
              <NavMenuLink item={item} onNavigate={onNavigate} variant="mega" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
