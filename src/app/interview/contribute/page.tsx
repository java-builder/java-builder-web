"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import { questionContributionService } from "@/services/question-contribution.service";
import { useInterviewTopics } from "@/hooks/useInterviewTopics";
import MarkdownRenderer from "@/components/admin/blogs/MarkdownRenderer";

type DifficultyType = "EASY" | "MEDIUM" | "HARD";
type LevelType = "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";

function ContributeQuestionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questionSetId = searchParams.get("questionSetId");
  const questionSetTitle = searchParams.get("questionSetTitle");
  const topicId = searchParams.get("topicId");
  const topicName = searchParams.get("topicName");

  const { topics } = useInterviewTopics();
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

  // Auto-fill topic when coming from topic page
  useEffect(() => {
    if (topicId && topicId !== newSetForm.interviewTopicId) {
      setNewSetForm(prev => ({ ...prev, interviewTopicId: topicId }));
    }
  }, [topicId, newSetForm.interviewTopicId]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-accent mb-4 text-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Đề xuất câu hỏi mới
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Chia sẻ câu hỏi phỏng vấn bạn biết với cộng đồng
          </p>
          {topicName && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Chủ đề: {topicName}</span>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          {/* Type Selection */}
          {questionSetId && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Câu hỏi của bạn thuộc chủ đề nào?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-accent/50">
                  <input
                    type="radio"
                    name="contributeType"
                    checked={contributeType === "existing"}
                    onChange={() => setContributeType("existing")}
                    className="mt-0.5 w-4 h-4 text-accent"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {questionSetTitle}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Câu hỏi của bạn phù hợp với chủ đề này
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-accent/50">
                  <input
                    type="radio"
                    name="contributeType"
                    checked={contributeType === "new"}
                    onChange={() => setContributeType("new")}
                    className="mt-0.5 w-4 h-4 text-accent"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      Đề xuất chủ đề mới
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Câu hỏi của bạn không thuộc chủ đề nào đang có
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* New Set Form */}
          {contributeType === "new" && (
            <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg space-y-4">
              <div className="flex items-start gap-2 text-sm text-purple-900 dark:text-purple-200">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Chủ đề mới sẽ được admin xem xét trước khi xuất bản.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chủ đề <span className="text-red-500">*</span>
                </label>
                <select
                  value={newSetForm.interviewTopicId}
                  onChange={(e) =>
                    setNewSetForm({ ...newSetForm, interviewTopicId: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="">Chọn chủ đề</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên bộ câu hỏi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSetForm.title}
                  onChange={(e) => setNewSetForm({ ...newSetForm, title: e.target.value })}
                  placeholder="Ví dụ: Spring Security Basics"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cấp độ
                  </label>
                  <select
                    value={newSetForm.level}
                    onChange={(e) => setNewSetForm({ ...newSetForm, level: e.target.value as LevelType })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="INTERN">Intern</option>
                    <option value="FRESHER">Fresher</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="MIDDLE">Middle</option>
                    <option value="SENIOR">Senior</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Độ khó
                  </label>
                  <select
                    value={newSetForm.difficulty}
                    onChange={(e) =>
                      setNewSetForm({ ...newSetForm, difficulty: e.target.value as DifficultyType })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="EASY">Dễ</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="HARD">Khó</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topics (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={newSetForm.topics}
                  onChange={(e) => setNewSetForm({ ...newSetForm, topics: e.target.value })}
                  placeholder="Spring, Security, JWT, Authentication"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Danh sách câu hỏi ({questionsList.length})
            </label>

            {questionsList.map((q, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Câu hỏi #{index + 1}
                  </span>
                  {questionsList.length > 1 && (
                    <button
                      onClick={() => removeQuestion(index)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Xóa
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Câu hỏi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={q.question}
                    onChange={(e) => updateQuestion(index, "question", e.target.value)}
                    rows={2}
                    placeholder="Nhập câu hỏi..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Câu trả lời gợi ý (không bắt buộc)
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Nếu bạn đã gặp câu hỏi này trong phỏng vấn và biết cách trả lời tốt, hãy chia sẻ để giúp cộng đồng! Hỗ trợ Markdown.
                  </p>
                  <div className="border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden">
                    <div className="flex border-b border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700">
                      <button
                        type="button"
                        onClick={() => setPreviewTabs({ ...previewTabs, [`answer-${index}`]: "write" })}
                        className={`px-4 py-2 text-xs font-medium transition-colors ${
                          (previewTabs[`answer-${index}`] || "write") === "write"
                            ? "bg-white dark:bg-slate-800 text-accent border-b-2 border-accent"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                      >
                        Viết
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTabs({ ...previewTabs, [`answer-${index}`]: "preview" })}
                        className={`px-4 py-2 text-xs font-medium transition-colors ${
                          previewTabs[`answer-${index}`] === "preview"
                            ? "bg-white dark:bg-slate-800 text-accent border-b-2 border-accent"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                      >
                        Xem trước
                      </button>
                    </div>
                    {(previewTabs[`answer-${index}`] || "write") === "write" ? (
                      <textarea
                        value={q.answer}
                        onChange={(e) => updateQuestion(index, "answer", e.target.value)}
                        rows={12}
                        placeholder="Ví dụ: ArrayList sử dụng mảng động, truy cập nhanh O(1) nhưng chèn/xóa chậm O(n)..."
                        className="w-full px-3 py-2 text-sm border-0 focus:ring-0 bg-white dark:bg-slate-800 text-gray-900 dark:text-white resize-none"
                      />
                    ) : (
                      <div className="px-3 py-2 min-h-[300px] bg-white dark:bg-slate-800 overflow-y-auto max-h-[500px]">
                        {q.answer ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <MarkdownRenderer content={q.answer} />
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 dark:text-gray-500 italic">
                            Chưa có nội dung để xem trước
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mẹo trả lời tốt (không bắt buộc)
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Chia sẻ kinh nghiệm của bạn: Nên nhấn mạnh điểm gì? Tránh sai lầm nào? Interviewer thường hỏi thêm gì? Hỗ trợ Markdown.
                  </p>
                  <div className="border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden">
                    <div className="flex border-b border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700">
                      <button
                        type="button"
                        onClick={() => setPreviewTabs({ ...previewTabs, [`tips-${index}`]: "write" })}
                        className={`px-4 py-2 text-xs font-medium transition-colors ${
                          (previewTabs[`tips-${index}`] || "write") === "write"
                            ? "bg-white dark:bg-slate-800 text-accent border-b-2 border-accent"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                      >
                        Viết
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTabs({ ...previewTabs, [`tips-${index}`]: "preview" })}
                        className={`px-4 py-2 text-xs font-medium transition-colors ${
                          previewTabs[`tips-${index}`] === "preview"
                            ? "bg-white dark:bg-slate-800 text-accent border-b-2 border-accent"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                      >
                        Xem trước
                      </button>
                    </div>
                    {(previewTabs[`tips-${index}`] || "write") === "write" ? (
                      <textarea
                        value={q.tips}
                        onChange={(e) => updateQuestion(index, "tips", e.target.value)}
                        rows={5}
                        placeholder="Ví dụ:&#10;• Nên so sánh cả về performance và use case thực tế&#10;• Đưa ví dụ cụ thể khi nào dùng ArrayList, khi nào dùng LinkedList"
                        className="w-full px-3 py-2 text-sm border-0 focus:ring-0 bg-white dark:bg-slate-800 text-gray-900 dark:text-white resize-none"
                      />
                    ) : (
                      <div className="px-3 py-2 min-h-[125px] bg-white dark:bg-slate-800 overflow-y-auto max-h-[300px]">
                        {q.tips ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <MarkdownRenderer content={q.tips} />
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 dark:text-gray-500 italic">
                            Chưa có nội dung để xem trước
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Độ khó
                  </label>
                  <div className="flex gap-4">
                    {[
                      { value: "EASY", label: "Dễ" },
                      { value: "MEDIUM", label: "Trung bình" },
                      { value: "HARD", label: "Khó" },
                    ].map((diff) => (
                      <label
                        key={diff.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`difficulty-${index}`}
                          value={diff.value}
                          checked={q.difficulty === diff.value}
                          onChange={(e) => updateQuestion(index, "difficulty", e.target.value)}
                          className="w-4 h-4 text-accent border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-accent cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {diff.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addQuestion}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-accent hover:text-accent-600 font-medium border border-accent rounded-lg hover:bg-accent/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm câu hỏi
            </button>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium bg-accent hover:bg-accent-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi câu hỏi"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ContributeQuestionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <ContributeQuestionForm />
    </Suspense>
  );
}
