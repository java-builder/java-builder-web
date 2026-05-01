import { useState, useEffect, memo } from "react";
import Image from "next/image";
import MarkdownMessage from "./MarkdownMessage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const TYPING_MESSAGES = [
  "Cảm ơn bạn đã đợi...",
  "Đang suy nghĩ...",
  "Đang xử lý câu hỏi...",
  "Sắp có câu trả lời...",
];

function ChatMessage({ message }: ChatMessageProps) {
  const [typingMessageIndex, setTypingMessageIndex] = useState(0);

  useEffect(() => {
    if (message.isTyping) {
      const interval = setInterval(() => {
        setTypingMessageIndex((prev) => (prev + 1) % TYPING_MESSAGES.length);
      }, 2000); // Change message every 2 seconds

      return () => clearInterval(interval);
    }
  }, [message.isTyping]);

  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%] md:max-w-[75%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.role === "user" 
            ? "bg-accent text-white" 
            : "bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 p-1"
        }`}>
          {message.role === "user" ? (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <div className="relative w-full h-full">
              <Image src="/logos/java-logo.png" alt="AI" fill className="object-contain" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className={`rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 ${
            message.role === "user"
              ? "bg-accent text-white"
              : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white"
          }`}>
            {message.isTyping ? (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600 dark:text-gray-300 animate-pulse">
                  {TYPING_MESSAGES[typingMessageIndex]}
                </p>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            ) : message.role === "user" ? (
              <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                {message.content}
              </p>
            ) : (
              <MarkdownMessage content={message.content} />
            )}
          </div>
          <span className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${message.role === "user" ? "text-right" : "text-left"}`}>
            {message.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(ChatMessage, (prevProps, nextProps) => {
  // Only re-render if message id or isTyping changes
  return prevProps.message.id === nextProps.message.id && 
         prevProps.message.isTyping === nextProps.message.isTyping;
});
