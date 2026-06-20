"use client";

import { useState, useEffect, useRef } from "react";
import {
  UpdateInterviewTopicRequest,
  InterviewTopicDetailResponse,
  Locale,
  TopicTranslation,
} from "@/types/interview";
import { fileApi } from "@/services/course.service";
import {
  useAdminInterviewTopic,
  clearAdminInterviewTopicCache,
} from "@/hooks/useInterviewTopics";
import { interviewService } from "@/services/interview.service";
import { useI18n } from "@/contexts/I18nContext";
import Swal from "sweetalert2";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface UpdateInterviewTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  topic: InterviewTopicDetailResponse | null;
}

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "VI", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "JA", label: "日本語", flag: "🇯🇵" },
  { code: "KO", label: "한국어", flag: "🇰🇷" },
];

const emptyTranslations: TopicTranslation[] = LOCALES.map((l) => ({
  locale: l.code,
  name: "",
  description: "",
}));

export default function UpdateInterviewTopicModal({
  isOpen,
  onClose,
  onSuccess,
  topic,
}: UpdateInterviewTopicModalProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<
    UpdateInterviewTopicRequest & { translations: TopicTranslation[] }
  >({
    key: "",
    displayOrder: 1,
    active: true,
    translations: emptyTranslations,
  });
  const [activeLocale, setActiveLocale] = useState<Locale>("VI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [previewIcon, setPreviewIcon] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook: chỉ gọi API lần đầu, mở lại dùng cache
  const { topic: fullTopic, isLoading: isLoadingTopic, error: loadError } =
    useAdminInterviewTopic(topic?.id, isOpen);

  // Khi data về thì fill form
  useEffect(() => {
    if (!fullTopic) return;
    const existing = fullTopic.translations ?? [];
    const merged = LOCALES.map((l) => {
      const found = existing.find((t) => t.locale === l.code);
      return found ?? { locale: l.code, name: "", description: "" };
    });
    setFormData({
      key: "", // không còn trả về từ API, chỉ set khi upload icon mới
      displayOrder: fullTopic.displayOrder ?? 1,
      active: fullTopic.active ?? true,
      translations: merged,
    });
    setPreviewIcon(fullTopic.thumbnailUrl || "");
  }, [fullTopic]);

  // Reset UI state mỗi lần mở
  useEffect(() => {
    if (isOpen) {
      setActiveLocale("VI");
      setError("");
      setSelectedFile(null);
    }
  }, [isOpen]);

  // Hiển thị lỗi load
  useEffect(() => {
    if (loadError) setError(t("admin.interviewTopics.loadDataError"));
  }, [loadError, t]);

  const missingLocales = LOCALES.filter(
    (l) => !formData.translations.find((t) => t.locale === l.code)?.name?.trim()
  );

  const updateTranslation = (
    locale: Locale,
    field: "name" | "description",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((t) =>
        t.locale === locale ? { ...t, [field]: value } : t
      ),
    }));
  };

  const getTranslation = (locale: Locale) =>
    formData.translations.find((t) => t.locale === locale);

  const isLocaleFilled = (locale: Locale) => {
    const t = getTranslation(locale);
    return !!t?.name?.trim();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(t("admin.interviewTopics.iconValidationType"));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError(t("admin.interviewTopics.iconValidationSize"));
      return;
    }

    setError("");
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewIcon(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveIcon = () => {
    setSelectedFile(null);
    setPreviewIcon("");
    setFormData((prev) => ({ ...prev, key: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!topic) return;

    // Bắt buộc ít nhất VI hoặc EN
    const hasVi = isLocaleFilled("VI");
    const hasEn = isLocaleFilled("EN");
    if (!hasVi && !hasEn) {
      setError(t("admin.interviewTopics.requireViOrEn"));
      setActiveLocale(hasVi ? "EN" : "VI");
      return;
    }

    // Nếu chưa đủ 4 ngôn ngữ → confirm
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

    setIsSubmitting(true);
    try {
      let key = formData.key;
      if (selectedFile) {
        const result = await fileApi.uploadPublicImage(selectedFile);
        key = result.key;
      }

      // Chỉ gửi translations đã điền
      const filledTranslations = formData.translations.filter((tr) => tr.name?.trim());

      await interviewService.updateTopic(topic.id, {
        key: key || undefined,
        displayOrder: formData.displayOrder,
        active: formData.active,
        translations: filledTranslations,
      });

      clearAdminInterviewTopicCache(topic.id);
      setSelectedFile(null);
      onSuccess();
      onClose();
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error.response?.data?.message ||
        error.message ||
        t("admin.common.genericError")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedFile(null);
      setError("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onClose();
    }
  };

  if (!isOpen || !topic) return null;

  const currentTrans = getTranslation(activeLocale);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {t("admin.interviewTopics.updateModalTitle")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("admin.interviewTopics.updateModalSubtitle")}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative p-6 space-y-5 min-h-[400px]">
            {/* Skeleton overlay khi đang fetch */}
            {isLoadingTopic && (
              <div className="absolute inset-0 z-20 bg-card rounded-b-xl p-6 space-y-5">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="flex gap-2">
                    {LOCALES.map((l) => (
                      <div
                        key={l.code}
                        className="h-10 w-28 bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                  <div className="h-11 w-full bg-muted rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-20 w-full bg-muted rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                  <div className="h-32 w-full bg-muted rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-11 bg-muted rounded animate-pulse" />
                  <div className="h-11 bg-muted rounded animate-pulse" />
                </div>
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              </div>
            )}

            {/* Locale Tabs */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                {t("admin.interviewTopics.languageLabel")} <span className="text-red-500">*</span>
                <span className="text-xs text-muted-foreground ml-2 font-normal">
                  ({t("admin.interviewTopics.languageHintOptional")})
                </span>
              </label>

              <div className="flex gap-2 border-b border-border overflow-x-auto">
                {LOCALES.map((l) => {
                  const filled = isLocaleFilled(l.code);
                  const isActive = activeLocale === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setActiveLocale(l.code)}
                      disabled={isSubmitting}
                      className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap flex items-center gap-1.5 ${isActive
                          ? "border-accent text-accent"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold bg-muted text-muted-foreground rounded">
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

            {/* Name + Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t("admin.interviewTopics.nameLabel")} ({LOCALES.find((l) => l.code === activeLocale)?.label})
                </label>
                <input
                  type="text"
                  value={currentTrans?.name || ""}
                  onChange={(e) => updateTranslation(activeLocale, "name", e.target.value)}
                  placeholder={
                    activeLocale === "VI"
                      ? "Ví dụ: Cơ sở dữ liệu"
                      : activeLocale === "EN"
                        ? "Example: Database"
                        : activeLocale === "JA"
                          ? "例: データベース"
                          : "예: 데이터베이스"
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground placeholder-muted-foreground transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t("admin.interviewTopics.descriptionLabel")} ({LOCALES.find((l) => l.code === activeLocale)?.label})
                </label>
                <textarea
                  value={currentTrans?.description || ""}
                  onChange={(e) => updateTranslation(activeLocale, "description", e.target.value)}
                  placeholder={t("admin.interviewTopics.descriptionPlaceholder")}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground placeholder-muted-foreground transition-colors resize-none"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                {t("admin.interviewTopics.iconLabel")}
              </label>

              {previewIcon ? (
                <div className="relative w-full">
                  <div className="flex items-center gap-4 p-4 border-2 border-dashed border-border rounded-lg bg-muted/30">
                    <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-border">
                      <Image
                        src={previewIcon}
                        alt="Icon preview"
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {selectedFile?.name || t("admin.interviewTopics.iconCurrent")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedFile
                          ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                          : t("admin.interviewTopics.iconChangeHint")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveIcon}
                      disabled={isSubmitting}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      title={t("admin.interviewTopics.iconRemoveTitle")}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isSubmitting}
                    className="hidden"
                    id="icon-upload-edit"
                  />
                  <label
                    htmlFor="icon-upload-edit"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isSubmitting
                        ? "border-border bg-muted/10 cursor-not-allowed"
                        : "border-border bg-muted/30 hover:bg-muted/50"
                      }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">{t("admin.interviewTopics.iconUploadClick")}</span> {t("admin.interviewTopics.iconUploadOrDrag")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("admin.interviewTopics.iconAccept")}
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Display Order + Active */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t("admin.interviewTopics.displayOrderLabel")}
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: parseInt(e.target.value) || 1,
                    })
                  }
                  min={1}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t("admin.common.status")}
                </label>
                <select
                  value={formData.active ? "true" : "false"}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.value === "true" })
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground transition-colors"
                  disabled={isSubmitting}
                >
                  <option value="true">{t("admin.interviewTopics.statusActive")}</option>
                  <option value="false">{t("admin.interviewTopics.statusInactive")}</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t("admin.interviewTopics.cancelBtn2")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="accent"
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("admin.interviewTopics.updatingBtn")}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t("admin.interviewTopics.updateBtn")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
