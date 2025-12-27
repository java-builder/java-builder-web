"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { chatbotApi } from "@/services/chatbot.service";
import { SuggestedBlogInfo } from "@/types/chatbot";
import { BlogTypeDisplayNames, BlogType } from "@/types/blog";
import BlogTypeIcon from "@/components/admin/blogs/BlogTypeIcon";

interface Message {
  type: "user" | "ai";
  content: string;
  suggestedBlogs?: SuggestedBlogInfo[];
}

export default function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Close modal when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat is open and not loading
  useEffect(() => {
    if (isOpen && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, isOpen, messages.length]);

  // Focus input immediately after sending (when input becomes empty)
  useEffect(() => {
    if (isOpen && input === "" && !isLoading && messages.length > 0) {
      inputRef.current?.focus();
    }
  }, [input, isOpen, isLoading, messages.length]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    const newMessages = [
      ...messages,
      { type: "user" as const, content: userMessage },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await chatbotApi.suggestBlogs({ message: userMessage });

      if (response.code === 200 && response.result) {
        const aiMessage = response.result.answer;
        const blogs = response.result.suggestedBlogs || [];

        // Add AI message with suggested blogs
        setMessages([
          ...newMessages,
          {
            type: "ai" as const,
            content: aiMessage,
            suggestedBlogs: blogs,
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        {
          type: "ai" as const,
          content:
            "Xin lỗi, tôi gặp lỗi khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getBlogTypeDisplayName = (blogType: string): string => {
    const typeMap: Record<string, string> = BlogTypeDisplayNames;
    return typeMap[blogType] || blogType;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-16 h-16 sm:w-14 sm:h-14 bg-gradient-to-br from-accent to-accent-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-50 cursor-pointer ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
        aria-label="Mở chatbot AI"
      >
        <span className="inline-flex items-center justify-center w-full h-full">
          <svg
            className="block mx-auto w-7 h-7 sm:w-6 sm:h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 3C7 3 3 6.58 3 11c0 2.4 1.18 4.57 3.14 6.06L6 21l4.48-1.53C11.18 19.64 11.59 19.7 12 19.7c5 0 9-3.58 9-8.7S17 3 12 3z" />
          </svg>
        </span>
      </button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-[420px] h-[85vh] sm:h-[600px] max-h-[700px] sm:max-h-[600px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col z-50 border-0 overflow-hidden animate-slide-up-mobile sm:animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-br from-accent to-accent-600 text-white p-4 sm:p-5 flex items-center justify-between shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iNSIgY3k9IjUiIHI9IjMiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
            <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-white/30 flex-shrink-0">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-accent"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 3C7 3 3 6.58 3 11c0 2.4 1.18 4.57 3.14 6.06L6 21l4.48-1.53C11.18 19.64 11.59 19.7 12 19.7c5 0 9-3.58 9-8.7S17 3 12 3z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg drop-shadow-sm truncate">
                  AI Blog Assistant
                </h3>
                <p className="text-xs text-accent-50 font-medium truncate">
                  Tìm kiếm bài viết phù hợp
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-full hover:bg-white/30 active:bg-white/40 backdrop-blur-sm transition-all duration-200 flex items-center justify-center relative z-10 border border-white/20 hover:scale-110 active:scale-95 cursor-pointer flex-shrink-0 ml-2"
              aria-label="Đóng chatbot"
            >
              <svg
                className="w-5 h-5 sm:w-5 sm:h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.36 6.64a1 1 0 00-1.41 0L12 11.59 7.05 6.64A1 1 0 105.64 8.05L10.59 13l-4.95 4.95a1 1 0 101.41 1.41L12 14.41l4.95 4.95a1 1 0 001.41-1.41L13.41 13l4.95-4.95a1 1 0 000-1.41z" />
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white custom-scrollbar">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mb-5 shadow-lg border-4 border-white">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 3C7 3 3 6.58 3 11c0 2.4 1.18 4.57 3.14 6.06L6 21l4.48-1.53C11.18 19.64 11.59 19.7 12 19.7c5 0 9-3.58 9-8.7S17 3 12 3z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">
                  Tìm kiếm Blog Học Tập 🎓
                </h4>
                <p className="text-sm text-gray-600 mb-4 max-w-sm leading-relaxed">
                  Hỏi tôi về bất kỳ chủ đề nào bạn muốn học! Tôi sẽ gợi ý những
                  bài viết phù hợp nhất để bạn có thể tự học hiệu quả.
                </p>
                <div className="text-xs text-gray-500 mb-6 max-w-xs">
                  Ví dụ: &quot;Tôi muốn học về Spring Cloud&quot; hoặc
                  &quot;Blog về microservices&quot;
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setInput("Spring Boot")}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-full text-sm text-gray-700 hover:bg-accent-50 hover:border-accent-300 hover:shadow-md transition-all duration-200 font-medium cursor-pointer"
                  >
                    Spring Boot
                  </button>
                  <button
                    onClick={() => setInput("Microservices")}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-full text-sm text-gray-700 hover:bg-accent-50 hover:border-accent-300 hover:shadow-md transition-all duration-200 font-medium cursor-pointer"
                  >
                    Microservices
                  </button>
                  <button
                    onClick={() => setInput("Java programming")}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-full text-sm text-gray-700 hover:bg-accent-50 hover:border-accent-300 hover:shadow-md transition-all duration-200 font-medium cursor-pointer"
                  >
                    Java
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className="space-y-4 animate-fade-in">
                    <div
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                          msg.type === "user"
                            ? "bg-gradient-to-br from-accent to-accent-600 text-white shadow-accent-200"
                            : "bg-white border border-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      </div>
                    </div>

                    {/* Suggested blogs for AI messages */}
                    {msg.type === "ai" &&
                      msg.suggestedBlogs &&
                      msg.suggestedBlogs.length > 0 && (
                        <div className="space-y-3 animate-fade-in">
                          <div className="text-sm font-bold text-gray-700 px-2 flex items-center space-x-2">
                            <svg
                              className="w-4 h-4 text-accent"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path d="M19 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2zM7 7h10v2H7z" />
                            </svg>
                            <span>Bài viết được gợi ý</span>
                          </div>
                          {msg.suggestedBlogs.map((blog) => (
                            <Link
                              key={blog.id}
                              href={`/blogs/${blog.id}`}
                              className="block bg-white border-2 border-gray-100 rounded-xl p-4 hover:shadow-lg hover:border-accent-300 hover:scale-[1.02] transition-all group animate-fade-in cursor-pointer"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className="flex items-start space-x-3">
                                {blog.featuredImage && (
                                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 group-hover:border-accent-300 transition-colors">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={blog.featuredImage}
                                      alt={blog.title}
                                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <BlogTypeIcon
                                      blogType={blog.blogType as BlogType}
                                      className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-xs font-semibold text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 px-2.5 py-1 rounded-full border border-blue-200">
                                      {getBlogTypeDisplayName(blog.blogType)}
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-accent-600 transition-colors mb-2">
                                    {blog.title}
                                  </h4>
                                  {blog.summary && (
                                    <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                                      {blog.summary}
                                    </p>
                                  )}
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500 font-medium">
                                      👤 {blog.author}
                                    </span>
                                    <span className="text-accent-500 font-bold group-hover:text-accent-600">
                                      Đọc thêm →
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-md">
                      <div className="flex space-x-1">
                        <div
                          className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input area */}
          <div className="border-t-2 border-gray-100 p-3 sm:p-4 bg-gradient-to-br from-white to-gray-50 shadow-inner">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all shadow-sm bg-white"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-transparent p-0 text-accent hover:text-accent-600 flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Gửi tin nhắn"
                title="Gửi"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS animations */}
      <style jsx global>{`
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up-mobile {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-slide-up-mobile {
          animation: slide-up-mobile 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
}
