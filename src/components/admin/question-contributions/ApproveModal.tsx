import { useState } from "react";
import { QuestionContributionDetailResponse } from "@/types/interview";
import MarkdownRenderer from "@/components/admin/blogs/MarkdownRenderer";

interface ApproveModalProps {
  contribution: QuestionContributionDetailResponse;
  onClose: () => void;
  onApprove: (answer?: string, tips?: string) => void;
}

export default function ApproveModal({ contribution, onClose, onApprove }: ApproveModalProps) {
  const [answer, setAnswer] = useState(contribution.answer || "");
  const [tips, setTips] = useState(contribution.tips || "");
  const [answerTab, setAnswerTab] = useState<"write" | "preview">("write");
  const [tipsTab, setTipsTab] = useState<"write" | "preview">("write");

  const handleSubmit = () => {
    onApprove(answer.trim() || undefined, tips.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Duyệt câu hỏi đóng góp
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-900 dark:text-blue-200">
                  <p className="font-medium mb-1">Bạn có thể bổ sung hoặc chỉnh sửa câu trả lời và gợi ý trước khi duyệt</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Nếu để trống, hệ thống sẽ sử dụng nội dung do người dùng đóng góp</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">
                Câu hỏi
              </label>
              <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700">
                {contribution.question}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">
                Câu trả lời
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <div className="flex border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                  <button
                    type="button"
                    onClick={() => setAnswerTab("write")}
                    className={`px-4 py-2 text-xs font-medium transition-colors ${
                      answerTab === "write"
                        ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    Viết
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswerTab("preview")}
                    className={`px-4 py-2 text-xs font-medium transition-colors ${
                      answerTab === "preview"
                        ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    Xem trước
                  </button>
                </div>
                {answerTab === "write" ? (
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={12}
                    placeholder="Nhập câu trả lời (hỗ trợ Markdown)..."
                    className="w-full px-4 py-3 text-sm border-0 focus:ring-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white dark:bg-gray-800 min-h-[300px] max-h-[400px] overflow-y-auto">
                    {answer ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <MarkdownRenderer content={answer} />
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 dark:text-gray-300 italic">
                        Chưa có nội dung để xem trước
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">
                Gợi ý (không bắt buộc)
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <div className="flex border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                  <button
                    type="button"
                    onClick={() => setTipsTab("write")}
                    className={`px-4 py-2 text-xs font-medium transition-colors ${
                      tipsTab === "write"
                        ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    Viết
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipsTab("preview")}
                    className={`px-4 py-2 text-xs font-medium transition-colors ${
                      tipsTab === "preview"
                        ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    Xem trước
                  </button>
                </div>
                {tipsTab === "write" ? (
                  <textarea
                    value={tips}
                    onChange={(e) => setTips(e.target.value)}
                    rows={6}
                    placeholder="Nhập gợi ý (hỗ trợ Markdown)..."
                    className="w-full px-4 py-3 text-sm border-0 focus:ring-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white dark:bg-gray-800 min-h-[150px] max-h-[250px] overflow-y-auto">
                    {tips ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <MarkdownRenderer content={tips} />
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 dark:text-gray-300 italic">
                        Chưa có nội dung để xem trước
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Duyệt câu hỏi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
