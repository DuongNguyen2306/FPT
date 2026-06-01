import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Search, X } from "lucide-react";
import { searchPublicPackages } from "../../lib/packageSearch.js";
import { packageDetailPath } from "../../lib/packageRoutes.js";

/**
 * @param {{
 *   className?: string;
 *   onNavigate?: () => void;
 *   placeholder?: string;
 * }} props
 */
export default function NavbarSearch({
  className = "",
  onNavigate,
  placeholder = "Tìm gói cước, Internet, FPT Play…",
}) {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const runSearch = useCallback(async (value) => {
    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await searchPublicPackages(q, 8);
      setResults(list);
      setActiveIndex(list.length ? 0 : -1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      runSearch(query);
    }, 280);
    return () => window.clearTimeout(t);
  }, [query, open, runSearch]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const goToPackage = (item) => {
    const path = packageDetailPath({ code: item.code, id: item.id });
    setOpen(false);
    setQuery("");
    setResults([]);
    onNavigate?.();
    if (path && path !== "/") navigate(path);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      goToPackage(results[activeIndex]);
    }
  };

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={rootRef} className={`relative w-full ${className}`.trim()}>
      <div
        className={`flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 transition-colors ${
          open ? "border-orange-300 bg-white ring-2 ring-orange-100" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <Search className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
          aria-label="Tìm kiếm gói cước"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          role="combobox"
        />
        {loading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-400" aria-hidden />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="rounded p-0.5 text-gray-400 hover:text-gray-600"
            aria-label="Xóa từ khóa"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[70] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
          {loading && results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">Đang tìm…</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">Không tìm thấy gói phù hợp.</p>
          ) : (
            <ul className="max-h-72 overflow-y-auto py-1" role="listbox">
              {results.map((item, index) => (
                <li key={item.id || item.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => goToPackage(item)}
                    className={`flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left transition-colors ${
                      index === activeIndex ? "bg-orange-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                    <span className="text-xs text-gray-500">
                      {item.typeLabel}
                      {item.code ? ` · ${item.code}` : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
