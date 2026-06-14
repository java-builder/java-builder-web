import { useEffect, useState } from "react";
import {
  QuestionContributionDetailResponse,
  Locale,
  InterviewQuestionTranslation,
} from "@/types/interview";
import { useI18n } from "@/contexts/I18nContext";
import MarkdownEditor from "@/components/admin/blogs/MarkdownEditor";
import MarkdownRenderer from "@/components/admin/blogs/MarkdownRenderer";
import Swal from "sweetalert2";

interface ApproveModalProps {
  contribution: QuestionContributionDetailResponse;
  onClose: () => void;
  onApprove: (translations: InterviewQuestionTranslation[]) => void;
}

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "VI", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "JA", label: "日本語", flag: "🇯🇵" },
  { code: "KO", label: "한국어", flag: "🇰🇷" },
];

export default function ApproveModal({ contribution, onClose, onApprove }: ApproveModalProps) {
  const { t } = useI18n();
  const [translations, setTranslations] = useState<InterviewQuestionTranslation[]>([]);
  const [activeLocale, setActiveLocale] = useState<Locale>("VI");
  const [error, setError] = useState("");
  const [showOriginal, setShowOriginal] = useState(true);

  useEffect(() => {
    setTranslations(
      LOCALES.map((l) => ({
        locale: l.code,
        question: l.code === "VI" ? (contribution.question || "") : "",
        answer: l.code === "VI" ? (contribution.answer || "") : "",
        tips: l.code === "VI" ? (contribution.tips || "") : "",
      }))
    );
  }, [contribution]);

  const updateTranslation = (
    locale: Locale,
    field: "question" | "answer" | "tips",
    value: string
  ) => {
    setTranslations((prev) =>
      prev.map((tr) =>
        tr.locale === locale ? { ...tr, [field]: value } : tr
      )
    );
  };

  const getTranslation = (locale: Locale) =>
    translations.find((tr) => tr.locale === locale);

  const isLocaleFilled = (locale: Locale) => {
    const tr = getTranslation(locale);
    return !!tr?.question?.trim() && !!tr?.answer?.trim();
  };

  const missingLocales = LOCALES.filter(
    (l) =>
      !translations.find((tr) => tr.locale === l.code)?.question?.trim() ||
      !translations.find((tr) => tr.locale === l.code)?.answer?.trim()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const hasVi = isLocaleFilled("VI");
    const hasEn = isLocaleFilled("EN");
    if (!hasVi && !hasEn) {
      setError(t("admin.interviewTopics.requireViOrEn"));
      setActiveLocale(hasVi ? "EN" : "VI");
      return;
    }

    if (missingLocales.length > 0) {
      const missingList = missingLocales.map((l) => `${l.flag} ${l.label}`).join(", ");
      const result = await Swal.fire({
        title: t("admin.interviewTopics.partialLocaleTitle"),
        html: t("admin.interviewTopics.partialLocaleMessage").replace("{missing}", missingList),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t("admin.interviewTopics.partialLocaleConfirm"),
        cancelButtonText: t("admin.interviewTopics.partialLocaleCancel"),
        reverseButtons: true,
        focusCancel: true,
        width: "440px",
        padding: "2rem",
        backdrop: "rgba(0,0,0,0.4)",
        customClass: {
          popup: "swal-modern-popup",
          title: "swal-modern-title",
          htmlContainer: "swal-modern-text",
          confirmButton: "swal-modern-confirm",
          cancelButton: "swal-modern-cancel",
          actions: "swal-modern-actions",
          icon: "swal-modern-icon",
        },
        buttonsStyling: false,
      });
      if (!result.isConfirmed) {
        setActiveLocale(missingLocales[0].code);
        return;
      }
    }

    const filledTranslations = translations.filter(
      (tr) => tr.question?.trim() && tr.answer?.trim()
    );

    onApprove(filledTranslations);
  };

  const currentTrans = getTranslation(activeLocale);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700">
          
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Duyệt câu hỏi đóng góp
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-900 dark:text-blue-200">
                  <p className="font-medium mb-1">Bạn có thể bổ sung hoặc chỉnh sửa câu hỏi, câu trả lời và gợi ý cho cả 4 ngôn ngữ trước khi duyệt</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Thông tin gốc từ người đóng góp được điền sẵn trong tab Tiếng Việt</p>
                </div>
              </div>
            </div>

            {/* Original Contributed Content (Collapsible) */}
            <div className="border border-gray-100 dark:border-slate-700/80 rounded-xl overflow-hidden shadow-sm bg-gray-50/30 dark:bg-slate-900/10">
              <button
                type="button"
                onClick={() => setShowOriginal(!showOriginal)}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50/80 dark:bg-slate-800/40 hover:bg-gray-100/80 dark:hover:bg-slate-800/60 transition-all border-b border-gray-100 dark:border-slate-700/50"
              >
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 flex items-center gap-2">
                  <svg className="w-4.5 h-4.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Nội dung đóng góp gốc từ người dùng
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showOriginal ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showOriginal && (
                <div className="p-5 bg-white dark:bg-slate-800/20 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                      Câu hỏi gốc
                    </span>
                    <div className="text-sm text-gray-900 dark:text-slate-100 bg-gray-50/50 dark:bg-slate-900/30 px-4 py-3 rounded-lg border border-gray-100 dark:border-slate-700/80 leading-relaxed font-medium">
                      {contribution.question}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                        Câu trả lời gốc
                      </span>
                      <div className="p-4 bg-gray-50/50 dark:bg-slate-900/30 border border-gray-100 dark:border-slate-700/80 rounded-lg max-h-[200px] overflow-y-auto">
                        {contribution.answer ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:my-2">
                            <MarkdownRenderer content={contribution.answer} />
                          </div>
                        ) : (
                          <span className="text-xs italic text-gray-400 dark:text-slate-500">
                            Không có câu trả lời
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                        Gợi ý gốc
                      </span>
                      <div className="p-4 bg-gray-50/50 dark:bg-slate-900/30 border border-gray-100 dark:border-slate-700/80 rounded-lg max-h-[200px] overflow-y-auto">
                        {contribution.tips ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:my-2">
                            <MarkdownRenderer content={contribution.tips} />
                          </div>
                        ) : (
                          <span className="text-xs italic text-gray-400 dark:text-slate-500">
                            Không có gợi ý
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Locale Tabs */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">
                Ngôn ngữ câu hỏi phỏng vấn <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-2 border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
                {LOCALES.map((l) => {
                  const filled = isLocaleFilled(l.code);
                  const isActive = activeLocale === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setActiveLocale(l.code)}
                      className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                          ? "border-accent text-accent"
                          : "border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                        {l.flag}
                      </span>
                      <span>{l.label}</span>
                      {filled && (
                        <span
                          className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"
                          title="Đã điền"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input fields based on Active Locale */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Câu hỏi ({LOCALES.find((l) => l.code === activeLocale)?.label}) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={currentTrans?.question || ""}
                  onChange={(e) => updateTranslation(activeLocale, "question", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-none text-sm"
                  placeholder="Nhập câu hỏi..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Câu trả lời ({LOCALES.find((l) => l.code === activeLocale)?.label}) <span className="text-red-500">*</span>
                </label>
                <MarkdownEditor
                  value={currentTrans?.answer || ""}
                  onChange={(value) => updateTranslation(activeLocale, "answer", value)}
                  placeholder="Nhập câu trả lời chi tiết... Hỗ trợ Markdown để định dạng code."
                  height={300}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Tips - Gợi ý ({LOCALES.find((l) => l.code === activeLocale)?.label})
                </label>
                <MarkdownEditor
                  value={currentTrans?.tips || ""}
                  onChange={(value) => updateTranslation(activeLocale, "tips", value)}
                  placeholder="Gợi ý để trả lời tốt hơn..."
                  height={180}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-end gap-3 z-10">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Duyệt câu hỏi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
