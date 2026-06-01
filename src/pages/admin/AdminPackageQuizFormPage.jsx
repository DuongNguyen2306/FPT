import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
import {
  PACKAGE_TYPES,
  createAdminPackageQuiz,
  defaultTypeWeights,
  getAdminPackageQuiz,
  updateAdminPackageQuiz,
} from "../../api/adminPackageQuiz.js";
import { PACKAGE_QUIZ_ICON_OPTIONS } from "../../lib/packageQuizIcons.js";

function getApiError(err) {
  const msg = err?.response?.data?.message ?? err?.message;
  return typeof msg === "string" ? msg : "Đã có lỗi.";
}

function emptyOption(order = 0) {
  return {
    code: "",
    label: "",
    icon: "laptop",
    displayOrder: order,
    isVisible: true,
    typeWeights: defaultTypeWeights(),
  };
}

function emptyQuestion(order = 0) {
  return {
    code: "",
    title: "",
    description: "",
    multiSelect: true,
    displayOrder: order,
    isVisible: true,
    options: [emptyOption(0)],
  };
}

/**
 * @param {{ mode: 'create' | 'edit' }} props
 */
export default function AdminPackageQuizFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [code, setCode] = useState("home-needs");
  const [tagline, setTagline] = useState("");
  const [icon, setIcon] = useState("wifi");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isVisible, setIsVisible] = useState(true);
  const [questions, setQuestions] = useState([emptyQuestion(0)]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getAdminPackageQuiz(id);
        if (cancelled) return;
        setCode(data.code ?? "");
        setTagline(data.tagline ?? "");
        setIcon(data.icon ?? "wifi");
        setDisplayOrder(String(data.displayOrder ?? 0));
        setIsVisible(data.isVisible !== false);
        const qs = (data.questions ?? []).map((q, qi) => ({
          code: q.code ?? "",
          title: q.title ?? "",
          description: q.description ?? "",
          multiSelect: q.multiSelect !== false,
          displayOrder: q.displayOrder ?? qi,
          isVisible: q.isVisible !== false,
          options: (q.options ?? []).map((o, oi) => ({
            code: o.code ?? "",
            label: o.label ?? "",
            icon: o.icon ?? "laptop",
            displayOrder: o.displayOrder ?? oi,
            isVisible: o.isVisible !== false,
            typeWeights: { ...defaultTypeWeights(), ...(o.typeWeights ?? {}) },
          })),
        }));
        setQuestions(qs.length ? qs : [emptyQuestion(0)]);
      } catch (err) {
        if (!cancelled) setError(getApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEdit, id]);

  const updateQuestion = (qi, patch) => {
    setQuestions((prev) => prev.map((q, i) => (i === qi ? { ...q, ...patch } : q)));
  };

  const updateOption = (qi, oi, patch) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi
          ? {
              ...q,
              options: q.options.map((o, j) => (j === oi ? { ...o, ...patch } : o)),
            }
          : q
      )
    );
  };

  const updateWeight = (qi, oi, type, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi
          ? {
              ...q,
              options: q.options.map((o, j) =>
                j === oi
                  ? {
                      ...o,
                      typeWeights: {
                        ...o.typeWeights,
                        [type]: Number(value) || 0,
                      },
                    }
                  : o
              ),
            }
          : q
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const body = {
      code: code.trim(),
      tagline: tagline.trim(),
      icon,
      displayOrder: Number(displayOrder) || 0,
      isVisible,
      questions: questions
        .filter((q) => q.code.trim() && q.title.trim())
        .map((q, qi) => ({
          code: q.code.trim(),
          title: q.title.trim(),
          description: q.description.trim(),
          multiSelect: !!q.multiSelect,
          displayOrder: Number(q.displayOrder) ?? qi,
          isVisible: !!q.isVisible,
          options: q.options
            .filter((o) => o.code.trim() && o.label.trim())
            .map((o, oi) => ({
              code: o.code.trim(),
              label: o.label.trim(),
              icon: o.icon,
              displayOrder: Number(o.displayOrder) ?? oi,
              isVisible: !!o.isVisible,
              typeWeights: o.typeWeights,
            })),
        })),
    };

    if (!body.code || !body.questions.length) {
      setError("Cần mã quiz và ít nhất một câu hỏi hợp lệ.");
      return;
    }

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateAdminPackageQuiz(id, body);
        navigate("/admin/package-quiz", { replace: true });
      } else {
        await createAdminPackageQuiz(body);
        navigate("/admin/package-quiz", { replace: true });
      }
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Đang tải…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/admin/package-quiz" className="text-sm font-medium text-secondary hover:underline">
        ← Gợi ý gói / Quiz
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">
        {isEdit ? "Sửa bộ quiz" : "Thêm bộ quiz"}
      </h1>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase text-slate-500">Nhóm quiz</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium">Mã (code)</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono"
                required
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium">Tagline (cam trên UI)</span>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Icon</span>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {PACKAGE_QUIZ_ICON_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Thứ tự</span>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
              />
              <span className="text-sm">Hiển thị trên trang chủ</span>
            </label>
          </div>
        </section>

        {questions.map((q, qi) => (
          <section key={qi} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase text-slate-500">Câu hỏi #{qi + 1}</h2>
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={qi === 0}
                  onClick={() => {
                    const copy = [...questions];
                    [copy[qi - 1], copy[qi]] = [copy[qi], copy[qi - 1]];
                    setQuestions(copy);
                  }}
                  className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={qi === questions.length - 1}
                  onClick={() => {
                    const copy = [...questions];
                    [copy[qi], copy[qi + 1]] = [copy[qi + 1], copy[qi]];
                    setQuestions(copy);
                  }}
                  className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={questions.length <= 1}
                  onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== qi))}
                  className="rounded p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-medium text-slate-600">Mã câu</span>
                <input
                  value={q.code}
                  onChange={(e) => updateQuestion(qi, { code: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono"
                />
              </label>
              <label className="flex items-end gap-4 pb-2">
                <span className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={q.multiSelect}
                    onChange={(e) => updateQuestion(qi, { multiSelect: e.target.checked })}
                  />
                  Multi-select
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={q.isVisible}
                    onChange={(e) => updateQuestion(qi, { isVisible: e.target.checked })}
                  />
                  Hiển thị
                </span>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-slate-600">Tiêu đề</span>
                <input
                  value={q.title}
                  onChange={(e) => updateQuestion(qi, { title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-slate-600">Mô tả</span>
                <input
                  value={q.description}
                  onChange={(e) => updateQuestion(qi, { description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-slate-500">Lựa chọn</p>
                <button
                  type="button"
                  onClick={() =>
                    updateQuestion(qi, {
                      options: [...q.options, emptyOption(q.options.length)],
                    })
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-secondary"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Thêm lựa chọn
                </button>
              </div>

              {q.options.map((o, oi) => (
                <div key={oi} className="rounded-lg border border-slate-100 bg-slate-50/80 p-4">
                  <div className="mb-3 flex justify-between">
                    <span className="text-xs font-medium text-slate-500">Option #{oi + 1}</span>
                    <button
                      type="button"
                      disabled={q.options.length <= 1}
                      onClick={() =>
                        updateQuestion(qi, {
                          options: q.options.filter((_, j) => j !== oi),
                        })
                      }
                      className="text-xs text-red-600 disabled:opacity-40"
                    >
                      Xóa
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="block">
                      <span className="text-xs text-slate-600">Mã</span>
                      <input
                        value={o.code}
                        onChange={(e) => updateOption(qi, oi, { code: e.target.value })}
                        className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm font-mono"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-xs text-slate-600">Nhãn</span>
                      <input
                        value={o.label}
                        onChange={(e) => updateOption(qi, oi, { label: e.target.value })}
                        className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-600">Icon</span>
                      <select
                        value={o.icon}
                        onChange={(e) => updateOption(qi, oi, { icon: e.target.value })}
                        className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                      >
                        {PACKAGE_QUIZ_ICON_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-slate-500">Trọng số loại gói</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {PACKAGE_TYPES.map((type) => (
                      <label key={type} className="block">
                        <span className="text-[10px] text-slate-500">{type}</span>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={o.typeWeights?.[type] ?? 0}
                          onChange={(e) => updateWeight(qi, oi, type, e.target.value)}
                          className="mt-0.5 w-full rounded border border-slate-200 px-2 py-1 text-sm"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <button
          type="button"
          onClick={() => setQuestions((prev) => [...prev, emptyQuestion(prev.length)])}
          className="w-full rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          + Thêm câu hỏi
        </button>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Lưu
          </button>
          <Link
            to="/admin/package-quiz"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
