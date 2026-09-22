"use client";

import { useEffect, useState } from "react";
import {
  QuestionContributionDetailResponse,
  Locale,
  InterviewQuestionTranslation,
} from "@/types/interview";
import { useI18n } from "@/contexts/I18nContext";
import MarkdownEditor from "@/components/admin/blogs/MarkdownEditor";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Check, X, FileText, Globe, Info, AlertCircle } from "lucide-react";

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
  const [modalTab, setModalTab] = useState<"translate" | "original">("translate");

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
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={onClose}
        />

        {/* Modal Window */}
        <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-border animate-in zoom-in-95 duration-200 z-10 overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Duyệt câu hỏi đóng góp
                </h3>
                <p className="text-xs text-muted-foreground">
                  Duyệt và dịch nội dung câu hỏi cho các ngôn ngữ hệ thống
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
            >
              <X className="h-4.5 w-4.5" />
            </Button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Tab switch: Translate vs Original */}
            <div className="flex items-center gap-2 border-b border-border">
              <button
                type="button"
                onClick={() => setModalTab("translate")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  modalTab === "translate"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>Duyệt &amp; Dịch ngôn ngữ</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("original")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  modalTab === "original"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Nội dung gốc gửi lên</span>
              </button>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {modalTab === "original" ? (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Câu hỏi gốc
                  </label>
                  <div className="bg-background rounded-xl border border-border p-4 text-sm font-semibold text-foreground leading-relaxed">
                    {contribution.question}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Câu trả lời gốc
                  </label>
                  <div className="rounded-xl border border-border overflow-hidden bg-card p-4 sm:p-5">
                    <PublicMarkdownRenderer
                      content={contribution.answer || ""}
                      className="prose-sm dark:prose-invert max-w-none"
                    />
                  </div>
                </div>

                {contribution.tips && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Gợi ý gốc
                    </label>
                    <div className="rounded-xl border border-border overflow-hidden bg-card p-4 sm:p-5">
                      <PublicMarkdownRenderer
                        content={contribution.tips}
                        className="prose-sm dark:prose-invert max-w-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Information hint */}
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-3.5 flex items-start gap-3">
                  <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <div className="text-xs text-foreground leading-relaxed">
                    <p className="font-semibold">
                      Bổ sung hoặc chỉnh sửa câu hỏi, câu trả lời và gợi ý cho từng ngôn ngữ trước khi phê duyệt.
                    </p>
                    <p className="text-muted-foreground mt-0.5">
                      Bắt buộc có ít nhất Tiếng Việt hoặc English. Dữ liệu gốc đã được điền sẵn vào tab Tiếng Việt.
                    </p>
                  </div>
                </div>

                {/* Locale Selector Tabs */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Ngôn ngữ hiển thị <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2 border-b border-border overflow-x-auto pb-1">
                    {LOCALES.map((l) => {
                      const filled = isLocaleFilled(l.code);
                      const isActive = activeLocale === l.code;
                      return (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => setActiveLocale(l.code)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isActive
                              ? "bg-accent text-accent-foreground shadow-xs"
                              : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span>{l.flag}</span>
                          <span>{l.label}</span>
                          {filled && (
                            <span
                              className={`h-2 w-2 rounded-full ${
                                isActive ? "bg-white" : "bg-emerald-500"
                              }`}
                              title="Đã nhập đầy đủ"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Câu hỏi ({LOCALES.find((l) => l.code === activeLocale)?.label}) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={currentTrans?.question || ""}
                    onChange={(e) => updateTranslation(activeLocale, "question", e.target.value)}
                    rows={3}
                    placeholder="Nhập nội dung câu hỏi..."
                    className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground shadow-2xs placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent resize-none leading-relaxed"
                  />
                </div>

                {/* Answer Markdown Editor */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Câu trả lời ({LOCALES.find((l) => l.code === activeLocale)?.label}) <span className="text-rose-500">*</span>
                  </label>
                  <div className="rounded-xl border border-border overflow-hidden bg-background">
                    <MarkdownEditor
                      value={currentTrans?.answer || ""}
                      onChange={(value) => updateTranslation(activeLocale, "answer", value)}
                      placeholder="Nhập nội dung câu trả lời (hỗ trợ Markdown)..."
                      height={360}
                    />
                  </div>
                </div>

                {/* Tips Markdown Editor */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Tips / Gợi ý ({LOCALES.find((l) => l.code === activeLocale)?.label})
                  </label>
                  <div className="rounded-xl border border-border overflow-hidden bg-background">
                    <MarkdownEditor
                      value={currentTrans?.tips || ""}
                      onChange={(value) => updateTranslation(activeLocale, "tips", value)}
                      placeholder="Gợi ý trả lời cho học viên..."
                      height={130}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 bg-card border-t border-border px-6 py-3.5 flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={handleSubmit}
              className="cursor-pointer gap-1.5"
            >
              <Check className="h-4 w-4" />
              <span>Xác nhận duyệt câu hỏi</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
