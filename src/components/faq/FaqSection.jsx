import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listPublicFaqs } from "../../api/faqsApi.js";
import { friendlyApiError } from "../../lib/userFacingText.js";
import FaqAccordionItem from "./FaqAccordionItem.jsx";

/** @type {import('../../types/api').FaqPublicItem[]} */
const MOCK_FAQS = [
  {
    id: "mock-1",
    question: "Tổng chi phí lắp mạng Wifi Internet FPT là bao nhiêu?",
    answer:
      "Chi phí phụ thuộc gói cước và chương trình khuyến mãi tại thời điểm đăng ký.\nLiên hệ 1900 6600 để được tư vấn chi tiết.",
    displayOrder: 0,
  },
  {
    id: "mock-2",
    question: "Thời gian lắp đặt mất bao lâu?",
    answer:
      "Thông thường 1–3 ngày làm việc sau khi xác nhận đơn, tùy khu vực và loại hạ tầng.",
    displayOrder: 1,
  },
  {
    id: "mock-3",
    question: "Tôi có thể đổi gói cước sau khi đăng ký không?",
    answer: "Có. Bạn liên hệ tổng đài hoặc cửa hàng FPT để được hỗ trợ nâng/hạ gói theo chính sách.",
    displayOrder: 2,
  },
];

function FaqSkeleton() {
  return (
    <ul className="mt-6 divide-y divide-slate-100" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="py-4">
          <div className="h-5 w-4/5 max-w-md animate-pulse rounded bg-slate-200" />
        </li>
      ))}
    </ul>
  );
}

/**
 * @param {{
 *   title?: string;
 *   className?: string;
 *   id?: string;
 *   maxWidth?: "home" | "detail";
 *   items?: import('../../types/api').FaqPublicItem[];
 *   fetchOnMount?: boolean;
 * }} props
 */
export default function FaqSection({
  title = "Câu hỏi thường gặp",
  className = "",
  id = "faq",
  maxWidth = "home",
  items: itemsProp,
  fetchOnMount = true,
}) {
  const [searchParams] = useSearchParams();
  const useMock = import.meta.env.DEV && searchParams.get("mockFaq") === "1";

  const [items, setItems] = useState(itemsProp ?? []);
  const [loading, setLoading] = useState(!itemsProp?.length && fetchOnMount && !useMock);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  const load = useCallback(async () => {
    if (itemsProp?.length) return;
    if (useMock) {
      setItems(MOCK_FAQS);
      setLoading(false);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { items: list } = await listPublicFaqs();
      setItems(list ?? []);
    } catch (e) {
      setError(friendlyApiError(e, "Không tải được câu hỏi thường gặp."));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [itemsProp, useMock]);

  useEffect(() => {
    if (itemsProp?.length) {
      setItems(itemsProp);
      setLoading(false);
      return;
    }
    if (fetchOnMount) load();
  }, [itemsProp, fetchOnMount, load]);

  if (!loading && !error && items.length === 0) {
    return null;
  }

  const widthClass = maxWidth === "detail" ? "max-w-5xl" : "max-w-7xl";

  return (
    <section
      id={id}
      className={`scroll-mt-24 bg-light py-14 sm:py-16 ${className}`.trim()}
      aria-labelledby={`${id}-heading`}
    >
      <div className={`mx-auto px-4 sm:px-6 ${widthClass}`}>
        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-6 shadow-sm sm:rounded-3xl sm:px-8 sm:py-8">
          <h2 id={`${id}-heading`} className="text-xl font-bold text-slate-900 sm:text-2xl">
            {title}
          </h2>

          {loading ? <FaqSkeleton /> : null}

          {error ? (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p>{error}</p>
              <button
                type="button"
                onClick={load}
                className="mt-2 font-semibold text-red-800 underline hover:no-underline"
              >
                Thử lại
              </button>
            </div>
          ) : null}

          {!loading && !error && items.length > 0 ? (
            <div className="mt-4 sm:mt-6">
              {items.map((item, index) => (
                <FaqAccordionItem
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  isLast={index === items.length - 1}
                  onToggle={() =>
                    setOpenId((prev) => (prev === item.id ? null : item.id))
                  }
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
