"use client";

import { useState } from "react";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  isSubmitting?: boolean;
}

export default function CommentForm({
  onSubmit,
  placeholder = "Viết bình luận...",
  isSubmitting = false,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const maxLength = 250;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isSubmitting) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  const isNearLimit = content.length > maxLength * 0.8;
  const isAtLimit = content.length >= maxLength;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-4 border border-gray-200"
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        {/* Comment Input Area */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className={`w-full p-3 border rounded-lg resize-none focus:ring-1 focus:ring-accent focus:border-accent text-sm placeholder-gray-400 ${
                isAtLimit
                  ? "border-red-300 bg-red-50"
                  : isNearLimit
                    ? "border-yellow-300 bg-yellow-50"
                    : "border-gray-300 bg-gray-50"
              }`}
              rows={3}
              maxLength={maxLength}
              disabled={isSubmitting}
            />

            {/* Character Counter */}
            <div
              className={`absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded ${
                isAtLimit
                  ? "bg-red-100 text-red-600"
                  : isNearLimit
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {content.length}/{maxLength}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 mt-2">
            <button
              type="button"
              onClick={() => setContent("")}
              disabled={!content.trim() || isSubmitting}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={!content.trim() || isSubmitting || isAtLimit}
              className={`px-4 py-1.5 rounded text-sm transition-colors flex items-center space-x-1 ${
                !content.trim() || isSubmitting || isAtLimit
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-accent text-white hover:bg-accent-600"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="w-3 h-3 animate-spin"
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
                  <span>Đang gửi...</span>
                </>
              ) : (
                <span>Bình luận</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
