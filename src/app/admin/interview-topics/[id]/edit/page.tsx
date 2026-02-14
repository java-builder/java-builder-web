"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { interviewService } from "@/services/interview.service";
import { InterviewTopicDetailResponse } from "@/types/interview";
import { QuestionSetDetailResponse } from "@/types/question-set";
import { useConfirm } from "@/hooks/useConfirm";
import CreateQuestionSetModal from "@/components/admin/interview/CreateQuestionSetModal";
import UpdateQuestionSetModal from "@/components/admin/interview/UpdateQuestionSetModal";
import toast from "react-hot-toast";

export default function EditInterviewTopicPage() {
  const params = useParams();
  const topicId = params.id as string;
  const hasFetched = useRef(false);

  const [topic, setTopic] = useState<InterviewTopicDetailResponse | null>(null);
  const [questionSets, setQuestionSets] = useState<QuestionSetDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingSetId, setDeletingSetId] = useState<string | null>(null);
  const { confirm } = useConfirm();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [key, setKey] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Modal state
  const [isCreateSetOpen, setIsCreateSetOpen] = useState(false);
  const [isUpdateSetOpen, setIsUpdateSetOpen] = useState(false);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<QuestionSetDetailResponse | null>(null);

  const fetchTopic = useCallback(async (force = false) => {
    if (!topicId) return;
    if (!force && hasFetched.current) return;

    try {
      setIsLoading(true);
      hasFetched.current = true;
      
      // Fetch topic by ID - we need to get by slug first
      const allTopicsRes = await interviewService.getAllTopics();
      const foundTopic = allTopicsRes.data?.topics.find(t => t.id === topicId);
      
      if (foundTopic) {
        setTopic(foundTopic);
        setName(foundTopic.name);
        setDescription(foundTopic.description || "");
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
  }, [topicId]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  const handleSaveTopic = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên chủ đề");
      return;
    }

    setIsSaving(true);
    try {
      await interviewService.updateTopic(topicId, {
        name: name.trim(),
        description: description.trim() || undefined,
        displayOrder,
        key: key || undefined,
      });
      toast.success("Cập nhật chủ đề thành công!");
      await fetchTopic(true);
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
          await fetchTopic(true); // Refresh question sets
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

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link href="/admin/interview-topics" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">Chỉnh sửa chủ đề</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{topic?.name}</p>
          </div>
        </div>
        <button
          onClick={handleSaveTopic}
          disabled={isSaving}
          className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-600 disabled:opacity-50 flex items-center gap-2 transition-colors flex-shrink-0"
        >
          {isSaving && (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          <span className="hidden sm:inline">Lưu thay đổi</span>
          <span className="sm:hidden">Lưu</span>
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left - Topic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Thông tin chủ đề</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên chủ đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white resize-none overflow-hidden"
                rows={1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {thumbnailUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon hiện tại
                </label>
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  Bộ câu hỏi ({questionSets.length})
                </h3>
                <button
                  onClick={() => setIsCreateSetOpen(true)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-accent text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-accent-600 flex items-center gap-1.5 sm:gap-2 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Thêm bộ câu hỏi</span>
                  <span className="sm:hidden">Thêm</span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {questionSets.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Chưa có bộ câu hỏi nào</p>
                  <p className="text-sm">Nhấn &quot;Thêm bộ câu hỏi&quot; để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {questionSets.map((set) => (
                    <div
                      key={set.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {set.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            {getLevelBadge(set.level)}
                            {getDifficultyBadge(set.difficulty)}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {set.totalQuestions || 0} câu hỏi
                            </span>
                          </div>
                          {set.topics && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {set.topics}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              setSelectedQuestionSet(set);
                              setIsUpdateSetOpen(true);
                            }}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <Link
                            href={`/admin/question-sets/${set.id}/edit`}
                            className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                            title="Quản lý"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDeleteQuestionSet(set.id, set.title)}
                            disabled={deletingSetId === set.id}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Xóa"
                          >
                            {deletingSetId === set.id ? (
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
          fetchTopic(true); 
          setIsCreateSetOpen(false);
        }}
        topicId={topicId}
        topicName={topic?.name || ""}
      />

      <UpdateQuestionSetModal
        isOpen={isUpdateSetOpen}
        onClose={() => {
          setIsUpdateSetOpen(false);
          setSelectedQuestionSet(null);
        }}
        onSuccess={() => {
          fetchTopic(true);
          setIsUpdateSetOpen(false);
          setSelectedQuestionSet(null);
        }}
        questionSet={selectedQuestionSet}
      />
    </div>
  );
}
