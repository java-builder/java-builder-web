"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { interviewService } from "@/services/interview.service";
import {
  pickTopicTranslation,
  pickQuestionSetTranslation,
} from "@/types/interview";
import { QuestionSetDetailResponse } from "@/types/question-set";
import { useConfirm } from "@/hooks/useConfirm";
import { useI18n } from "@/contexts/I18nContext";
import CreateQuestionSetModal from "@/components/admin/interview/CreateQuestionSetModal";
import UpdateQuestionSetModal from "@/components/admin/interview/UpdateQuestionSetModal";
import toast from "react-hot-toast";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function EditInterviewTopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  const { locale } = useI18n();

  const [questionSets, setQuestionSets] = useState<QuestionSetDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingSetId, setDeletingSetId] = useState<string | null>(null);
  const { confirm } = useConfirm();

  // Form state (chỉ dùng để hiển thị name/description theo locale hiện tại)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [key, setKey] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Modal state
  const [isCreateSetOpen, setIsCreateSetOpen] = useState(false);
  const [isUpdateSetOpen, setIsUpdateSetOpen] = useState(false);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<QuestionSetDetailResponse | null>(null);

  const fetchTopic = useCallback(async () => {
    if (!topicId) return;

    try {
      setIsLoading(true);

      const allTopicsRes = await interviewService.getAllTopics();
      const foundTopic = allTopicsRes.data?.topics.find((t) => t.id === topicId);

      if (foundTopic) {
        const tr = pickTopicTranslation(foundTopic.translations, locale);
        setName(tr?.name || "");
        setDescription(tr?.description || "");
        setDisplayOrder(foundTopic.displayOrder);
        setKey("");
        setThumbnailUrl(foundTopic.thumbnailUrl || "");

        // Fetch question sets by topic slug
        const { questionSetService } = await import("@/services/question-set.service");
        const setsRes = await questionSetService.getQuestionSetsByTopicSlug(foundTopic.slug);
        setQuestionSets(setsRes.data?.questionSets || []);
      }
    } catch (error) {
      console.error("Error fetching topic:", error);
      toast.error("Không thể tải thông tin chủ đề");
    } finally {
      setIsLoading(false);
    }
  }, [topicId, locale]);

  // Refetch khi topicId hoặc locale đổi
  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  // Helper: lấy title của question set theo locale hiện tại
  const getSetTitle = useCallback(
    (set: QuestionSetDetailResponse) =>
      pickQuestionSetTranslation(set.translations, locale)?.title || set.slug,
    [locale]
  );

  // Helper: lấy description của question set theo locale hiện tại
  const getSetDescription = useCallback(
    (set: QuestionSetDetailResponse) =>
      pickQuestionSetTranslation(set.translations, locale)?.description || "",
    [locale]
  );

  // Helper: lấy locale code của translation đang dùng để hiển thị (BE locale uppercase)
  const getSetActiveLocale = useCallback(
    (set: QuestionSetDetailResponse) =>
      pickQuestionSetTranslation(set.translations, locale)?.locale || null,
    [locale]
  );

  const handleSaveTopic = async () => {
    setIsSaving(true);
    try {
      await interviewService.updateTopic(topicId, {
        displayOrder,
        key: key || undefined,
      });
      toast.success("Cập nhật chủ đề thành công!");
      await fetchTopic();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestionSet = async (id: string, title: string) => {
    await confirm(
      async () => {
        setDeletingSetId(id);
        try {
          const { questionSetService } = await import("@/services/question-set.service");
          await questionSetService.deleteQuestionSet(id);
          await fetchTopic();
          toast.success("Xóa bộ câu hỏi thành công!");
        } catch (e) {
          console.error(e);
          toast.error("Xóa thất bại");
        } finally {
          setDeletingSetId(null);
        }
      },
      {
        title: "Xác nhận xóa bộ câu hỏi",
        message: `<div>Bạn có chắc muốn xóa bộ câu hỏi <strong>${title}</strong>?</div>`,
        confirmText: "Xóa",
        cancelText: "Hủy",
        type: "error",
      }
    );
  };

  const getLevelBadge = (level: string) => {
    const configs = {
      INTERN: { color: "bg-muted text-muted-foreground border-border", text: "Intern" },
      FRESHER: { color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", text: "Fresher" },
      JUNIOR: { color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", text: "Junior" },
      MIDDLE: { color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", text: "Middle" },
      SENIOR: { color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20", text: "Senior" },
    };
    const config = configs[level as keyof typeof configs] || { color: "bg-muted text-muted-foreground border-border", text: level };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${config.color}`}>{config.text}</span>;
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
      <div className="p-6 space-y-6 animate-pulse max-w-5xl bg-gray-50 min-h-screen">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-muted" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-1/3" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-10 bg-muted rounded w-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-20 bg-muted rounded w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-20" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-20" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
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
            <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">Chỉnh sửa chủ đề</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{name}</p>
          </div>
        </div>
        <Button
          onClick={handleSaveTopic}
          disabled={isSaving}
          variant="accent"
          className="h-10 gap-2 flex-shrink-0"
        >
          {isSaving && (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          <span className="hidden sm:inline">Lưu thay đổi</span>
          <span className="sm:hidden">Lưu</span>
        </Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left - Topic Info */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-4 sm:p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Thông tin chủ đề</h3>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Tên chủ đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Mô tả
              </label>
              <textarea
                ref={(el) => {
                  if (el) {
                    el.style.height = 'auto';
                    el.style.height = el.scrollHeight + 'px';
                  }
                }}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground resize-none overflow-hidden"
                rows={1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground"
              />
            </div>

            {thumbnailUrl && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Icon hiện tại
                </label>
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <Image
                    src={thumbnailUrl}
                    alt={name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Question Sets */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border">
            <div className="p-4 sm:p-6 border-b border-border">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">
                  Bộ câu hỏi ({questionSets.length})
                </h3>
                <Button
                  onClick={() => setIsCreateSetOpen(true)}
                  variant="accent"
                  className="h-9 gap-1.5 sm:gap-2 flex-shrink-0 text-xs sm:text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Thêm bộ câu hỏi</span>
                  <span className="sm:hidden">Thêm</span>
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {questionSets.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <svg className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-semibold text-sm">Chưa có bộ câu hỏi nào</p>
                  <p className="text-xs">Nhấn &quot;Thêm bộ câu hỏi&quot; để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {questionSets.map((set) => {
                    const activeLocale = getSetActiveLocale(set);
                    const description = getSetDescription(set);
                    const topicTags = set.topics
                      ? set.topics.split(",").map((s) => s.trim()).filter(Boolean)
                      : [];
                    return (
                      <div
                        key={set.id}
                        className="group border border-border rounded-xl p-5 hover:border-accent/60 hover:shadow-sm transition-all bg-card"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0 space-y-3">
                            {/* Title row */}
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-base text-foreground line-clamp-2 flex-1 leading-snug">
                                {getSetTitle(set)}
                              </h4>
                              {activeLocale && (
                                <span
                                  className="inline-flex items-center rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex-shrink-0"
                                  title={`Đang hiển thị bản dịch: ${activeLocale}`}
                                >
                                  {activeLocale}
                                </span>
                              )}
                            </div>

                            {/* Description */}
                            {description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {description}
                              </p>
                            )}

                            {/* Meta row: badges + count */}
                            <div className="flex items-center gap-2 flex-wrap text-xs">
                              {getLevelBadge(set.level)}
                              {getDifficultyBadge(set.difficulty)}
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {set.totalQuestions || 0} câu hỏi
                              </span>
                            </div>

                            {/* Topics as chips */}
                            {topicTags.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                {topicTags.slice(0, 6).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-0.5 text-xs rounded bg-accent/10 text-accent dark:bg-accent/20"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {topicTags.length > 6 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{topicTags.length - 6}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedQuestionSet(set);
                                setIsUpdateSetOpen(true);
                              }}
                              className="h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10"
                              title="Chỉnh sửa"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Button>
                            <Link
                              href={`/admin/question-sets/${set.id}/edit`}
                              className={cn(
                                buttonVariants({ variant: "ghost", size: "icon" }),
                                "h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10"
                              )}
                              title="Quản lý câu hỏi"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteQuestionSet(set.id, getSetTitle(set))}
                              disabled={deletingSetId === set.id}
                              className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 disabled:opacity-50"
                              title="Xóa"
                            >
                              {deletingSetId === set.id ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateQuestionSetModal
        isOpen={isCreateSetOpen}
        onClose={() => setIsCreateSetOpen(false)}
        onSuccess={() => {
          fetchTopic();
          setIsCreateSetOpen(false);
        }}
        topicId={topicId}
        topicName={name}
        nextDisplayOrder={questionSets.length + 1}
      />

      <UpdateQuestionSetModal
        isOpen={isUpdateSetOpen}
        onClose={() => {
          setIsUpdateSetOpen(false);
          setSelectedQuestionSet(null);
        }}
        onSuccess={() => {
          fetchTopic();
          setIsUpdateSetOpen(false);
          setSelectedQuestionSet(null);
        }}
        questionSet={selectedQuestionSet}
      />
    </div>
  );
}
