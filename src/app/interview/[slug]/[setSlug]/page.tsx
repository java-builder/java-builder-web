"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionWrapper from "@/components/MotionWrapper";
import { interviewQuestionService, InterviewQuestionResponse } from "@/services/interview-question.service";
import { questionSetService } from "@/services/question-set.service";
import { QuestionSetDetailResponse } from "@/types/question-set";
import toast from "react-hot-toast";
import MarkdownRenderer from "@/components/admin/blogs/MarkdownRenderer";

export default function InterviewSetPage() {
  const params = useParams();
  const router = useRouter();
  const setSlug = params.setSlug as string;

  const [questionSet, setQuestionSet] = useState<QuestionSetDetailResponse | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestionResponse | null>(null);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributeForm, setContributeForm] = useState({
    difficulty: "MEDIUM",
    question: "",
    answer: "",
    tips: "",
  });
  const [answerTab, setAnswerTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [setRes, questionsRes] = await Promise.all([
          questionSetService.getQuestionSetBySlug(setSlug),
          interviewQuestionService.getQuestionsBySlug(setSlug)
        ]);

        if (setRes.data) {
          setQuestionSet(setRes.data);
        }

        const fetchedQuestions = questionsRes.data?.questions || [];
        setQuestions(fetchedQuestions);

        if (fetchedQuestions.length > 0) {
          setSelectedQuestion(fetchedQuestions[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    if (setSlug) {
      fetchData();
    }
  }, [setSlug]);

  const handleQuestionClick = (question: InterviewQuestionResponse) => {
    setSelectedQuestion(question);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY": return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "MEDIUM": return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "HARD": return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      default: return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "EASY": return "Dễ";
      case "MEDIUM": return "Trung bình";
      case "HARD": return "Khó";
      default: return difficulty;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!questionSet) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Không tìm thấy bộ câu hỏi
          </h1>
          <button
            onClick={() => router.back()}
            className="text-accent hover:underline"
          >
            Quay lại
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-accent mb-6 text-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>

          <div className="bg-gradient-to-r from-accent to-accent-600 rounded-xl p-6 text-white mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-2">
                  {questionSet.level}
                </span>
                <h1 className="text-3xl font-bold mb-2">{questionSet.title}</h1>
                <p className="text-white/90">
                  {questions.length} câu hỏi phỏng vấn
                </p>
              </div>
              <button
                onClick={() => setShowContributeModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-accent hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Thêm câu hỏi</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden sticky top-4">
                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
                  <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Danh sách câu hỏi
                  </h2>
                </div>

                <div className="p-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {questions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                      Chưa có câu hỏi nào
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {questions.map((question, index) => (
                        <button
                          key={question.id}
                          onClick={() => handleQuestionClick(question)}
                          className={`w-full text-left p-3 rounded-md text-sm transition-colors ${
                            selectedQuestion?.id === question.id
                              ? "bg-accent/10 text-accent font-medium border-l-2 border-accent"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-gray-200"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            <span className="line-clamp-2 flex-1">{question.question}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {selectedQuestion ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                        {getDifficultyLabel(selectedQuestion.difficulty)}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed">
                      {selectedQuestion.question}
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-slate-800/50 border border-blue-200 dark:border-slate-600 rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 className="font-bold text-blue-900 dark:text-blue-300">
                            Câu trả lời mẫu
                          </h3>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-blue-900 dark:text-gray-200">
                          <MarkdownRenderer content={selectedQuestion.answer} />
                        </div>
                      </div>

                      {selectedQuestion.tips && (
                        <div className="bg-amber-50 dark:bg-slate-800/50 border border-amber-200 dark:border-slate-600 rounded-lg p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <h3 className="font-bold text-amber-900 dark:text-amber-300">
                              💡 Mẹo trả lời tốt
                            </h3>
                          </div>
                          <div className="text-[15px] text-amber-900 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                            {selectedQuestion.tips}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-16 text-center">
                  <div className="max-w-sm mx-auto">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Chưa có câu hỏi nào
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bộ câu hỏi này chưa có nội dung
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </MotionWrapper>
      </div>

      {/* Contribute Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => setShowContributeModal(false)}
            />

            <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl z-[9999]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Đề xuất câu hỏi mới
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Chia sẻ câu hỏi phỏng vấn bạn biết với cộng đồng
                  </p>
                </div>
                <button
                  onClick={() => setShowContributeModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="space-y-4">
                  {/* Topic Info */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-blue-900 dark:text-blue-100">
                        <span className="font-medium">Chủ đề:</span> {questionSet?.title}
                      </span>
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Độ khó <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      {[
                        { value: "EASY", label: "Dễ" },
                        { value: "MEDIUM", label: "Trung bình" },
                        { value: "HARD", label: "Khó" },
                      ].map((diff) => (
                        <label
                          key={diff.value}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="difficulty"
                            value={diff.value}
                            checked={contributeForm.difficulty === diff.value}
                            onChange={(e) => setContributeForm({ ...contributeForm, difficulty: e.target.value })}
                            className="w-4 h-4 text-accent border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-accent cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {diff.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Question */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Câu hỏi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={contributeForm.question}
                      onChange={(e) => setContributeForm({ ...contributeForm, question: e.target.value })}
                      rows={3}
                      placeholder="Ví dụ: Sự khác biệt giữa ArrayList và LinkedList là gì?"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Answer - Optional with Preview */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Câu trả lời gợi ý <span className="text-gray-400 text-xs font-normal">(không bắt buộc)</span>
                      </label>
                      <div className="flex gap-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => setAnswerTab("edit")}
                          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                            answerTab === "edit"
                              ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          Viết
                        </button>
                        <button
                          type="button"
                          onClick={() => setAnswerTab("preview")}
                          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                            answerTab === "preview"
                              ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          Xem trước
                        </button>
                      </div>
                    </div>
                    
                    {answerTab === "edit" ? (
                      <textarea
                        value={contributeForm.answer}
                        onChange={(e) => setContributeForm({ ...contributeForm, answer: e.target.value })}
                        rows={8}
                        placeholder="Nếu bạn biết câu trả lời, hãy chia sẻ để giúp người khác. Hỗ trợ Markdown: **bold**, `code`, ```java code block```"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 font-mono"
                      />
                    ) : (
                      <div className="min-h-[200px] px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900">
                        {contributeForm.answer.trim() ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <MarkdownRenderer content={contributeForm.answer} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-[184px] text-gray-400 dark:text-gray-500">
                            <div className="text-center">
                              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <p className="text-sm">Chưa có nội dung để xem trước</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tips - Optional */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mẹo trả lời <span className="text-gray-400 text-xs font-normal">(không bắt buộc)</span>
                    </label>
                    <textarea
                      value={contributeForm.tips}
                      onChange={(e) => setContributeForm({ ...contributeForm, tips: e.target.value })}
                      rows={3}
                      placeholder="Các mẹo giúp trả lời tốt hơn (mỗi mẹo một dòng)"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Note */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3">
                    <div className="flex gap-2 text-xs text-amber-800 dark:text-amber-200">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>Câu hỏi của bạn sẽ được admin xem xét và phê duyệt trước khi xuất bản.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => setShowContributeModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    if (!contributeForm.question.trim()) {
                      toast.error("Vui lòng nhập câu hỏi");
                      return;
                    }
                    toast.success("Cảm ơn bạn đã đóng góp!");
                    setShowContributeModal(false);
                    setContributeForm({ difficulty: "MEDIUM", question: "", answer: "", tips: "" });
                  }}
                  disabled={!contributeForm.question.trim()}
                  className="px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-600 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  Gửi câu hỏi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
