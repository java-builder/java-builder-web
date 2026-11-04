"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash2, Info, Tag, CheckCircle2 } from "lucide-react";
import { questionContributionService } from "@/services/question-contribution.service";
import { useInterviewTopics } from "@/hooks/useInterviewTopics";
import { pickTopicTranslation } from "@/types/interview";
import { useI18n } from "@/contexts/I18nContext";
import MarkdownRenderer from "@/components/ui/markdown-viewer";
import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type DifficultyType = "EASY" | "MEDIUM" | "HARD";
type LevelType = "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";

const DIFFICULTY_OPTIONS: { value: DifficultyType; label: string; activeClass: string }[] = [
  {
    value: "EASY",
    label: "Dễ",
    activeClass: "bg-success-soft text-success border-success/30",
  },
  {
    value: "MEDIUM",
    label: "Trung bình",
    activeClass: "bg-warning-soft text-warning border-warning/30",
  },
  {
    value: "HARD",
    label: "Khó",
    activeClass: "bg-error-soft text-error border-error/30",
  },
];

const LEVEL_SELECT_OPTIONS: SelectOption<LevelType>[] = [
  { value: "INTERN", label: "Intern" },
  { value: "FRESHER", label: "Fresher" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MIDDLE", label: "Middle" },
  { value: "SENIOR", label: "Senior" },
];

const DIFFICULTY_SELECT_OPTIONS: SelectOption<DifficultyType>[] = [
  { value: "EASY", label: "Dễ" },
  { value: "MEDIUM", label: "Trung bình" },
  { value: "HARD", label: "Khó" },
];

function ContributeQuestionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questionSetId = searchParams.get("questionSetId");
  const questionSetTitle = searchParams.get("questionSetTitle");
  const topicId = searchParams.get("topicId");
  const topicName = searchParams.get("topicName");

  const { topics } = useInterviewTopics();
  const { locale } = useI18n();
  const [contributeType, setContributeType] = useState<"existing" | "new">(
    questionSetId ? "existing" : "new"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewTabs, setPreviewTabs] = useState<{ [key: string]: "write" | "preview" }>({});

  const [newSetForm, setNewSetForm] = useState({
    interviewTopicId: topicId || "",
    title: "",
    level: "JUNIOR" as LevelType,
    difficulty: "MEDIUM" as DifficultyType,
    topics: "",
  });

  const [questionsList, setQuestionsList] = useState([
    { question: "", answer: "", tips: "", difficulty: "MEDIUM" as DifficultyType },
  ]);

  useEffect(() => {
    if (topicId) {
      setNewSetForm((prev) => ({ ...prev, interviewTopicId: topicId }));
    }
  }, [topicId]);

  const topicSelectOptions = useMemo<SelectOption<string>[]>(
    () =>
      topics.map((topic) => {
        const tr = pickTopicTranslation(topic.translations, locale);
        return {
          value: topic.id,
          label: tr?.name || topic.slug,
        };
      }),
    [topics, locale]
  );

  const addQuestion = () => {
    setQuestionsList([
      ...questionsList,
      { question: "", answer: "", tips: "", difficulty: "MEDIUM" as DifficultyType },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questionsList.length > 1) {
      setQuestionsList(questionsList.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const updated = [...questionsList];
    updated[index] = { ...updated[index], [field]: value };
    setQuestionsList(updated);
  };

  const handleSubmit = async () => {
    if (questionsList.some((q) => !q.question.trim())) {
      toast.error("Vui lòng nhập đầy đủ câu hỏi");
      return;
    }

    if (contributeType === "new") {
      if (!newSetForm.interviewTopicId || !newSetForm.title.trim()) {
        toast.error("Vui lòng chọn chủ đề và nhập tên bộ câu hỏi");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const payload =
        contributeType === "existing"
          ? {
              questionSetId: questionSetId!,
              questions: questionsList,
            }
          : {
              interviewTopicId: newSetForm.interviewTopicId,
              newQuestionSetTitle: newSetForm.title,
              difficulty: newSetForm.difficulty,
              level: newSetForm.level,
              topics: newSetForm.topics,
              questions: questionsList,
            };

      await questionContributionService.createContribution(payload);

      toast.success(
        contributeType === "new"
          ? "Đã gửi đề xuất bộ câu hỏi mới! Chờ admin duyệt."
          : "Cảm ơn bạn đã đóng góp!"
      );

      router.back();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Đóng góp câu hỏi phỏng vấn
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Chia sẻ câu hỏi thực tế và kinh nghiệm trả lời của bạn cùng cộng đồng
            </p>
          </div>

          {topicName && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-soft text-primary border border-primary/20 rounded-full text-xs font-semibold shrink-0">
              <Tag className="w-3.5 h-3.5" />
              <span>Chủ đề: {topicName}</span>
            </div>
          )}
        </div>

        {/* Form Container */}
        <div className="bg-surface rounded-2xl border border-border p-5 sm:p-7 space-y-6 shadow-xs">
          {/* Type Selection */}
          {questionSetId && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">
                Bộ câu hỏi áp dụng
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setContributeType("existing")}
                  className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    contributeType === "existing"
                      ? "border-primary bg-primary-soft/30"
                      : "border-border bg-surface hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      contributeType === "existing"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border-hover bg-background"
                    }`}
                  >
                    {contributeType === "existing" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">
                      {questionSetTitle || "Bộ câu hỏi hiện tại"}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">
                      Thêm câu hỏi vào bộ câu hỏi này
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setContributeType("new")}
                  className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    contributeType === "new"
                      ? "border-primary bg-primary-soft/30"
                      : "border-border bg-surface hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      contributeType === "new"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border-hover bg-background"
                    }`}
                  >
                    {contributeType === "new" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground">
                      Đề xuất bộ câu hỏi mới
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">
                      Tạo một bộ câu hỏi mới cho chủ đề khác
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* New Set Form */}
          {contributeType === "new" && (
            <div className="p-5 bg-muted/30 border border-border rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-text-secondary bg-surface px-3 py-2 rounded-lg border border-border">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span>Bộ câu hỏi mới sẽ được đội ngũ quản trị xem xét trước khi xuất bản.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Chủ đề <span className="text-error">*</span>
                  </label>
                  <Select
                    value={newSetForm.interviewTopicId}
                    onChange={(val) =>
                      setNewSetForm({ ...newSetForm, interviewTopicId: String(val) })
                    }
                    options={topicSelectOptions}
                    placeholder="Chọn chủ đề"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Tên bộ câu hỏi <span className="text-error">*</span>
                  </label>
                  <Input
                    type="text"
                    value={newSetForm.title}
                    onChange={(e) => setNewSetForm({ ...newSetForm, title: e.target.value })}
                    placeholder="Ví dụ: Spring Security Basics"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Cấp độ
                  </label>
                  <Select
                    value={newSetForm.level}
                    onChange={(val) =>
                      setNewSetForm({ ...newSetForm, level: val as LevelType })
                    }
                    options={LEVEL_SELECT_OPTIONS}
                    searchable={false}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Độ khó chung
                  </label>
                  <Select
                    value={newSetForm.difficulty}
                    onChange={(val) =>
                      setNewSetForm({
                        ...newSetForm,
                        difficulty: val as DifficultyType,
                      })
                    }
                    options={DIFFICULTY_SELECT_OPTIONS}
                    searchable={false}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Tags (phân cách bằng dấu phẩy)
                  </label>
                  <Input
                    type="text"
                    value={newSetForm.topics}
                    onChange={(e) => setNewSetForm({ ...newSetForm, topics: e.target.value })}
                    placeholder="Spring, Security, JWT"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">
                Danh sách câu hỏi ({questionsList.length})
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
                className="gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm câu hỏi
              </Button>
            </div>

            <div className="space-y-5">
              {questionsList.map((q, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-5 border border-border rounded-2xl bg-background/40 space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-primary-soft text-primary text-xs font-bold">
                        Câu #{index + 1}
                      </span>
                      <div className="flex items-center gap-1 ml-2">
                        {DIFFICULTY_OPTIONS.map((diff) => {
                          const isSelected = q.difficulty === diff.value;
                          return (
                            <button
                              key={diff.value}
                              type="button"
                              onClick={() => updateQuestion(index, "difficulty", diff.value)}
                              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                                isSelected
                                  ? diff.activeClass
                                  : "bg-surface text-text-muted border-border hover:text-foreground"
                              }`}
                            >
                              {diff.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {questionsList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-error hover:bg-error-soft transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Xóa
                      </button>
                    )}
                  </div>

                  {/* Question input */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Nội dung câu hỏi <span className="text-error">*</span>
                    </label>
                    <textarea
                      value={q.question}
                      onChange={(e) => updateQuestion(index, "question", e.target.value)}
                      rows={2}
                      placeholder="Nhập câu hỏi phỏng vấn..."
                      className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
                    />
                  </div>

                  {/* Suggested Answer */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <label className="block text-xs font-semibold text-foreground">
                          Câu trả lời gợi ý{" "}
                          <span className="text-text-muted font-normal">
                            (không bắt buộc, hỗ trợ Markdown)
                          </span>
                        </label>
                      </div>
                      <div className="inline-flex rounded-lg bg-muted p-0.5 border border-border">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewTabs({ ...previewTabs, [`answer-${index}`]: "write" })
                          }
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                            (previewTabs[`answer-${index}`] || "write") === "write"
                              ? "bg-surface text-foreground shadow-2xs"
                              : "text-text-muted hover:text-foreground"
                          }`}
                        >
                          Viết
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewTabs({ ...previewTabs, [`answer-${index}`]: "preview" })
                          }
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                            previewTabs[`answer-${index}`] === "preview"
                              ? "bg-surface text-foreground shadow-2xs"
                              : "text-text-muted hover:text-foreground"
                          }`}
                        >
                          Xem trước
                        </button>
                      </div>
                    </div>

                    <div className="border border-border rounded-xl overflow-hidden bg-surface">
                      {(previewTabs[`answer-${index}`] || "write") === "write" ? (
                        <textarea
                          value={q.answer}
                          onChange={(e) => updateQuestion(index, "answer", e.target.value)}
                          rows={8}
                          placeholder="Ví dụ: ArrayList sử dụng mảng động, truy cập nhanh O(1) nhưng chèn/xóa chậm O(n)..."
                          className="w-full px-3.5 py-3 text-sm border-0 focus:outline-none bg-surface text-foreground placeholder:text-text-muted resize-y"
                        />
                      ) : (
                        <div className="px-4 py-3 min-h-[180px] max-h-[420px] overflow-y-auto bg-surface">
                          {q.answer ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <MarkdownRenderer content={q.answer} />
                            </div>
                          ) : (
                            <div className="text-xs text-text-muted italic py-6 text-center">
                              Chưa có nội dung để xem trước
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-foreground">
                        Mẹo trả lời ghi điểm{" "}
                        <span className="text-text-muted font-normal">(không bắt buộc)</span>
                      </label>
                      <div className="inline-flex rounded-lg bg-muted p-0.5 border border-border">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewTabs({ ...previewTabs, [`tips-${index}`]: "write" })
                          }
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                            (previewTabs[`tips-${index}`] || "write") === "write"
                              ? "bg-surface text-foreground shadow-2xs"
                              : "text-text-muted hover:text-foreground"
                          }`}
                        >
                          Viết
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewTabs({ ...previewTabs, [`tips-${index}`]: "preview" })
                          }
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                            previewTabs[`tips-${index}`] === "preview"
                              ? "bg-surface text-foreground shadow-2xs"
                              : "text-text-muted hover:text-foreground"
                          }`}
                        >
                          Xem trước
                        </button>
                      </div>
                    </div>

                    <div className="border border-border rounded-xl overflow-hidden bg-surface">
                      {(previewTabs[`tips-${index}`] || "write") === "write" ? (
                        <textarea
                          value={q.tips}
                          onChange={(e) => updateQuestion(index, "tips", e.target.value)}
                          rows={3}
                          placeholder="Nên nhấn mạnh điểm gì? Tránh sai lầm nào? Người phỏng vấn thường hỏi xoáy thêm gì?"
                          className="w-full px-3.5 py-2.5 text-sm border-0 focus:outline-none bg-surface text-foreground placeholder:text-text-muted resize-y"
                        />
                      ) : (
                        <div className="px-4 py-3 min-h-[90px] max-h-[260px] overflow-y-auto bg-surface">
                          {q.tips ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <MarkdownRenderer content={q.tips} />
                            </div>
                          ) : (
                            <div className="text-xs text-text-muted italic py-4 text-center">
                              Chưa có nội dung để xem trước
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {questionsList.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
                className="gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm câu hỏi khác
              </Button>
            )}
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? "Đang gửi..." : "Gửi câu hỏi"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContributeQuestionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-sm text-text-muted">Đang tải...</div>
            </div>
          </div>
        </div>
      }
    >
      <ContributeQuestionForm />
    </Suspense>
  );
}
