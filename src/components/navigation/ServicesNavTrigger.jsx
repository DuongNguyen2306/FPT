import { ChevronDown } from "lucide-react";

/**
 * @param {{
 *   open: boolean;
 *   onOpen: () => void;
 *   className?: string;
 * }} props
 */
export default function ServicesNavTrigger({ open, onOpen, className = "" }) {
  return (
    <button
      type="button"
      onMouseEnter={onOpen}
      onClick={onOpen}
      aria-expanded={open}
      aria-haspopup="true"
      className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
        open ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
      } ${className}`.trim()}
    >
      Sản phẩm dịch vụ
      <ChevronDown
        className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        aria-hidden
      />
    </button>
  );
}
