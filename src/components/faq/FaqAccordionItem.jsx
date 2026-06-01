import { Minus, Plus } from "lucide-react";

/**
 * @param {{
 *   item: import('../../types/api').FaqPublicItem;
 *   isOpen: boolean;
 *   onToggle: () => void;
 *   isLast?: boolean;
 * }} props
 */
export default function FaqAccordionItem({ item, isOpen, onToggle, isLast = false }) {
  const panelId = `faq-panel-${item.id}`;
  const buttonId = `faq-button-${item.id}`;

  return (
    <div className={isLast ? "" : "border-b border-slate-100"}>
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:bg-slate-50/80 sm:py-5"
      >
        <span className="min-w-0 flex-1 pr-2 text-sm font-medium text-slate-900 sm:text-base">
          {item.question}
        </span>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors"
          aria-hidden
        >
          {isOpen ? (
            <Minus className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Plus className="h-4 w-4" strokeWidth={2} />
          )}
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className={isOpen ? "block pb-4 sm:pb-5" : "hidden"}
      >
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{item.answer}</p>
      </div>
    </div>
  );
}
