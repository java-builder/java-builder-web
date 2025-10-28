'use client';

import { useState } from 'react';

interface CommentFormProps {
    onSubmit: (content: string) => void;
    placeholder?: string;
    isSubmitting?: boolean;
}

export default function CommentForm({ onSubmit, placeholder = "Viết bình luận...", isSubmitting = false }: CommentFormProps) {
    const [content, setContent] = useState('');
    const maxLength = 250;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim() && !isSubmitting) {
            onSubmit(content.trim());
            setContent('');
        }
    };

    const isNearLimit = content.length > maxLength * 0.8;
    const isAtLimit = content.length >= maxLength;

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-start space-x-2">
                {/* Avatar */}
                <div className="w-6 h-6 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
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
                            className={`w-full p-2 border rounded resize-none focus:ring-1 focus:ring-orange-200 focus:border-orange-300 transition-all duration-200 text-sm ${isAtLimit
                                ? 'border-red-300 bg-red-50'
                                : isNearLimit
                                    ? 'border-yellow-300 bg-yellow-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            rows={2}
                            maxLength={maxLength}
                            disabled={isSubmitting}
                        />

                        {/* Character Counter */}
                        <div className={`absolute bottom-1 right-1 text-xs px-1 py-0.5 rounded ${isAtLimit
                            ? 'bg-red-100 text-red-600'
                            : isNearLimit
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                            {content.length}/{maxLength}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-1 mt-1">
                        <button
                            type="button"
                            onClick={() => setContent('')}
                            disabled={!content.trim() || isSubmitting}
                            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Xóa
                        </button>

                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting || isAtLimit}
                            className={`px-3 py-1 rounded text-xs transition-all duration-200 flex items-center space-x-1 ${!content.trim() || isSubmitting || isAtLimit
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-orange-500 text-white hover:bg-orange-600'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Gửi...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                                    </svg>
                                    <span>Bình luận</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
