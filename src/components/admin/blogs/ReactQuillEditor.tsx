'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import ReactQuill dynamically để tránh SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => (
        <div className="border rounded-lg p-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
        </div>
    )
});

// Import Quill styles
import 'react-quill/dist/quill.snow.css';

interface ReactQuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    height?: number;
}

export default function ReactQuillEditor({
    value,
    onChange,
    placeholder = "Viết nội dung chi tiết của bài viết...",
    error,
    height = 400
}: ReactQuillEditorProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
        clipboard: {
            matchVisual: false,
        }
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video', 'code-block',
        'color', 'background', 'align', 'script'
    ];

    if (!mounted) {
        return (
            <div className={`border rounded-lg p-4 ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className={`rounded-lg overflow-hidden ${error ? 'border border-red-300' : 'border border-gray-300'}`}>
                <style jsx global>{`
          .ql-editor {
            min-height: ${height - 42}px;
            font-size: 14px;
            line-height: 1.6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          }
          
          .ql-toolbar {
            border-top: none;
            border-left: none;
            border-right: none;
            border-bottom: 1px solid #e5e7eb;
            background-color: #f9fafb;
          }
          
          .ql-container {
            border: none;
            font-size: 14px;
          }
          
          .ql-editor.ql-blank::before {
            color: #9ca3af;
            font-style: normal;
          }
          
          .ql-editor pre {
            background-color: #1f2937;
            color: #f9fafb;
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
          }
          
          .ql-editor code {
            background-color: #f3f4f6;
            color: #7c3aed;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.875rem;
          }
          
          .ql-editor blockquote {
            border-left: 4px solid #3b82f6;
            background-color: #eff6ff;
            padding: 12px 16px;
            margin: 16px 0;
            border-radius: 0 8px 8px 0;
          }
          
          .ql-editor h1, .ql-editor h2, .ql-editor h3, 
          .ql-editor h4, .ql-editor h5, .ql-editor h6 {
            color: #1f2937;
            font-weight: 600;
            margin-top: 24px;
            margin-bottom: 12px;
          }
          
          .ql-editor h1 { font-size: 2rem; }
          .ql-editor h2 { font-size: 1.5rem; }
          .ql-editor h3 { font-size: 1.25rem; }
          
          .ql-editor p {
            margin-bottom: 16px;
            color: #374151;
          }
          
          .ql-editor ul, .ql-editor ol {
            margin-bottom: 16px;
            padding-left: 24px;
          }
          
          .ql-editor li {
            margin-bottom: 4px;
          }
          
          .ql-snow .ql-tooltip {
            z-index: 1000;
          }
        `}</style>

                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                />
            </div>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            {/* Quick Guide */}
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                <div className="font-medium mb-2">💡 Hướng dẫn nhanh:</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div><kbd className="bg-white px-1 rounded">Ctrl+B</kbd> Bold</div>
                    <div><kbd className="bg-white px-1 rounded">Ctrl+I</kbd> Italic</div>
                    <div><kbd className="bg-white px-1 rounded">Ctrl+U</kbd> Underline</div>
                    <div><kbd className="bg-white px-1 rounded">Ctrl+Z</kbd> Undo</div>
                </div>
                <div className="mt-2 text-xs">
                    <strong>Features:</strong> Rich text formatting, code blocks, images, links, lists, và nhiều tính năng khác
                </div>
            </div>
        </div>
    );
}