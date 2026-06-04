"use client";

import { useState } from "react";
import { X, Send, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmapTitle: string;
  currentProgress: number;
  weaknesses: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export function AICoachModal({
  isOpen,
  onClose,
  roadmapTitle,
  currentProgress,
  weaknesses,
}: AICoachModalProps) {
  const [message, setMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: `Chào bạn! Tôi là **AI Coach**, sẵn sàng hỗ trợ lộ trình **${roadmapTitle}**.\n\n📊 Tiến độ hiện tại: **${currentProgress}%**\n\n**Tôi có thể giúp bạn:**\n• Giải đáp thắc mắc về Java\n• Gợi ý cách học hiệu quả\n• Phân tích điểm yếu cá nhân\n• Động viên và hướng dẫn\n\nHãy hỏi tôi bất cứ điều gì! 🚀`,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage, roadmapTitle, weaknesses);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "Tôi nên học gì tiếp theo?",
    "Làm sao để cải thiện điểm yếu?",
    "Có bài tập nào phù hợp không?",
  ];

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-full bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-slate-700 transition-all duration-300 ${
        isMinimized ? "w-16" : "w-full sm:w-[450px]"
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
          {!isMinimized && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 p-1.5 sm:p-2 border-2 border-gray-200 dark:border-slate-600 relative">
                  <Image src="/logos/java-logo.png" alt="AI Coach" fill className="object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">AI Coach</h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Trợ lý học tập của bạn
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
                  title="Thu nhỏ"
                >
                  <ChevronRight className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
                  title="Đóng"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                </button>
              </div>
            </>
          )}
          {isMinimized && (
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full h-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              title="Mở rộng"
            >
              <ChevronLeft className="w-6 h-6 text-gray-500 dark:text-slate-400" />
            </button>
          )}
        </div>

        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user" 
                        ? "bg-accent text-white" 
                        : "bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 p-1"
                    }`}>
                      {msg.role === "user" ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      ) : (
                        <div className="relative w-full h-full">
                          <Image src="/logos/java-logo.png" alt="AI Coach" fill className="object-contain" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className={`rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-accent text-white"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white"
                      }`}>
                        <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                      <span className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                        {msg.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 p-1 flex items-center justify-center flex-shrink-0">
                      <div className="relative w-full h-full">
                        <Image src="/logos/java-logo.png" alt="AI" fill className="object-contain" />
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Đang suy nghĩ...</p>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-3 border-t border-gray-200 dark:border-slate-700 pt-3 flex-shrink-0">
                <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-2">
                  Gợi ý câu hỏi:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMessage(q)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-xs text-gray-700 dark:text-slate-300 rounded-lg border border-gray-200 dark:border-slate-600 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 flex-shrink-0">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Nhập câu hỏi của bạn..."
                    disabled={isTyping}
                    rows={1}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent resize-none disabled:opacity-50 text-sm"
                    style={{ height: '40px', overflow: 'hidden' }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || isTyping}
                  style={{ height: '40px' }}
                  className="px-4 bg-accent text-white rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 flex-shrink-0"
                >
                  {isTyping ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function generateAIResponse(userMessage: string, roadmapTitle: string, weaknesses: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("học") && (lower.includes("tiếp") || lower.includes("gì"))) {
    return `Dựa trên lộ trình **${roadmapTitle}**, tôi gợi ý:\n\n**🎯 Bước tiếp theo:**\n• Hoàn thành chủ đề đang dở dang\n• Tập trung vào: ${weaknesses || "Các kiến thức cơ bản"}\n• Làm bài tập thực hành ngay\n\n**💡 Mẹo học hiệu quả:**\n✅ Học đều đặn mỗi ngày\n✅ Kết hợp lý thuyết + code thực tế\n✅ Viết note và ôn lại thường xuyên\n\nBạn cần hướng dẫn cụ thể hơn không?`;
  }

  if (lower.includes("điểm yếu") || lower.includes("cải thiện")) {
    return `**Điểm yếu hiện tại của bạn:**\n${weaknesses || "Chưa xác định rõ"}\n\n**📋 Kế hoạch cải thiện:**\n\n**1. Xác định vấn đề**\n   • Thiếu kiến thức lý thuyết?\n   • Chưa thực hành đủ?\n   • Không hiểu sâu?\n\n**2. Học lại từ đầu**\n   • Xem lại lý thuyết cơ bản\n   • Làm bài tập từ dễ → khó\n   • Tìm hiểu các ví dụ thực tế\n\n**3. Luyện tập đều đặn**\n   • 30-45 phút mỗi ngày\n   • 3-5 bài tập mỗi tuần\n   • Review code của người khác\n\nBạn muốn gợi ý bài tập cụ thể không?`;
  }

  if (lower.includes("bài tập")) {
    return `**📝 Gợi ý bài tập phù hợp:**\n\n**Dễ (Beginner):**\n• Viết lại code mẫu\n• Sửa lỗi trong code có sẵn\n• Bài tập nhỏ về cú pháp\n\n**Trung bình (Intermediate):**\n• Mini project (Todo App, Calculator)\n• CRUD cơ bản với Database\n• REST API đơn giản\n\n**Khó (Advanced):**\n• Thiết kế hệ thống phức tạp\n• Microservices project\n• Tối ưu performance\n\n**🔗 Nguồn học tập:**\n• LeetCode (thuật toán)\n• HackerRank (Java challenges)\n• GitHub (open source projects)\n\nBạn muốn chi tiết bài tập nào?`;
  }

  return `Cảm ơn câu hỏi của bạn! 😊\n\nTôi đã ghi nhận: "${userMessage}"\n\n**🤖 Tôi có thể hỗ trợ:**\n• Tư vấn lộ trình học tiếp theo\n• Phân tích và khắc phục điểm yếu\n• Gợi ý bài tập phù hợp\n• Giải đáp thắc mắc về Java\n• Động viên và hướng dẫn học tập\n\nBạn muốn hỏi theo hướng nào nhé! 🚀`;
}
