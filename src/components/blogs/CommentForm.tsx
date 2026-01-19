"use client";

import { useState, useRef, useEffect } from "react";
import { authApi } from "@/services/auth.service";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  isSubmitting?: boolean;
  autoFocus?: boolean;
}

export default function CommentForm({
  onSubmit,
  placeholder = "Chia sẻ suy nghĩ của bạn...",
  isSubmitting = false,
  autoFocus = false,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 500;
  const isLoggedIn = authApi.isAuthenticated();

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isSubmitting && isLoggedIn) {
      onSubmit(content.trim());
      setContent("");
      setIsFocused(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const isNearLimit = content.length > maxLength * 0.8;
  const isAtLimit = content.length >= maxLength;
  const showActions = isFocused || content.length > 0;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`bg-white dark:bg-slate-800 rounded-xl border-2 transition-all duration-200 ${
        isFocused ? "border-accent shadow-lg shadow-accent/10" : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
      }`}>
        {/* Input Area */}
        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => !content && setIsFocused(false)}
            placeholder={isLoggedIn ? placeholder : "Đăng nhập để bình luận..."}
            className="w-full resize-none focus:outline-none text-gray-800 dark:text-gray-200 bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base leading-relaxed min-h-[60px]"
            style={{ height: "60px" }}
            maxLength={maxLength}
            disabled={isSubmitting || !isLoggedIn}
          />
        </div>

        {/* Footer */}
        {showActions && (
          <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-100 dark:border-slate-700 pt-3">
            {/* Character Counter */}
            <div className="flex items-center gap-3">
              <div className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                isAtLimit
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : isNearLimit
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
              }`}>
                {content.length}/{maxLength}
              </div>
              
              {/* Progress bar */}
              <div className="hidden sm:block w-20 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-200 rounded-full ${
                    isAtLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-accent"
                  }`}
                  style={{ width: `${Math.min((content.length / maxLength) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {content.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setContent("");
                    if (textareaRef.current) {
                      textareaRef.current.style.height = "60px";
                    }
                  }}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Hủy
                </button>
              )}

              <button
                type="submit"
                disabled={!content.trim() || isSubmitting || isAtLimit || !isLoggedIn}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !content.trim() || isSubmitting || isAtLimit || !isLoggedIn
                    ? "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-accent text-white hover:bg-accent-600 shadow-sm hover:shadow-md"
                }`}
              >
                {isSubmitting ? "Đang gửi" : "Gửi bình luận"}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
