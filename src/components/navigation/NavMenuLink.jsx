import { Link } from "react-router-dom";
import { isExternalNavHref, resolveNavHref } from "../../lib/navigationLink.js";
import NavNewBadge from "./NavNewBadge.jsx";

/**
 * @param {{
 *   item: import('../../types/api').NavigationMenuItem;
 *   className?: string;
 *   onNavigate?: () => void;
 *   variant?: 'mega' | 'mobile';
 * }} props
 */
export default function NavMenuLink({ item, className = "", onNavigate, variant = "mega" }) {
  const href = resolveNavHref(item);
  const label = (
    <>
      <span className="min-w-0 leading-snug">{item.label}</span>
      {item.isNew ? <NavNewBadge /> : null}
    </>
  );

  const baseClass =
    variant === "mega"
      ? `inline-flex max-w-full flex-wrap items-center gap-x-1 text-[13px] leading-relaxed text-slate-700 transition-colors hover:text-primary ${className}`.trim()
      : `inline-flex max-w-full items-center text-sm text-slate-700 transition-colors hover:text-primary ${className}`.trim();

  if (isExternalNavHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        onClick={onNavigate}
      >
        {label}
      </a>
    );
  }

  return (
    <Link to={href} className={baseClass} onClick={onNavigate}>
      {label}
    </Link>
  );
}
