"use client";

import { useEffect, useState, useRef } from "react";
import { interviewService } from "@/services/interview.service";
import { CreateInterviewTopicRequest, Locale, TopicTranslation } from "@/types/interview";
import { fileApi } from "@/services/course.service";
import { useI18n } from "@/contexts/I18nContext";
import Swal from "sweetalert2";
import Image from "next/image";

interface CreateInterviewTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  nextDisplayOrder?: number;
}

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "VI", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "JA", label: "日本語", flag: "🇯🇵" },
  { code: "KO", label: "한국어", flag: "🇰🇷" },
];

const initialTranslations: TopicTranslation[] = LOCALES.map((l) => ({
  locale: l.code,
  name: "",
  description: "",
}));

export default function CreateInterviewTopicModal({
  isOpen,
  onClose,
  onSuccess,
  nextDisplayOrder = 1,
}: CreateInterviewTopicModalProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<CreateInterviewTopicRequest>({
    key: "",
    displayOrder: 1,
    translations: initialTranslations,
  });
  const [activeLocale, setActiveLocale] = useState<Locale>("VI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [previewIcon, setPreviewIcon] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const missingLocales = LOCALES.filter(
    (l) => !formData.translations.find((tr) => tr.locale === l.code)?.name?.trim()
  );

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, displayOrder: nextDisplayOrder }));
    }
  }, [isOpen, nextDisplayOrder]);

  const resetForm = () => {
    setFormData({
      key: "",
      displayOrder: nextDisplayOrder,
      translations: initialTranslations,
    });
    setActiveLocale("VI");
    setPreviewIcon("");
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const updateTranslation = (locale: Locale, field: "name" | "description", value: string) => {
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
    return !!tr?.name?.trim();
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      let key = formData.key;
      if (selectedFile) {
        const result = await fileApi.uploadPublicImage(selectedFile);
        key = result.key;
      }

      // Chỉ gửi translations đã điền tên
      const filledTranslations = formData.translations.filter((tr) => tr.name?.trim());

      await interviewService.createTopic({
        ...formData,
        key,
        translations: filledTranslations,
      });

      resetForm();
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

    // Bắt buộc ít nhất VI hoặc EN (để gen slug)
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
        // User chọn "điền tiếp" → jump tới locale thiếu đầu tiên
        setActiveLocale(missingLocales[0].code);
        return;
      }
    }

    await submitForm();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentTrans = getTranslation(activeLocale);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("admin.interviewTopics.createModalTitle")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                {t("admin.interviewTopics.createModalSubtitle")}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
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
              </div>            </div>

            {/* Name + Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("admin.interviewTopics.descriptionLabel")} ({LOCALES.find((l) => l.code === activeLocale)?.label})
                </label>
                <textarea
                  value={currentTrans?.description || ""}
                  onChange={(e) => updateTranslation(activeLocale, "description", e.target.value)}
                  placeholder={t("admin.interviewTopics.descriptionPlaceholder")}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-none"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("admin.interviewTopics.iconLabel")}
              </label>

              {previewIcon ? (
                <div className="relative w-full">
                  <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600">
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
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {selectedFile?.name || t("admin.interviewTopics.iconCurrent")}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : t("admin.interviewTopics.iconReady")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveIcon}
                      disabled={isSubmitting}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
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
                    id="icon-upload"
                  />
                  <label
                    htmlFor="icon-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isSubmitting
                        ? "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                        : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-300">
                        <span className="font-semibold">{t("admin.interviewTopics.iconUploadClick")}</span> {t("admin.interviewTopics.iconUploadOrDrag")}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        {t("admin.interviewTopics.iconAccept")}
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("admin.interviewTopics.displayOrderLabel")}
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })
                }
                min={1}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                disabled={isSubmitting}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("admin.interviewTopics.cancelBtn2")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("admin.interviewTopics.creatingBtn")}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t("admin.interviewTopics.createBtn")}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
