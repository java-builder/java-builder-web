"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { useState, useEffect } from "react";
import React from "react";
import { useTheme } from "next-themes";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const hashString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
};

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Dynamically load highlight.js theme based on current theme
    const loadTheme = async () => {
      // Remove existing highlight.js stylesheets
      const existingLinks = document.querySelectorAll('link[href*="highlight.js"]');
      existingLinks.forEach(link => link.remove());

      // Load appropriate theme
      const themeFile = resolvedTheme === 'dark' ? 'github-dark' : 'github';
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${themeFile}.min.css`;
      document.head.appendChild(link);
    };

    loadTheme();
  }, [resolvedTheme]);

  const copyToClipboard = async (children: React.ReactNode, codeId: string) => {
    try {
      // Extract text content from React children
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
    <div
      className={`prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none text-gray-700 dark:text-gray-200 ${className}`}
      style={{
        lineHeight: "1.7",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1({ children }) {
            return (
              <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-gray-200 dark:text-white dark:border-slate-700">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3 dark:text-white">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-2 dark:text-white">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2 dark:text-white">
                {children}
              </h4>
            );
          },
          strong({ children }) {
            return (
              <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>
            );
          },
          p({ children }) {
            return (
              <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>
            );
          },
          ul({ children }) {
            return <ul className="list-disc mb-4 pl-6 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal mb-4 pl-6 space-y-1">{children}</ol>;
          },
          li({ children }) {
            return (
              <li className="leading-relaxed text-gray-700 dark:text-gray-300">{children}</li>
            );
          },
          hr() {
            return <hr className="my-8 border-gray-300 dark:border-slate-700" />;
          },
          code({ className, children, node, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            
            const extractText = (n: React.ReactNode): string => {
              if (typeof n === "string") return n;
              if (typeof n === "number") return String(n);
              if (Array.isArray(n)) return n.map(extractText).join("");
              if (React.isValidElement(n)) {
                const element = n as { props: { children?: React.ReactNode } };
                return extractText(element.props.children);
              }
              return "";
            };
            const codeString = extractText(children);
            const codeId = `code-${hashString(codeString)}`;
            
            // Check if this is a code block (inside pre) or inline code
            const isCodeBlock = node?.position && 
              typeof children === 'string' && 
              (children.includes('\n') || language);

            if (language || isCodeBlock) {
            return (
              <div className="relative group my-6 shadow-xl rounded-xl overflow-hidden border border-gray-300/30 dark:border-gray-600/30">
                  {/* Header */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 dark:from-slate-700 dark:to-slate-800 text-gray-300 px-4 py-3 border-b border-gray-600/50 dark:border-slate-600/50">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                        <span className="text-sm font-semibold text-gray-400 dark:text-gray-300">
                        {language || "text"}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(children, codeId)}
                      className="opacity-70 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-gray-700 dark:hover:bg-slate-600 rounded-lg hover:scale-105"
                      title="Copy code"
                    >
                      {copiedCode === codeId ? (
                        <svg
                          className="w-4 h-4 text-green-400"
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
                          className="w-4 h-4 text-gray-400 hover:text-white"
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
                    <pre className="!bg-[#0d1117] dark:!bg-[#0d1117] !text-gray-100 p-6 overflow-x-auto text-sm leading-relaxed font-mono whitespace-pre m-0">
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
                className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono dark:bg-slate-700 dark:text-red-300"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            // Check if children is already processed code block
            if (React.isValidElement(children) && children.type === 'div') {
              return <>{children}</>;
            }
            // For unprocessed pre blocks (plain text code blocks)
            return (
              <pre className="!bg-[#0d1117] dark:!bg-[#0d1117] !text-gray-100 p-6 overflow-x-auto text-sm leading-relaxed font-mono whitespace-pre rounded-xl my-6 m-0">
                {children}
              </pre>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-accent bg-accent-50 pl-4 py-2 my-4 italic text-gray-700 dark:bg-slate-800 dark:text-gray-300 dark:border-accent">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-slate-700">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-gray-300 px-4 py-2 dark:border-slate-700 dark:text-gray-300">{children}</td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
