"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { useState, useEffect } from "react";
import React from "react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

interface PublicMarkdownRendererProps {
  content: string;
  className?: string;
}

export default function PublicMarkdownRenderer({
  content,
  className = "",
}: PublicMarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { theme } = useTheme();

  // Dynamically load highlight.js theme based on current theme
  useEffect(() => {
    // Remove existing highlight.js stylesheets
    const existingLinks = document.querySelectorAll('link[data-highlight-theme]');
    existingLinks.forEach(link => link.remove());

    // Add new stylesheet based on theme
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.setAttribute('data-highlight-theme', 'true');
    link.href = theme === 'dark' 
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [theme]);

  const copyToClipboard = async (children: React.ReactNode, codeId: string) => {
    try {
      const extractText = (node: React.ReactNode): string => {
        if (typeof node === "string") return node;
        if (typeof node === "number") return String(node);
        if (Array.isArray(node)) {
          return node.map(extractText).join("");
        }
        if (node && typeof node === "object" && "props" in node && node.props) {
          return extractText(
            (node as { props: { children: React.ReactNode } }).props.children,
          );
        }
        return "";
      };

      const textContent = extractText(children);
      await navigator.clipboard.writeText(textContent);
      setCopiedCode(codeId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={`markdown-content max-w-full ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1({ children }) {
            return (
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-6 sm:mt-8 mb-3 sm:mb-4 pb-2 border-b-2 border-gray-200 dark:border-slate-700">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            const text = String(children);
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');
            return (
              <h2 id={id} className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-5 sm:mt-6 mb-2 sm:mb-3 scroll-mt-20">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            const text = String(children);
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');
            return (
              <h3 id={id} className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mt-4 sm:mt-5 mb-2 scroll-mt-20">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mt-3 sm:mt-4 mb-2">
                {children}
              </h4>
            );
          },
          h5({ children }) {
            return (
              <h5 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 mt-3 mb-2">
                {children}
              </h5>
            );
          },
          h6({ children }) {
            return (
              <h6 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mt-3 mb-2">
                {children}
              </h6>
            );
          },
          strong({ children }) {
            return (
              <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>
            );
          },
          p({ children }) {
            return (
              <p className="mb-3 sm:mb-4 leading-relaxed text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                {children}
              </p>
            );
          },
          ul({ children }) {
            return (
              <ul className="mb-3 sm:mb-4 pl-4 sm:pl-6 space-y-1 list-disc marker:text-gray-400 dark:marker:text-gray-500">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="mb-3 sm:mb-4 pl-4 sm:pl-6 space-y-1 list-decimal marker:text-gray-500 dark:marker:text-gray-400">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return (
              <li className="leading-relaxed text-gray-700 dark:text-gray-300">{children}</li>
            );
          },
          hr() {
            return <hr className="my-8 border-gray-300 dark:border-slate-600" />;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-accent dark:border-accent-400 bg-accent-50 dark:bg-accent-900/20 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300">
                {children}
              </blockquote>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 underline underline-offset-2"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const codeId = `code-${Math.random().toString(36).substring(2, 11)}`;

            if (language) {
              return (
                <div className="relative group my-4 sm:my-6 shadow-xl rounded-lg sm:rounded-xl overflow-hidden border border-gray-300/30 dark:border-slate-600/50">
                  {/* Header */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-600/50">
                    <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                      <div className="flex space-x-1 flex-shrink-0">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-400 truncate">
                        {language}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(children, codeId)}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 p-1.5 sm:p-2 hover:bg-gray-700 rounded-lg hover:scale-105 flex-shrink-0 ml-2"
                      title="Copy code"
                    >
                      {copiedCode === codeId ? (
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Code Content */}
                  <div className="relative">
                    <pre
                      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-3 sm:p-6 overflow-x-auto text-xs sm:text-sm leading-relaxed font-medium"
                      style={{
                        fontFamily:
                          'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                      }}
                    >
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                </div>
              );
            }

            return (
              <code
                className="bg-gray-100 dark:bg-slate-700 text-red-600 dark:text-red-400 px-2 py-1 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-slate-700">
                <table className="min-w-full border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-gray-50 dark:bg-slate-800">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return (
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                {children}
              </tbody>
            );
          },
          tr({ children }) {
            return (
              <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                {children}
              </tr>
            );
          },
          th({ children }) {
            return (
              <th className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white text-sm">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border-b border-gray-200 dark:border-slate-700 px-4 py-3 text-gray-700 dark:text-gray-300 text-sm">
                {children}
              </td>
            );
          },
          img({ src, alt }) {
            if (!src || typeof src !== 'string') return null;
            return (
              <span className="block my-4">
                <Image
                  src={src}
                  alt={alt || ""}
                  width={800}
                  height={450}
                  className="max-w-full h-auto rounded-lg shadow-md"
                  unoptimized
                />
              </span>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
