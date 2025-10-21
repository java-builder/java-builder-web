'use client';

import { useState } from 'react';

interface CommentFormProps {
    onSubmit: (content: string) => void;
    placeholder?: string;
    isSubmitting?: boolean;
}

export default function CommentForm({ onSubmit, placeholder = "Viết bình luận...", isSubmitting = false }: CommentFormProps) {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim() && !isSubmitting) {
            onSubmit(content.trim());
            setContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    👤
                </div>
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={placeholder}
                        className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        rows={3}
                        maxLength={500}
                        disabled={isSubmitting}
                    />
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                            {content.length}/500 ký tự
                        </span>
                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Đang gửi...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
