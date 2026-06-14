"use client";

import { useEffect, useState } from "react";
import { interviewQuestionService } from "@/services/interview-question.service";
import {
  CreateInterviewQuestionRequest,
  InterviewQuestionTranslation,
  Locale,
  Difficulty,
} from "@/types/interview-question";
import { useI18n } from "@/contexts/I18nContext";
import Swal from "sweetalert2";
import MarkdownEditor from "@/components/admin/blogs/MarkdownEditor";

interface CreateInterviewQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  questionSetId: string;
  nextDisplayOrder: number;
}

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "VI", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "JA", label: "日本語", flag: "🇯🇵" },
  { code: "KO", label: "한국어", flag: "🇰🇷" },
];

const initialTranslations: InterviewQuestionTranslation[] = LOCALES.map((l) => ({
  locale: l.code,
  question: "",
  answer: "",
  tips: "",
}));

export default function CreateInterviewQuestionModal({
  isOpen,
  onClose,
  onSuccess,
  questionSetId,
  nextDisplayOrder,
}: CreateInterviewQuestionModalProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<CreateInterviewQuestionRequest>({
    difficulty: "EASY",
    displayOrder: nextDisplayOrder,
    translations: initialTranslations,
  });
  const [activeLocale, setActiveLocale] = useState<Locale>("VI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, displayOrder: nextDisplayOrder }));
    }
  }, [isOpen, nextDisplayOrder]);

  const missingLocales = LOCALES.filter(
    (l) =>
      !formData.translations.find((tr) => tr.locale === l.code)?.question?.trim() ||
      !formData.translations.find((tr) => tr.locale === l.code)?.answer?.trim()
  );

  const updateTranslation = (
    locale: Locale,
    field: "question" | "answer" | "tips",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((tr) =>
        tr.locale === locale ? { ...tr, [field]: value } : tr
      ),
    }));
  };

  const getTranslation = (locale: Locale) =>
    formData.translations.find((tr) => tr.locale === locale);

  const isLocaleFilled = (locale: Locale) => {
    const tr = getTranslation(locale);
    return !!tr?.question?.trim() && !!tr?.answer?.trim();
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const filledTranslations = formData.translations.filter(
        (tr) => tr.question?.trim() && tr.answer?.trim()
      );
      await interviewQuestionService.createInterviewQuestion(questionSetId, {
        ...formData,
        translations: filledTranslations,
      });
      setFormData({
        difficulty: "EASY",
        displayOrder: nextDisplayOrder,
        translations: initialTranslations,
      });
      setActiveLocale("VI");
      onSuccess();
      onClose();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || t("admin.common.genericError"));
    } finally {
      setIsSubmitting(false);
    }
  };

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

    await submitForm();
  };

  if (!isOpen) return null;

  const currentTrans = getTranslation(activeLocale);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Thêm câu hỏi mới
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Locale Tabs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("admin.interviewTopics.languageLabel")} <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 dark:text-gray-300 ml-2 font-normal">
                ({t("admin.interviewTopics.languageHintOptional")})
              </span>
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
                    disabled={isSubmitting}
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

          {/* Question + Answer + Tips */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Câu hỏi ({LOCALES.find((l) => l.code === activeLocale)?.label}){" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={currentTrans?.question || ""}
                onChange={(e) => updateTranslation(activeLocale, "question", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-none"
                placeholder="Nhập câu hỏi..."
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Câu trả lời ({LOCALES.find((l) => l.code === activeLocale)?.label}){" "}
                <span className="text-red-500">*</span>
              </label>
              <MarkdownEditor
                value={currentTrans?.answer || ""}
                onChange={(value) => updateTranslation(activeLocale, "answer", value)}
                placeholder="Nhập câu trả lời chi tiết... Hỗ trợ Markdown để format code"
                height={500}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                💡 Hỗ trợ Markdown: Dùng <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">```java</code> để format code
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tips - Gợi ý ({LOCALES.find((l) => l.code === activeLocale)?.label})
              </label>
              <MarkdownEditor
                value={currentTrans?.tips || ""}
                onChange={(value) => updateTranslation(activeLocale, "tips", value)}
                placeholder="Gợi ý để trả lời tốt hơn..."
                height={250}
              />
            </div>
          </div>

          {/* Difficulty + Display order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Độ khó <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value as Difficulty })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="EASY">Dễ</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HARD">Khó</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                min="1"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang tạo..." : "Thêm câu hỏi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
