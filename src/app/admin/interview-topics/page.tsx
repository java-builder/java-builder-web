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

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const res = await interviewService.getAllTopics();
      setTopics(res.data?.topics || []);
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">{t("admin.interviewTopics.createButton")}</span>
            <span className="sm:hidden">{t("admin.interviewTopics.createButtonShort")}</span>
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            {t("admin.interviewTopics.loading")}
          </div>
        ) : topics.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
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
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Link
                          href={`/admin/interview-topics/${topic.id}/edit`}
                          className="inline-flex items-center justify-center rounded-md h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                          title={t("admin.interviewTopics.viewBtn")}
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
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
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
