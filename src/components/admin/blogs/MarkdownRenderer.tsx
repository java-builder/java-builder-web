'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import MDEditor.Markdown dynamically để tránh SSR issues
const MarkdownPreview = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
    { ssr: false }
);

interface MarkdownRendererProps {
    content: string;
    className?: string;
    maxLines?: number;
}

export default function MarkdownRenderer({
    content,
    className = '',
    maxLines = 3
}: MarkdownRendererProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    // Truncate content for preview
    const truncatedContent = content.length > 200
        ? content.substring(0, 200) + '...'
        : content;

    return (
        <div
            className={`prose prose-sm max-w-none ${className}`}
            style={{
                display: '-webkit-box',
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
            }}
        >
            <MarkdownPreview
                source={truncatedContent}
                style={{
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    lineHeight: '1.5'
                }}
            />
        </div>
    );
}