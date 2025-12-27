"use client";

import { useState } from "react";
import { chatbotApi } from "@/services/chatbot.service";
import toast from "react-hot-toast";

interface BlogAISummaryProps {
  blogTitle: string;
  blogContent: string;
}

export default function BlogAISummary({
  blogTitle,
  blogContent,
}: BlogAISummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const generateSummary = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setIsExpanded(true);

      const prompt = `Hãy tóm tắt bài viết sau một cách ngắn gọn, súc tích (khoảng 400 từ). Chỉ nêu những điểm chính và quan trọng nhất:\n\nTiêu đề: ${blogTitle}\n\nNội dung: ${blogContent}`;

      const response = await chatbotApi.askQuestion({
        message: prompt,
      });

      if (response?.result?.answer) {
        setSummary(response.result.answer);
      } else {
        throw new Error("Không nhận được phản hồi từ AI");
      }
    } catch (error) {
      console.error("Error generating AI summary:", error);
      toast.error("Không thể tạo tóm tắt AI. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div
        className="bg-accent px-4 py-3 cursor-pointer group hover:bg-accent-600 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-white/20 rounded-md">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-white">
              F-Learning AI
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <svg
              className={`w-4 h-4 text-white transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          {!summary && !isLoading && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-accent-50 rounded-md border border-accent-100">
                <svg
                  className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Tính năng này sử dụng trí tuệ nhân tạo để tự động phân tích và
                  tóm tắt các điểm chính của bài viết, giúp bạn tiết kiệm thời
                  gian và nắm bắt thông tin cốt lõi một cách hiệu quả. AI sẽ xử
                  lý toàn bộ nội dung để đưa ra bản tóm tắt chính xác nhất.
                </p>
              </div>
              <button
                onClick={generateSummary}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span>Tạo tóm tắt</span>
                  </>
                )}
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex items-start gap-3 py-2">
              <div className="relative flex-shrink-0 mt-0.5">
                <div className="absolute inset-0 bg-accent-200 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  AI đang phân tích...
                </p>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {summary && (
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {summary}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-accent-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-xs text-gray-500">Được tạo bởi AI</span>
                </div>
                <button
                  onClick={generateSummary}
                  disabled={isLoading}
                  className="text-xs text-accent-600 hover:text-accent-700 font-medium flex items-center gap-1 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Tạo lại</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
