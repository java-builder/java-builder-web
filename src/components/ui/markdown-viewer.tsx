"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import React, { useMemo, useState } from "react";
import type { Components } from "react-markdown";
import { slugify } from "@/utils/markdown";
import {
  Check,
  Copy,
  Info,
  Lightbulb,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
} from "lucide-react";
import MermaidBlock from "@/components/markdown/MermaidBlock";
import { cn } from "@/lib/utils";

export interface MarkdownViewerProps {
  content: string;
  className?: string;
}

const getTextFromChildren = (children: React.ReactNode): string => {
  if (!children) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join("");
  }
  if (React.isValidElement(children)) {
    const element = children as { props: { children?: React.ReactNode } };
    return getTextFromChildren(element.props?.children);
  }
  return "";
};

const hashString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
};

export function MarkdownViewer({
  content,
  className = "",
}: MarkdownViewerProps) {
  const { resolvedTheme } = useTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const codeStyle = useMemo(() => {
    return resolvedTheme === "dark" ? vscDarkPlus : oneLight;
  }, [resolvedTheme]);

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
    h1(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      const text = getTextFromChildren(children);
      const id = slugify(text);
      return (
        <h1
          id={id}
          className="group flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800 scroll-mt-20"
          {...rest}
        >
          <span>{children}</span>
          <a
            href={`#${id}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-mono text-base font-normal"
            aria-label="Link to section"
          >
            #
          </a>
        </h1>
      );
    },
    h2(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      const text = getTextFromChildren(children);
      const id = slugify(text);
      return (
        <h2
          id={id}
          className="group flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100 mt-5 mb-2.5 scroll-mt-20"
          {...rest}
        >
          <span>{children}</span>
          <a
            href={`#${id}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-mono text-sm font-normal"
            aria-label="Link to section"
          >
            #
          </a>
        </h2>
      );
    },
    h3(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      const text = getTextFromChildren(children);
      const id = slugify(text);
      return (
        <h3
          id={id}
          className="group flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100 mt-4 mb-2 scroll-mt-20"
          {...rest}
        >
          <span>{children}</span>
          <a
            href={`#${id}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-mono text-sm font-normal"
            aria-label="Link to section"
          >
            #
          </a>
        </h3>
      );
    },
    code(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, className: codeClassName, children, ...rest } = props;
      const match = /language-(\w+)/.exec(codeClassName || "");

      if (match) {
        const rawLanguage = match[1];
        const codeString = String(children).replace(/\n$/, "");

        if (rawLanguage.toLowerCase() === "mermaid") {
          return <MermaidBlock chart={codeString} />;
        }

        const languageMap: Record<string, string> = {
          springboot: "java",
          js: "javascript",
          ts: "typescript",
        };
        const highlightLanguage =
          languageMap[rawLanguage.toLowerCase()] || rawLanguage.toLowerCase();
        const codeId = `code-${hashString(codeString)}`;
        const displayLanguage =
          rawLanguage === "js" || rawLanguage === "javascript"
            ? "JAVASCRIPT"
            : rawLanguage === "ts" || rawLanguage === "typescript"
              ? "TYPESCRIPT"
              : rawLanguage.toUpperCase();

        return (
          <div className="relative my-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            {/* Header bar - monochrome Vercel aesthetic, no traffic dots */}
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-mono font-medium tracking-wider text-slate-600 dark:text-slate-400 uppercase select-none">
                {displayLanguage}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  copyToClipboard(codeString, codeId);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-full px-2.5 py-0.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none"
                title="Copy code"
              >
                {copiedCode === codeId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-slate-900 dark:text-slate-100" />
                    <span className="text-slate-900 dark:text-slate-100">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
            {/* Code highlighter */}
            <div className="text-sm overflow-x-auto bg-slate-50 dark:bg-[#0d1117]">
              <SyntaxHighlighter
                language={highlightLanguage}
                style={codeStyle}
                PreTag="div"
                showLineNumbers={false}
                wrapLines={true}
                wrapLongLines={true}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  background: "transparent",
                  fontSize: "0.875rem",
                  fontFamily:
                    'JetBrains Mono, Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                }}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      }

      return (
        <code
          className="px-1.5 py-0.5 text-[0.875em] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-md text-slate-900 dark:text-slate-100 break-words"
          {...rest}
        >
          {children}
        </code>
      );
    },
    pre(props) {
      const { children } = props;
      return <>{children}</>;
    },
    blockquote(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      const text = getTextFromChildren(children);

      // Parse GitHub style alerts: [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION]
      const match = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i.exec(text);
      if (match) {
        const alertType = match[1].toUpperCase();

        const cleanChildren = React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const pProps = child.props as { children?: React.ReactNode };
            if (pProps && pProps.children) {
              if (typeof pProps.children === "string") {
                const cleanText = pProps.children.replace(
                  /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/i,
                  ""
                );
                return React.cloneElement(child, {}, cleanText);
              }
              if (Array.isArray(pProps.children)) {
                const newChildren = [...pProps.children];
                if (typeof newChildren[0] === "string") {
                  newChildren[0] = newChildren[0].replace(
                    /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/i,
                    ""
                  );
                }
                return React.cloneElement(child, {}, newChildren);
              }
            }
          }
          return child;
        });

        const alertStyles = {
          NOTE: {
            border: "border-l-2 border-slate-900 dark:border-slate-100",
            bg: "bg-slate-50 dark:bg-slate-900/40",
            text: "text-slate-800 dark:text-slate-200",
            iconColor: "text-slate-900 dark:text-slate-100",
            icon: <Info className="w-4 h-4 shrink-0" />,
            title: "Lưu ý",
          },
          TIP: {
            border: "border-l-2 border-emerald-600 dark:border-emerald-400",
            bg: "bg-slate-50 dark:bg-slate-900/40",
            text: "text-slate-800 dark:text-slate-200",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            icon: <Lightbulb className="w-4 h-4 shrink-0" />,
            title: "Mẹo nhỏ",
          },
          IMPORTANT: {
            border: "border-l-2 border-slate-900 dark:border-slate-100",
            bg: "bg-slate-50 dark:bg-slate-900/40",
            text: "text-slate-800 dark:text-slate-200",
            iconColor: "text-slate-900 dark:text-slate-100",
            icon: <AlertCircle className="w-4 h-4 shrink-0" />,
            title: "Quan trọng",
          },
          WARNING: {
            border: "border-l-2 border-amber-600 dark:border-amber-400",
            bg: "bg-slate-50 dark:bg-slate-900/40",
            text: "text-slate-800 dark:text-slate-200",
            iconColor: "text-amber-600 dark:text-amber-400",
            icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
            title: "Cảnh báo",
          },
          CAUTION: {
            border: "border-l-2 border-red-600 dark:border-red-400",
            bg: "bg-slate-50 dark:bg-slate-900/40",
            text: "text-slate-800 dark:text-slate-200",
            iconColor: "text-red-600 dark:text-red-400",
            icon: <AlertOctagon className="w-4 h-4 shrink-0" />,
            title: "Cẩn thận",
          },
        }[alertType as "NOTE" | "TIP" | "IMPORTANT" | "WARNING" | "CAUTION"] || {
          border: "border-l-2 border-slate-900 dark:border-slate-100",
          bg: "bg-slate-50 dark:bg-slate-900/40",
          text: "text-slate-800 dark:text-slate-200",
          iconColor: "text-slate-900 dark:text-slate-100",
          icon: <Info className="w-4 h-4 shrink-0" />,
          title: "Lưu ý",
        };

        return (
          <div
            className={cn(
              "my-4 flex gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800",
              alertStyles.border,
              alertStyles.bg,
              alertStyles.text
            )}
          >
            <div className={cn(alertStyles.iconColor, "mt-0.5")}>
              {alertStyles.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-semibold text-xs uppercase tracking-wider mb-1 opacity-90">
                {alertStyles.title}
              </span>
              <div className="text-sm leading-relaxed prose-sm dark:prose-invert">
                {cleanChildren}
              </div>
            </div>
          </div>
        );
      }

      return (
        <blockquote
          className="border-l-2 border-slate-300 dark:border-slate-700 pl-4 italic my-4 text-slate-600 dark:text-slate-400"
          {...rest}
        >
          {children}
        </blockquote>
      );
    },
    p(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, className: pClassName = "", ...rest } = props;
      return (
        <p className={cn("mb-3 leading-relaxed text-inherit", pClassName)} {...rest}>
          {children}
        </p>
      );
    },
    ul(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      return (
        <ul className="list-disc pl-6 my-3 space-y-1 text-inherit" {...rest}>
          {children}
        </ul>
      );
    },
    ol(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      return (
        <ol className="list-decimal pl-6 my-3 space-y-1 text-inherit" {...rest}>
          {children}
        </ol>
      );
    },
    li(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      return (
        <li className="leading-relaxed mb-0.5 text-inherit" {...rest}>
          {children}
        </li>
      );
    },
    table(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      return (
        <div className="my-4 w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <table className="w-full border-collapse text-sm text-left" {...rest}>
            {children}
          </table>
        </div>
      );
    },
    thead(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      return (
        <thead
          className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
          {...rest}
        >
          {children}
        </thead>
      );
    },
    th(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      return (
        <th className="px-4 py-2.5 font-semibold text-xs uppercase tracking-wider" {...rest}>
          {children}
        </th>
      );
    },
    td(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      return (
        <td
          className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0 text-slate-700 dark:text-slate-300 text-sm"
          {...rest}
        >
          {children}
        </td>
      );
    },
  };

  const hasSizeClass = /\bprose-(sm|base|lg|xl|2xl)\b/.test(className);
  const defaultSize = hasSizeClass ? "" : "prose-base";

  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200",
        defaultSize,
        className
      )}
    >
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

export const MarkdownRenderer = MarkdownViewer;
export default MarkdownViewer;
