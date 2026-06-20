import { useEffect, useState } from "react";
import {
  QuestionContributionDetailResponse,
  Locale,
  InterviewQuestionTranslation,
} from "@/types/interview";
import { useI18n } from "@/contexts/I18nContext";
import MarkdownEditor from "@/components/admin/blogs/MarkdownEditor";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";

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
  const [modalTab, setModalTab] = useState<"original" | "translate">("translate");

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
        <div className="fixed inset-0 bg-black/60 transition-opacity animate-in fade-in" onClick={onClose} />
        <div className="relative bg-card rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-border animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
            <h3 className="text-lg font-semibold text-foreground">
              Duyệt câu hỏi đóng góp
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          <div className="p-6 space-y-5">
            {/* Main Tabs: Original vs Translation */}
            <div className="flex gap-2 border-b border-border">
              <button
                type="button"
                onClick={() => setModalTab("original")}
                className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "original"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Nội dung đóng góp gốc</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("translate")}
                className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "translate"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Duyệt & Dịch ngôn ngữ</span>
              </button>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm border border-destructive/20 font-medium">
                {error}
              </div>
            )}

            {modalTab === "original" ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Câu hỏi gốc
                  </span>
                  <div className="text-sm text-foreground bg-muted/10 px-4 py-3 rounded-lg border border-border leading-relaxed font-semibold">
                    {contribution.question}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Câu trả lời gốc
                    </span>
                    <MarkdownEditor
                      value={contribution.answer || ""}
                      readOnly={true}
                      height={600}
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Gợi ý gốc
                    </span>
                    <MarkdownEditor
                      value={contribution.tips || ""}
                      readOnly={true}
                      height={120}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Info Box */}
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-foreground">
                      <p className="font-semibold mb-1">Bạn có thể bổ sung hoặc chỉnh sửa câu hỏi, câu trả lời và gợi ý cho cả 4 ngôn ngữ trước khi duyệt</p>
                      <p className="text-xs text-muted-foreground">Thông tin gốc từ người đóng góp được điền sẵn trong tab Tiếng Việt</p>
                    </div>
                  </div>
                </div>

                {/* Locale Tabs */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Ngôn ngữ câu hỏi phỏng vấn <span className="text-red-500">*</span>
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
                          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap flex items-center gap-1.5 ${
                            isActive
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

                {/* Input fields based on Active Locale */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Câu hỏi ({LOCALES.find((l) => l.code === activeLocale)?.label}) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={currentTrans?.question || ""}
                      onChange={(e) => updateTranslation(activeLocale, "question", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground placeholder-muted-foreground transition-colors resize-none text-sm leading-relaxed"
                      placeholder="Nhập câu hỏi..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Câu trả lời ({LOCALES.find((l) => l.code === activeLocale)?.label}) <span className="text-red-500">*</span>
                    </label>
                    <MarkdownEditor
                      value={currentTrans?.answer || ""}
                      onChange={(value) => updateTranslation(activeLocale, "answer", value)}
                      placeholder="Nhập câu trả lời chi tiết... Hỗ trợ Markdown để định dạng code."
                      height={500}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
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
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-3 z-10">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              Hủy
            </Button>
            <Button
              variant="outline"
              onClick={handleSubmit}
              className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/20"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Duyệt câu hỏi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
