'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface TinyMCEEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    height?: number;
}

export default function TinyMCEEditor({
    value,
    onChange,
    placeholder = "Viết nội dung chi tiết của bài viết...",
    error,
    height = 400
}: TinyMCEEditorProps) {
    const editorRef = useRef<Editor | null>(null);

    return (
        <div className="space-y-2">
            <div className={`rounded-lg overflow-hidden ${error ? 'border border-red-300' : ''}`}>
                <Editor
                    apiKey="no-api-key" // Sử dụng free version
                    onInit={(_, editor) => { editorRef.current = editor; }}
                    value={value}
                    onEditorChange={(content) => onChange(content)}
                    init={{
                        height: height,
                        menubar: false,
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'codesample'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | link image | codesample | help',
                        content_style: `
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                font-size: 14px;
                line-height: 1.6;
                color: #374151;
              }
              pre { 
                background-color: #1f2937; 
                color: #f9fafb; 
                padding: 12px; 
                border-radius: 8px; 
                overflow-x: auto;
              }
              code { 
                background-color: #f3f4f6; 
                color: #7c3aed; 
                padding: 2px 6px; 
                border-radius: 4px; 
                font-size: 0.875rem;
              }
              blockquote {
                border-left: 4px solid #3b82f6;
                background-color: #eff6ff;
                padding: 12px 16px;
                margin: 16px 0;
                border-radius: 0 8px 8px 0;
              }
              h1, h2, h3, h4, h5, h6 {
                color: #1f2937;
                font-weight: 600;
                margin-top: 24px;
                margin-bottom: 12px;
              }
              h1 { font-size: 2rem; }
              h2 { font-size: 1.5rem; }
              h3 { font-size: 1.25rem; }
              p { margin-bottom: 16px; }
              ul, ol { margin-bottom: 16px; padding-left: 24px; }
              li { margin-bottom: 4px; }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 16px 0; 
              }
              th, td { 
                border: 1px solid #e5e7eb; 
                padding: 8px 12px; 
                text-align: left; 
              }
              th { 
                background-color: #f9fafb; 
                font-weight: 600; 
              }
            `,
                        placeholder: placeholder,
                        branding: false,
                        promotion: false,
                        resize: false,
                        statusbar: false,
                        codesample_languages: [
                            { text: 'HTML/XML', value: 'markup' },
                            { text: 'JavaScript', value: 'javascript' },
                            { text: 'TypeScript', value: 'typescript' },
                            { text: 'CSS', value: 'css' },
                            { text: 'PHP', value: 'php' },
                            { text: 'Ruby', value: 'ruby' },
                            { text: 'Python', value: 'python' },
                            { text: 'Java', value: 'java' },
                            { text: 'C', value: 'c' },
                            { text: 'C#', value: 'csharp' },
                            { text: 'C++', value: 'cpp' },
                            { text: 'SQL', value: 'sql' },
                            { text: 'JSON', value: 'json' },
                            { text: 'Bash', value: 'bash' }
                        ],
                        setup: (editor: { on: (event: string, callback: () => void) => void; getContainer: () => HTMLElement | null }) => {
                            editor.on('init', () => {
                                const container = editor.getContainer();
                                if (container) {
                                    container.style.border = error ? '1px solid #ef4444' : '1px solid #d1d5db';
                                    container.style.borderRadius = '8px';
                                    container.style.overflow = 'hidden';
                                }
                            });
                        }
                    }}
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
                    <div><kbd className="bg-white px-1 rounded">Ctrl+K</kbd> Link</div>
                    <div><kbd className="bg-white px-1 rounded">Ctrl+Z</kbd> Undo</div>
                </div>
                <div className="mt-2 text-xs">
                    <strong>Code:</strong> Sử dụng nút <code>&lt;/&gt;</code> trên toolbar để chèn code block với syntax highlighting
                </div>
            </div>
        </div>
    );
}