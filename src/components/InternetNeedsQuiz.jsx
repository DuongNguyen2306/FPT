import { Link } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import { resolvePackageQuizIcon } from "../lib/packageQuizIcons.js";

export default function InternetNeedsQuiz() {
  const HeaderIcon = resolvePackageQuizIcon("wifi");

  return (
    <section
      className="border-y border-slate-100 bg-light py-14 sm:py-16"
      aria-labelledby="package-quiz-intro-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-10">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
            <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:mb-0">
              <HeaderIcon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-500">Tìm gói phù hợp</p>
              <h2
                id="package-quiz-intro-heading"
                className="mt-2 text-xl font-bold leading-snug text-slate-900 sm:text-2xl"
              >
                Không chắc nên chọn loại gói nào?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                Trả lời 3 câu hỏi ngắn về nhu cầu WiFi, quy mô hộ gia đình và ưu tiên của bạn — chúng
                tôi gợi ý danh sách gói phù hợp (Internet, SpeedX, FPT Play, Camera, Dịch vụ).
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/tu-van-goi"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 sm:text-base"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Bắt đầu khảo sát 3 câu
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
            <p className="max-w-sm text-center text-xs text-slate-500 sm:text-left">
              Khoảng 1 phút · không cần đăng nhập
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
