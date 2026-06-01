import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ZaloChatFab from "../components/ZaloChatFab.jsx";
import PackageQuizOptionGrid from "../components/quiz/PackageQuizOptionGrid.jsx";
import { fetchPackageQuiz, recommendPackageTypes } from "../api/packageQuizApi.js";
import {
  buildQuizResultsPath,
  FALLBACK_HOME_NEEDS_QUIZ,
  HOME_NEEDS_QUIZ_CODE,
  sortQuizByDisplayOrder,
} from "../lib/packageQuizConstants.js";
import { resolvePackageQuizIcon } from "../lib/packageQuizIcons.js";
import { friendlyApiError } from "../lib/userFacingText.js";

/**
 * @returns {Record<string, Set<string>>}
 */
function emptyAnswersRecord() {
  return {};
}

export default function PackageQuizWizardPage() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [step, setStep] = useState(0);
  /** @type {[Record<string, Set<string>>, Function]} */
  const [answers, setAnswers] = useState(emptyAnswersRecord);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingQuiz(true);
      try {
        const data = await fetchPackageQuiz(HOME_NEEDS_QUIZ_CODE);
        if (!cancelled) {
          setQuiz(data);
          setUsingFallback(false);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn("[PackageQuiz] GET failed, using fallback.", err);
        }
        if (!cancelled) {
          setQuiz(FALLBACK_HOME_NEEDS_QUIZ);
          setUsingFallback(true);
        }
      } finally {
        if (!cancelled) setLoadingQuiz(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const questions = useMemo(() => {
    const raw = quiz?.questions?.length ? quiz.questions : FALLBACK_HOME_NEEDS_QUIZ.questions;
    return sortQuizByDisplayOrder(raw).map((q) => ({
      ...q,
      options: sortQuizByDisplayOrder(q.options),
    }));
  }, [quiz]);

  const totalSteps = questions.length;
  const current = questions[step];
  const isLastStep = step >= totalSteps - 1;
  const picked = current ? answers[current.code] ?? new Set() : new Set();
  const hasSelection = picked.size > 0;
  const progressPct = totalSteps > 0 ? Math.round(((step + 1) / totalSteps) * 100) : 0;

  const handlePick = useCallback(
    (optionCode) => {
      if (!current) return;
      setError("");
      setAnswers((prev) => {
        const multi = current.multiSelect !== false;
        if (multi) {
          const next = new Set(prev[current.code] ?? []);
          if (next.has(optionCode)) next.delete(optionCode);
          else next.add(optionCode);
          return { ...prev, [current.code]: next };
        }
        return { ...prev, [current.code]: new Set([optionCode]) };
      });
    },
    [current]
  );

  const goNext = async () => {
    if (!hasSelection || !current) return;
    if (!isLastStep) {
      setStep((s) => s + 1);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const payload = {
        quizCode: quiz?.code ?? HOME_NEEDS_QUIZ_CODE,
        answers: questions.map((q) => ({
          questionCode: q.code,
          optionCodes: [...(answers[q.code] ?? [])],
        })),
      };
      const result = await recommendPackageTypes(payload);
      const path = buildQuizResultsPath(result);
      navigate(path, { state: { result } });
    } catch (err) {
      setError(friendlyApiError(err, "Không lấy được gợi ý gói. Vui lòng thử lại."));
    } finally {
      setSubmitting(false);
    }
  };

  const HeaderIcon = resolvePackageQuizIcon(quiz?.icon ?? "wifi");
  const tagline = quiz?.tagline ?? FALLBACK_HOME_NEEDS_QUIZ.tagline;

  return (
    <div className="flex min-h-screen flex-col bg-light">
      <Navbar onOpenLogin={() => navigate("/login")} onOpenLead={() => navigate("/dang-ky")} />

      <main className="flex flex-1 flex-col px-4 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-2xl">
          <Link
            to="/"
            className="text-sm font-medium text-secondary hover:underline"
          >
            ← Trang chủ
          </Link>

          {loadingQuiz ? (
            <div className="mt-16 flex items-center justify-center gap-2 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang tải câu hỏi…
            </div>
          ) : current ? (
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-10">
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>
                    Câu {step + 1} / {totalSteps}
                  </span>
                  <span>{progressPct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-5 sm:text-left">
                <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:mb-0">
                  <HeaderIcon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-orange-500">{tagline}</p>
                  <h1 className="mt-2 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                    {current.title}
                  </h1>
                  <p className="mt-2 text-sm text-slate-600">
                    {current.description ??
                      (current.multiSelect !== false
                        ? "Chọn một hoặc nhiều mục."
                        : "Chọn một mục.")}
                  </p>
                  {usingFallback && import.meta.env.DEV ? (
                    <p className="mt-2 text-xs text-amber-600">Dữ liệu mẫu (API quiz chưa sẵn sàng).</p>
                  ) : null}
                </div>
              </div>

              <PackageQuizOptionGrid
                options={current.options}
                picked={picked}
                multiSelect={current.multiSelect !== false}
                onPick={handlePick}
              />

              {error ? <p className="mt-4 text-center text-sm text-red-600">{error}</p> : null}

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                {step > 0 ? (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setStep((s) => s - 1)}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                    Quay lại
                  </button>
                ) : null}

                <button
                  type="button"
                  disabled={!hasSelection || submitting}
                  onClick={goNext}
                  className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold shadow-sm transition ${
                    hasSelection && !submitting
                      ? "bg-secondary text-white hover:brightness-110"
                      : "cursor-not-allowed bg-slate-200 text-slate-400"
                  }`}
                >
                  {submitting
                    ? "Đang gợi ý…"
                    : isLastStep
                      ? "Xem gói gợi ý"
                      : "Tiếp tục"}
                  {!submitting ? <ChevronRight className="h-4 w-4" aria-hidden /> : null}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-10 text-center text-slate-600">Không có câu hỏi nào.</p>
          )}
        </div>
      </main>

      <Footer />
      <ZaloChatFab />
    </div>
  );
}
