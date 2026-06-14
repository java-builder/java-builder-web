"use client";

import { useState, useEffect } from "react";
import { questionSetService } from "@/services/question-set.service";
import {
  CreateQuestionSetRequest,
  QuestionSetTranslation,
  Locale,
} from "@/types/question-set";
import { useI18n } from "@/contexts/I18nContext";
import Swal from "sweetalert2";

interface CreateQuestionSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  topicId: string;
  topicName: string;
  nextDisplayOrder: number;
}

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "VI", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "JA", label: "日本語", flag: "🇯🇵" },
  { code: "KO", label: "한국어", flag: "🇰🇷" },
];

const initialTranslations: QuestionSetTranslation[] = LOCALES.map((l) => ({
  locale: l.code,
  title: "",
  description: "",
}));

const AVAILABLE_TAGS = [
  "OOP", "Inheritance", "Polymorphism", "Encapsulation", "Abstraction",
  "Collections", "Stream API", "Lambda", "Generics", "Exception Handling",
  "Multithreading", "Concurrency", "JDBC", "JPA", "Hibernate",
  "Spring Core", "Spring Boot", "Spring MVC", "Spring Security", "Spring Data",
  "REST API", "Microservices", "Docker", "Kubernetes", "Cloud",
  "AWS", "Azure", "Design Patterns", "SOLID", "Testing",
];

export default function CreateQuestionSetModal({
  isOpen,
  onClose,
  onSuccess,
  topicId,
  topicName,
  nextDisplayOrder,
}: CreateQuestionSetModalProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<CreateQuestionSetRequest>({
    level: "FRESHER",
    difficulty: "EASY",
    topics: "",
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
    (l) => !formData.translations.find((tr) => tr.locale === l.code)?.title?.trim()
  );

  const updateTranslation = (
    locale: Locale,
    field: "title" | "description",
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
    return !!tr?.title?.trim();
  };

  const toggleTag = (tag: string) => {
    const currentTags = formData.topics ? formData.topics.split(", ").filter((x) => x.trim()) : [];
    const idx = currentTags.indexOf(tag);
    if (idx > -1) currentTags.splice(idx, 1);
    else currentTags.push(tag);
    setFormData({ ...formData, topics: currentTags.join(", ") });
  };

  const isTagSelected = (tag: string) => {
    const currentTags = formData.topics ? formData.topics.split(", ").filter((x) => x.trim()) : [];
    return currentTags.includes(tag);
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const filledTranslations = formData.translations.filter((tr) => tr.title?.trim());
      await questionSetService.createQuestionSet(topicId, {
        ...formData,
        translations: filledTranslations,
      });
      setFormData({
        level: "FRESHER",
        difficulty: "EASY",
        topics: "",
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Tạo bộ câu hỏi mới
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                Chủ đề: {topicName}
              </p>
            </div>
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

          {/* Title + Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tiêu đề ({LOCALES.find((l) => l.code === activeLocale)?.label})
              </label>
              <input
                type="text"
                value={currentTrans?.title || ""}
                onChange={(e) => updateTranslation(activeLocale, "title", e.target.value)}
                placeholder={
                  activeLocale === "VI"
                    ? "Ví dụ: Cơ bản về OOP"
                    : activeLocale === "EN"
                    ? "Example: OOP Fundamentals"
                    : activeLocale === "JA"
                    ? "例: OOPの基礎"
                    : "예: OOP 기초"
                }
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mô tả ({LOCALES.find((l) => l.code === activeLocale)?.label})
              </label>
              <textarea
                value={currentTrans?.description || ""}
                onChange={(e) => updateTranslation(activeLocale, "description", e.target.value)}
                placeholder="Mô tả ngắn về bộ câu hỏi..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-none"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Level + Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cấp độ <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    level: e.target.value as "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR",
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="INTERN">Intern</option>
                <option value="FRESHER">Fresher</option>
                <option value="JUNIOR">Junior</option>
                <option value="MIDDLE">Middle</option>
                <option value="SENIOR">Senior</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Độ khó <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as "EASY" | "MEDIUM" | "HARD",
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="EASY">Dễ</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HARD">Khó</option>
              </select>
            </div>
          </div>

          {/* Topics + Display order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chủ đề liên quan
              </label>
              <input
                type="text"
                value={formData.topics}
                onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Hoặc nhập thủ công"
              />
              <div className="mt-2 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {AVAILABLE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      isTagSelected(tag)
                        ? "bg-accent text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
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
              {isSubmitting ? "Đang tạo..." : "Tạo bộ câu hỏi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
