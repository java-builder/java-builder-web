"use client";

import { useState, useEffect } from "react";
import { questionSetService } from "@/services/question-set.service";
import {
  UpdateQuestionSetRequest,
  QuestionSetDetailResponse,
  QuestionSetTranslation,
  Locale,
} from "@/types/question-set";
import { pickQuestionSetTranslation } from "@/types/interview";
import { useAdminQuestionSet, clearAdminQuestionSetCache } from "@/hooks/useQuestionSets";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";

interface UpdateQuestionSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  questionSet: QuestionSetDetailResponse | null;
}

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "VI", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "JA", label: "日本語", flag: "🇯🇵" },
  { code: "KO", label: "한국어", flag: "🇰🇷" },
];

const emptyTranslations: QuestionSetTranslation[] = LOCALES.map((l) => ({
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

export default function UpdateQuestionSetModal({
  isOpen,
  onClose,
  onSuccess,
  questionSet,
}: UpdateQuestionSetModalProps) {
  const { t, locale } = useI18n();
  const [formData, setFormData] = useState<
    UpdateQuestionSetRequest & { translations: QuestionSetTranslation[] }
  >({
    level: "FRESHER",
    difficulty: "EASY",
    topics: "",
    displayOrder: 1,
    active: true,
    translations: emptyTranslations,
  });
  const [activeLocale, setActiveLocale] = useState<Locale>("VI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  // Load full data + translations từ API admin
  const { questionSet: fullQuestionSet, isLoading: isLoadingData, error: loadError } =
    useAdminQuestionSet(questionSet?.id, isOpen);

  // Khi data về thì fill form
  useEffect(() => {
    if (!fullQuestionSet) return;
    const existing = fullQuestionSet.translations ?? [];
    const merged = LOCALES.map((l) => {
      const found = existing.find((tr) => tr.locale === l.code);
      return found ?? { locale: l.code, title: "", description: "" };
    });
    setFormData({
      level: fullQuestionSet.level,
      difficulty: fullQuestionSet.difficulty,
      topics: fullQuestionSet.topics ?? "",
      displayOrder: fullQuestionSet.displayOrder,
      active: fullQuestionSet.active,
      translations: merged,
    });
  }, [fullQuestionSet]);

  // Reset UI state mỗi lần mở
  useEffect(() => {
    if (isOpen) {
      setActiveLocale("VI");
      setTouched(false);
      setError("");
    }
  }, [isOpen]);

  // Hiển thị lỗi load
  useEffect(() => {
    if (loadError) setError(t("admin.common.loadError"));
  }, [loadError, t]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionSet) return;
    setError("");
    setTouched(true);

    if (missingLocales.length > 0) {
      setActiveLocale(missingLocales[0].code);
      return;
    }

    setIsSubmitting(true);
    try {
      await questionSetService.updateQuestionSet(questionSet.id, formData);
      clearAdminQuestionSetCache(questionSet.id);
      onSuccess();
      onClose();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || t("admin.common.genericError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !questionSet) return null;

  const currentTrans = getTranslation(activeLocale);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Chỉnh sửa bộ câu hỏi
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {pickQuestionSetTranslation(questionSet.translations, locale)?.title || questionSet.slug}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative p-6 space-y-5 min-h-[400px]">
          {/* Skeleton loading overlay */}
          {isLoadingData && (
            <div className="absolute inset-0 z-20 bg-card rounded-b-xl p-6 space-y-5">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="flex gap-2">
                  {LOCALES.map((l) => (
                    <div key={l.code} className="h-10 w-28 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                <div className="h-11 w-full bg-muted rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                <div className="h-20 w-full bg-muted rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-11 bg-muted rounded animate-pulse" />
                <div className="h-11 bg-muted rounded animate-pulse" />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Locale Tabs */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Ngôn ngữ <span className="text-destructive">*</span>
              <span className="text-xs text-muted-foreground ml-2 font-normal">
                (Bắt buộc điền đầy đủ {LOCALES.length} ngôn ngữ)
              </span>
            </label>

            <div className="flex gap-2 border-b border-border">
              {LOCALES.map((l) => {
                const filled = isLocaleFilled(l.code);
                const isActive = activeLocale === l.code;
                const showError = touched && !filled;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setActiveLocale(l.code)}
                    disabled={isSubmitting}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      isActive
                        ? showError
                          ? "border-destructive text-destructive"
                          : "border-accent text-accent"
                        : showError
                        ? "border-transparent text-destructive hover:text-destructive/80"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="mr-1.5">{l.flag}</span>
                    {l.label}
                  </button>
                );
              })}
            </div>

            {touched && missingLocales.length > 0 && (
              <p className="mt-2 text-xs text-destructive">
                Còn thiếu:{" "}
                {missingLocales.map((l, idx) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setActiveLocale(l.code)}
                    className="underline hover:no-underline font-medium"
                  >
                    {l.flag} {l.label}
                    {idx < missingLocales.length - 1 ? ", " : ""}
                  </button>
                ))}
              </p>
            )}
          </div>

          {/* Title + Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tiêu đề ({LOCALES.find((l) => l.code === activeLocale)?.label}){" "}
                <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={currentTrans?.title || ""}
                onChange={(e) => updateTranslation(activeLocale, "title", e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground placeholder-muted-foreground transition-colors"
                disabled={isSubmitting}
              />
              {touched && !currentTrans?.title?.trim() && (
                <p className="mt-1.5 text-xs text-destructive">
                  Tiêu đề là bắt buộc cho ngôn ngữ này
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mô tả ({LOCALES.find((l) => l.code === activeLocale)?.label})
              </label>
              <textarea
                value={currentTrans?.description || ""}
                onChange={(e) => updateTranslation(activeLocale, "description", e.target.value)}
                placeholder="Mô tả ngắn về bộ câu hỏi..."
                rows={3}
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground placeholder-muted-foreground transition-colors resize-none"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Level + Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cấp độ <span className="text-destructive">*</span>
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
                className="w-full px-4 py-2 bg-background border border-border text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
              >
                <option value="INTERN">Intern</option>
                <option value="FRESHER">Fresher</option>
                <option value="JUNIOR">Junior</option>
                <option value="MIDDLE">Middle</option>
                <option value="SENIOR">Senior</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Độ khó <span className="text-destructive">*</span>
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
                className="w-full px-4 py-2 bg-background border border-border text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
              >
                <option value="EASY">Dễ</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HARD">Khó</option>
              </select>
            </div>
          </div>

          {/* Topics + Display order + Active */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Chủ đề liên quan
              </label>
              <input
                type="text"
                value={formData.topics}
                onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
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
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 bg-background border border-border text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Trạng thái
                </label>
                <select
                  value={formData.active ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, active: e.target.value === "true" })}
                  className="w-full px-4 py-2 bg-background border border-border text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Ẩn</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
