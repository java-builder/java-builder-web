'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useState } from 'react';
import React from 'react';
import 'highlight.js/styles/github.css';

interface PublicMarkdownRendererProps {
    content: string;
    className?: string;
}

export default function PublicMarkdownRenderer({ content, className = '' }: PublicMarkdownRendererProps) {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const copyToClipboard = async (children: React.ReactNode, codeId: string) => {
        try {
            const extractText = (node: React.ReactNode): string => {
                if (typeof node === 'string') return node;
                if (typeof node === 'number') return String(node);
                if (Array.isArray(node)) {
                    return node.map(extractText).join('');
                }
                if (node && typeof node === 'object' && 'props' in node && node.props) {
                    return extractText((node as { props: { children: React.ReactNode } }).props.children);
                }
                return '';
            };

            const textContent = extractText(children);
            await navigator.clipboard.writeText(textContent);
            setCopiedCode(codeId);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className={`markdown-content ${className}`}
            style={{
                lineHeight: '1.7',
                color: '#374151'
            }}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                    h1({ children }) {
                        return (
                            <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-gray-200">
                                {children}
                            </h1>
                        );
                    },
                    h2({ children }) {
                        return (
                            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">
                                {children}
                            </h2>
                        );
                    },
                    h3({ children }) {
                        return (
                            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-2">
                                {children}
                            </h3>
                        );
                    },
                    h4({ children }) {
                        return (
                            <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
                                {children}
                            </h4>
                        );
                    },
                    h5({ children }) {
                        return (
                            <h5 className="text-base font-semibold text-gray-700 mt-3 mb-2">
                                {children}
                            </h5>
                        );
                    },
                    h6({ children }) {
                        return (
                            <h6 className="text-sm font-semibold text-gray-700 mt-3 mb-2">
                                {children}
                            </h6>
                        );
                    },
                    strong({ children }) {
                        return (
                            <strong className="font-bold text-gray-900">
                                {children}
                            </strong>
                        );
                    },
                    p({ children }) {
                        return (
                            <p className="mb-4 leading-relaxed text-gray-700">
                                {children}
                            </p>
                        );
                    },
                    ul({ children }) {
                        return (
                            <ul className="mb-4 pl-6 space-y-1">
                                {children}
                            </ul>
                        );
                    },
                    ol({ children }) {
                        return (
                            <ol className="mb-4 pl-6 space-y-1">
                                {children}
                            </ol>
                        );
                    },
                    li({ children }) {
                        return (
                            <li className="leading-relaxed text-gray-700">
                                {children}
                            </li>
                        );
                    },
                    hr() {
                        return (
                            <hr className="my-8 border-gray-300" />
                        );
                    },
                    blockquote({ children }) {
                        return (
                            <blockquote className="border-l-4 border-orange-500 bg-orange-50 pl-4 py-2 my-4 italic text-gray-700">
                                {children}
                            </blockquote>
                        );
                    },
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        const codeId = `code-${Math.random().toString(36).substring(2, 11)}`;

                        if (language) {
                            return (
                                <div className="relative group my-6 shadow-xl rounded-xl overflow-hidden border border-gray-300/30">
                                    {/* Header */}
                                    <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 px-4 py-3 border-b border-gray-600/50">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex space-x-1">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-400">{language}</span>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(children, codeId)}
                                            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-gray-700 rounded-lg hover:scale-105"
                                            title="Copy code"
                                        >
                                            {copiedCode === codeId ? (
                                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* Code Content */}
                                    <div className="relative">
                                        <pre className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6 overflow-x-auto text-sm leading-relaxed">
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <code className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono" {...props}>
                                {children}
                            </code>
                        );
                    },
                    pre({ children }) {
                        return <>{children}</>;
                    },
                    table({ children }) {
                        return (
                            <div className="overflow-x-auto my-4">
                                <table className="min-w-full border-collapse border border-gray-300">
                                    {children}
                                </table>
                            </div>
                        );
                    },
                    th({ children }) {
                        return (
                            <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold">
                                {children}
                            </th>
                        );
                    },
                    td({ children }) {
                        return (
                            <td className="border border-gray-300 px-4 py-2">
                                {children}
                            </td>
                        );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
