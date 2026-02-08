"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { interviewService } from "@/services/interview.service";
import { questionSetService } from "@/services/question-set.service";
import { InterviewTopicDetailResponse } from "@/types/interview";
import { useConfirm } from "@/hooks/useConfirm";
import { clearInterviewTopicsCache } from "@/hooks/useInterviewTopics";
import { useQuestionSets, clearQuestionSetsCache } from "@/hooks/useQuestionSets";
import CreateInterviewTopicModal from "@/components/admin/interview/CreateInterviewTopicModal";
import UpdateInterviewTopicModal from "@/components/admin/interview/UpdateInterviewTopicModal";
import CreateQuestionSetModal from "@/components/admin/interview/CreateQuestionSetModal";

export default function InterviewTopicsPage() {
  const [topics, setTopics] = useState<InterviewTopicDetailResponse[]>([]);
  const { questionSets } = useQuestionSets();
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingSetId, setDeletingSetId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateSetOpen, setIsCreateSetOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<InterviewTopicDetailResponse | null>(null);
  const [selectedTopicForSet, setSelectedTopicForSet] = useState<{ id: string; name: string } | null>(null);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const { confirm } = useConfirm();

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

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleDelete = async (id: string, name: string) => {
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
        title: "Xác nhận xóa chủ đề",
        message: `<div>Bạn có chắc muốn xóa chủ đề <strong>${name}</strong>?</div><div class="text-sm text-gray-500 mt-2">Tất cả câu hỏi trong chủ đề này cũng sẽ bị xóa.</div>`,
        confirmText: "Xóa",
        cancelText: "Hủy",
        type: "error",
      }
    );
  };

  const handleDeleteQuestionSet = async (id: string, title: string) => {
    await confirm(
      async () => {
        setDeletingSetId(id);
        try {
          await questionSetService.deleteQuestionSet(id);
          clearQuestionSetsCache();
        } catch (e) {
          console.error(e);
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
      INTERN: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", text: "Intern" },
      FRESHER: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", text: "Fresher" },
      JUNIOR: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", text: "Junior" },
      MIDDLE: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", text: "Middle" },
      SENIOR: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", text: "Senior" },
    };
    const config = configs[level as keyof typeof configs] || { color: "bg-gray-100 text-gray-800", text: level };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>{config.text}</span>;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const configs = {
      EASY: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", text: "Dễ" },
      MEDIUM: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", text: "Trung bình" },
      HARD: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", text: "Khó" },
    };
    const config = configs[difficulty as keyof typeof configs] || { color: "bg-gray-100 text-gray-800", text: difficulty };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>{config.text}</span>;
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý câu hỏi phỏng vấn
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Tạo và quản lý các chủ đề phỏng vấn với câu hỏi
          </p>
        </div>
        <div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors shadow-sm hover:shadow-md inline-flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Tạo chủ đề mới</span>
            <span className="sm:hidden">Tạo mới</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            Đang tải...
          </div>
        ) : topics.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Chưa có chủ đề nào
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Bắt đầu bằng cách tạo chủ đề phỏng vấn đầu tiên
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tạo chủ đề mới
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-6">
            {topics.map((topic) => {
              const topicQuestionSets = questionSets.filter(qs => qs.id); // Show all for now
              const totalQuestions = topicQuestionSets.reduce((sum, set) => sum + (set.totalQuestions || 0), 0);
              const isExpanded = expandedTopicId === topic.id;

              return (
                <div
                  key={topic.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all duration-200 hover:border-accent/50"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        {topic.thumbnailUrl && (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            <Image
                              src={topic.thumbnailUrl}
                              alt={topic.name}
                              width={32}
                              height={32}
                              className="object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                            {topic.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {topicQuestionSets.length} bộ câu hỏi
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                          topic.active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {topic.active ? "Hoạt động" : "Ẩn"}
                      </span>
                    </div>

                    {topic.description && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {topic.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{totalQuestions}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => {
                            setSelectedTopicForSet({ id: topic.id, name: topic.name });
                            setIsCreateSetOpen(true);
                          }}
                          className="p-1.5 sm:p-2 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors"
                          title="Thêm bộ câu hỏi"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <Link
                          href={`/admin/interview-topics/${topic.id}/edit`}
                          className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          title="Quản lý chi tiết"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                          className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          title={isExpanded ? "Thu gọn" : "Xem nhanh"}
                        >
                          <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTopic(topic);
                            setIsEditOpen(true);
                          }}
                          className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          title="Chỉnh sửa nhanh"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(topic.id, topic.name)}
                          disabled={deletingId === topic.id}
                          className="p-1.5 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Xóa"
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
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Question Sets List */}
                  {isExpanded && topicQuestionSets.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <div className="p-3 sm:p-4 space-y-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Bộ câu hỏi ({topicQuestionSets.length})
                        </h4>
                        {topicQuestionSets.map((set) => (
                          <div
                            key={set.id}
                            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5 sm:p-3 border border-gray-200 dark:border-gray-700 hover:border-accent/50 transition-colors"
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm mb-2 break-words">
                                  {set.title}
                                </h5>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {getLevelBadge(set.level)}
                                  {getDifficultyBadge(set.difficulty)}
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {set.totalQuestions || 0} câu hỏi
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <Link
                                  href={`/admin/question-sets/${set.id}/edit`}
                                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-accent text-white rounded hover:bg-accent-600 transition-colors"
                                  title="Quản lý câu hỏi"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="hidden sm:inline">Quản lý câu hỏi</span>
                                  <span className="sm:hidden">Câu hỏi</span>
                                </Link>
                                <button
                                  onClick={() => handleDeleteQuestionSet(set.id, set.title)}
                                  disabled={deletingSetId === set.id}
                                  className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                                  title="Xóa bộ câu hỏi"
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
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateInterviewTopicModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
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

      <CreateQuestionSetModal
        isOpen={isCreateSetOpen}
        onClose={() => {
          setIsCreateSetOpen(false);
          setSelectedTopicForSet(null);
        }}
        onSuccess={() => {
          clearQuestionSetsCache();
          setIsCreateSetOpen(false);
          setSelectedTopicForSet(null);
        }}
        topicId={selectedTopicForSet?.id || ""}
        topicName={selectedTopicForSet?.name || ""}
      />
    </div>
  );
}
