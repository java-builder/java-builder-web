"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { interviewService } from "@/services/interview.service";
import {
  InterviewTopicDetailResponse,
  pickTopicTranslation,
} from "@/types/interview";
import { useConfirm } from "@/hooks/useConfirm";
import { clearInterviewTopicsCache } from "@/hooks/useInterviewTopics";
import CreateInterviewTopicModal from "@/components/admin/interview/CreateInterviewTopicModal";
import UpdateInterviewTopicModal from "@/components/admin/interview/UpdateInterviewTopicModal";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Layers, HelpCircle, CheckCircle2, Pencil, ExternalLink, Trash2, Loader2 } from "lucide-react";

export default function InterviewTopicsPage() {
  const { t, locale } = useI18n();
  const [topics, setTopics] = useState<InterviewTopicDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<InterviewTopicDetailResponse | null>(null);
  const { confirm } = useConfirm();
  const nextDisplayOrder =
    topics.length > 0
      ? Math.max(...topics.map((topic) => topic.displayOrder || 0)) + 1
      : 1;

  const totalTopics = topics.length;
  const totalQuestionSets = topics.reduce((sum, topic) => sum + (topic.totalQuestionSets || 0), 0);
  const totalQuestions = topics.reduce((sum, topic) => sum + (topic.totalQuestions || 0), 0);
  const activeTopics = topics.filter((t) => t.active).length;

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const res = await interviewService.getAllTopics();
      setTopics(res.data || []);
    } catch (e) {
      console.error(e);
      setTopics([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch khi locale đổi → BE trả data theo Accept-Language header
  useEffect(() => {
    fetchTopics();
  }, [locale]);

  const handleDelete = async (id: string, name: string) => {
    const message = t("admin.interviewTopics.deleteConfirmMessage").replace("{name}", name);
    await confirm(
      async () => {
        setDeletingId(id);
        try {
          await interviewService.deleteTopic(id);
          clearInterviewTopicsCache();
          await fetchTopics();
        } catch (e) {
          console.error(e);
        } finally {
          setDeletingId(null);
        }
      },
      {
        title: t("admin.interviewTopics.deleteConfirmTitle"),
        message,
        confirmText: t("admin.interviewTopics.deleteConfirmBtn"),
        cancelText: t("admin.interviewTopics.cancelBtn"),
        type: "error",
      }
    );
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {t("admin.interviewTopics.pageTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("admin.interviewTopics.pageSubtitle")}
          </p>
        </div>
        <div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            variant="accent"
            className="w-full sm:w-auto gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t("admin.interviewTopics.createButton")}</span>
            <span className="sm:hidden">{t("admin.interviewTopics.createButtonShort")}</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 sm:p-5 animate-pulse flex items-center justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-3.5 bg-muted rounded w-24" />
                <div className="h-7 bg-muted rounded w-16" />
              </div>
              <div className="w-9 h-9 rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 select-none">
          {/* Total Topics */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between transition-all duration-200 hover:scale-[1.01] hover:shadow-sm">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tổng số chủ đề</p>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 mt-1.5">
                {totalTopics}
              </p>
            </div>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-blue-600 dark:text-blue-400">
              <BookOpen className="w-5.5 h-5.5" />
            </div>
          </div>

          {/* Total Question Sets */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between transition-all duration-200 hover:scale-[1.01] hover:shadow-sm">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tổng bộ câu hỏi</p>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 mt-1.5">
                {totalQuestionSets}
              </p>
            </div>
            <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg text-cyan-600 dark:text-cyan-400">
              <Layers className="w-5.5 h-5.5" />
            </div>
          </div>

          {/* Total Questions */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between transition-all duration-200 hover:scale-[1.01] hover:shadow-sm">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tổng số câu hỏi</p>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 mt-1.5">
                {totalQuestions}
              </p>
            </div>
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-600 dark:text-amber-400">
              <HelpCircle className="w-5.5 h-5.5" />
            </div>
          </div>

          {/* Active Topics */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between transition-all duration-200 hover:scale-[1.01] hover:shadow-sm">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Chủ đề hoạt động</p>
              <p className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 mt-1.5">
                {activeTopics}
              </p>
            </div>
            <div className="p-2.5 bg-green-50 dark:bg-green-950/30 rounded-lg text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-5.5 h-5.5" />
            </div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-gray-250 dark:border-slate-700/60 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-muted" />
                    <div className="h-5 bg-muted rounded w-32" />
                  </div>
                  <div className="w-16 h-6 rounded bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-8 bg-muted rounded w-16" />
                  <div className="h-8 bg-muted rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : topics.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t("admin.interviewTopics.emptyTitle")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("admin.interviewTopics.emptyDesc")}
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              variant="accent"
              className="gap-2"
            >
              <Plus className="w-5 h-5" />
              {t("admin.interviewTopics.createButton")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-6">
            {topics.map((topic) => {
              const tr = pickTopicTranslation(topic.translations, locale);
              const topicName = tr?.name || topic.slug;
              const topicDescription = tr?.description;
              return (
                <div
                  key={topic.id}
                  className="bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200 hover:border-accent/50"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        {topic.thumbnailUrl && (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            <Image
                              src={topic.thumbnailUrl}
                              alt={topicName}
                              width={32}
                              height={32}
                              className="object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                            {topicName}
                          </h3>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                          topic.active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {topic.active
                          ? t("admin.interviewTopics.statusActive" as Parameters<typeof t>[0])
                          : t("admin.interviewTopics.statusInactive" as Parameters<typeof t>[0])}
                      </span>
                    </div>

                    {topicDescription && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2">
                        {topicDescription}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        {/* Empty space for alignment */}
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTopic(topic);
                            setIsEditOpen(true);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10"
                          title={t("admin.interviewTopics.editBtn")}
                        >
                          <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                        <Link
                          href={`/admin/interview-topics/${topic.id}/edit`}
                          className="inline-flex items-center justify-center rounded-md h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                          title={t("admin.interviewTopics.viewBtn")}
                        >
                          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(topic.id, topicName)}
                          disabled={deletingId === topic.id}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={t("admin.interviewTopics.deleteBtn")}
                        >
                          {deletingId === topic.id ? (
                            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateInterviewTopicModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        nextDisplayOrder={nextDisplayOrder}
        onSuccess={() => {
          clearInterviewTopicsCache();
          fetchTopics();
          setIsCreateOpen(false);
        }}
      />

      <UpdateInterviewTopicModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedTopic(null);
        }}
        onSuccess={() => {
          clearInterviewTopicsCache();
          fetchTopics();
          setIsEditOpen(false);
          setSelectedTopic(null);
        }}
        topic={selectedTopic}
      />
    </div>
  );
}
