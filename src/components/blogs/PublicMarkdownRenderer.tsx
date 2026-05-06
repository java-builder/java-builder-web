"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { 
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@/contexts/ThemeContext";
import { useMemo, useState } from "react";
import type { Components } from "react-markdown";

interface PublicMarkdownRendererProps {
  content: string;
  className?: string;
}

export default function PublicMarkdownRenderer({
  content,
  className = "",
}: PublicMarkdownRendererProps) {
  const { theme } = useTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const codeStyle = useMemo(() => {
    return theme === "dark" ? vscDarkPlus : vs;
  }, [theme]);

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const components: Components = {
    code(props) {
      const { className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || "");
      
      if (match) {
        const language = match[1];
        const codeString = String(children).replace(/\n$/, "");
        const codeId = `code-${Math.random().toString(36).substring(2, 11)}`;
        
        return (
          <div className="relative group">
            <button
              onClick={() => copyToClipboard(codeString, codeId)}
              className="absolute right-2 top-2 z-10 p-2 rounded-md bg-gray-700 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-200 transition-colors duration-200"
              title="Copy code"
            >
              {copiedCode === codeId ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            <SyntaxHighlighter
              language={language}
              style={codeStyle}
              PreTag="div"
              showLineNumbers={false}
              wrapLines={true}
              wrapLongLines={true}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}