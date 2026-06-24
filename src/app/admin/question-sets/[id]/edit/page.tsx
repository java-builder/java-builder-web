"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { questionSetService } from "@/services/question-set.service";
import { interviewQuestionService } from "@/services/interview-question.service";
import { QuestionSetDetailResponse } from "@/types/question-set";
import { InterviewQuestionResponse } from "@/types/interview-question";
import {
  pickQuestionSetTranslation,
  pickInterviewQuestionTranslation,
} from "@/types/interview";
import { useConfirm } from "@/hooks/useConfirm";
import { useI18n } from "@/contexts/I18nContext";
import CreateInterviewQuestionModal from "@/components/admin/interview/CreateInterviewQuestionModal";
import UpdateInterviewQuestionModal from "@/components/admin/interview/UpdateInterviewQuestionModal";
import toast from "react-hot-toast";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import { Button } from "@/components/ui/button";

export default function EditQuestionSetPage() {
  const params = useParams();
  const router = useRouter();
  const questionSetId = params.id as string;
  const { locale } = useI18n();

  const [questionSet, setQuestionSet] = useState<QuestionSetDetailResponse | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<InterviewQuestionResponse | null>(null);

  const { confirm } = useConfirm();

  const fetchData = useCallback(async () => {
    if (!questionSetId) return;

    try {
      setIsLoading(true);

      const allSetsRes = await questionSetService.getAllQuestionSets();
      const foundSet = allSetsRes.data?.questionSets.find((qs) => qs.id === questionSetId);

      if (foundSet) {
        setQuestionSet(foundSet);
      }

      const questionsRes = await interviewQuestionService.getInterviewQuestionsByQuestionSetId(
        questionSetId
      );
      setQuestions(questionsRes.data?.questions || []);
    } catch (error) {
      console.error("Error fetching question set:", error);
      toast.error("Không thể tải thông tin bộ câu hỏi");
    } finally {
      setIsLoading(false);
    }
  }, [questionSetId]);

  // Refetch khi đổi locale → BE trả data theo Accept-Language
  useEffect(() => {
    fetchData();
  }, [fetchData, locale]);

  // Title của question set theo locale hiện tại (display)
  const setTitle = pickQuestionSetTranslation(questionSet?.translations, locale)?.title || questionSet?.slug || "";

  // Helper: lấy question/answer/tips của 1 question theo locale hiện tại
  const getQuestionFields = useCallback(
    (q: InterviewQuestionResponse) => {
      const tr = pickInterviewQuestionTranslation(q.translations, locale);
      return {
        question: tr?.question || q.slug,
        answer: tr?.answer || "",
        tips: tr?.tips || "",
      };
    },
    [locale]
  );

  const handleDeleteQuestion = async (questionId: string, displayQuestion: string) => {
    await confirm(
      async () => {
        try {
          await interviewQuestionService.deleteInterviewQuestion(questionId);
          toast.success("Xóa câu hỏi thành công!");
          await fetchData();
        } catch (error) {
          console.error("Error deleting question:", error);
          toast.error("Xóa câu hỏi thất bại");
        }
      },
      {
        title: "Xác nhận xóa câu hỏi",
        message: `<div>Bạn có chắc muốn xóa câu hỏi này?</div><div class="text-sm text-muted-foreground mt-2">${displayQuestion.substring(
          0,
          120
        )}${displayQuestion.length > 120 ? "..." : ""}</div>`,
        confirmText: "Xóa",
        cancelText: "Hủy",
        type: "error",
      }
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    const configs = {
      EASY: { color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", text: "Dễ" },
      MEDIUM: { color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", text: "Trung bình" },
      HARD: { color: "bg-destructive/10 text-destructive border-destructive/25", text: "Khó" },
    };
    const config = configs[difficulty as keyof typeof configs] || { color: "bg-muted text-muted-foreground border-border", text: difficulty };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${config.color}`}>{config.text}</span>;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <svg className="animate-spin w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9 text-muted-foreground hover:text-foreground flex-shrink-0"
            aria-label="Quay lại"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
              Quản lý câu hỏi
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{setTitle}</p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          variant="accent"
          className="w-full sm:w-auto gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm câu hỏi
        </Button>
      </div>

      {/* Content */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6">
          {questions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <svg className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm sm:text-base font-semibold">Chưa có câu hỏi nào</p>
              <p className="text-xs sm:text-sm">Nhấn &quot;Thêm câu hỏi&quot; để bắt đầu</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, index) => {
                const isExpanded = expandedQuestionId === q.id;
                const fields = getQuestionFields(q);
                return (
                  <div key={q.id} className="border border-border rounded-lg overflow-hidden bg-card">
                    <div
                      className="flex items-center justify-between px-3 sm:px-4 py-3 bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors"
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-xs sm:text-sm font-semibold bg-accent/10 text-accent flex-shrink-0">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-2">
                            {fields.question}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {getDifficultyBadge(q.difficulty)}
                            {q.isPremium ? (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
                                Premium 💎
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30 text-gray-500 dark:text-gray-400">
                                Miễn phí
                              </span>
                            )}
                            {!q.active && (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full border border-border bg-muted text-muted-foreground">
                                Ẩn
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingQuestion(q);
                            setIsEditOpen(true);
                          }}
                          className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 hover:text-blue-600"
                          title="Sửa"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuestion(q.id, fields.question);
                          }}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          title="Xóa"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                        <svg
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-3 sm:p-4 border-t border-border bg-card">
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">
                              Câu hỏi:
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">
                              {fields.question}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">
                              Trả lời:
                            </h4>
                            <div className="text-xs sm:text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                              <PublicMarkdownRenderer content={fields.answer} />
                            </div>
                          </div>
                          {fields.tips && (
                            <div>
                              <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">
                                Tips:
                              </h4>
                              <div className="text-xs sm:text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                                <PublicMarkdownRenderer content={fields.tips} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <CreateInterviewQuestionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          fetchData();
          setIsCreateOpen(false);
        }}
        questionSetId={questionSetId}
        nextDisplayOrder={questions.length + 1}
      />

      <UpdateInterviewQuestionModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingQuestion(null);
        }}
        onSuccess={() => {
          fetchData();
          setIsEditOpen(false);
          setEditingQuestion(null);
        }}
        question={editingQuestion}
      />
    </div>
  );
}
