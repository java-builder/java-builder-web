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
import { Check, Copy, Info, Lightbulb, AlertTriangle, AlertCircle, AlertOctagon } from "lucide-react";

interface PublicMarkdownRendererProps {
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
    return getTextFromChildren(element.props.children);
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

export default function PublicMarkdownRenderer({
  content,
  className = "",
}: PublicMarkdownRendererProps) {
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
    h2(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      const text = getTextFromChildren(children);
      const id = slugify(text);
      return (
        <h2 id={id} className="group flex items-center gap-2 scroll-mt-20 cursor-pointer" {...rest}>
          <span>{children}</span>
          <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent dark:text-sky-400 hover:underline text-lg font-bold" aria-label="Link to this section">
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
        <h3 id={id} className="group flex items-center gap-2 scroll-mt-20 cursor-pointer" {...rest}>
          <span>{children}</span>
          <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent dark:text-sky-400 hover:underline text-base font-bold" aria-label="Link to this section">
            #
          </a>
        </h3>
      );
    },
    code(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || "");
      
      if (match) {
        const language = match[1];
        const codeString = String(children).replace(/\n$/, "");
        const codeId = `code-${hashString(codeString)}`;
        
        return (
          <div className="relative my-6 rounded-2xl border border-gray-300 dark:border-slate-800 overflow-hidden shadow-xs">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-slate-900 border-b border-gray-300 dark:border-slate-800">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 dark:bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80 dark:bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/80 dark:bg-green-500/60" />
              </div>
              <span className="text-[10px] font-bold tracking-wider text-gray-500 dark:text-slate-500 uppercase font-mono select-none">
                {language === "js" || language === "javascript" ? "JS" : language}
              </span>
              <button
                onClick={() => copyToClipboard(codeString, codeId)}
                className="flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-150 cursor-pointer"
                title="Copy code"
              >
                {copiedCode === codeId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            {/* Code highlighter */}
            <div className="text-sm overflow-x-auto relative bg-[#fafafa] dark:bg-[#1e1e1e]">
              <SyntaxHighlighter
                language={language}
                style={codeStyle}
                PreTag="div"
                showLineNumbers={false}
                wrapLines={true}
                wrapLongLines={true}
                customStyle={{
                  margin: 0,
                  padding: "1.25rem",
                  background: "transparent",
                  fontSize: "0.875rem",
                  fontFamily: 'JetBrains Mono, Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                }}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      }

      return (
        <code className="px-1.5 py-0.5 text-[0.875em] font-semibold font-mono bg-gray-100 dark:bg-slate-800 text-rose-600 dark:text-rose-450 border border-gray-200/50 dark:border-slate-700/50 rounded-md break-words" {...rest}>
          {children}
        </code>
      );
    },
    blockquote(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      const text = getTextFromChildren(children);
      
      // Parse GitHub style alerts: [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION]
      const match = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i.exec(text);
      if (match) {
        const type = match[1].toUpperCase();
        
        // Strip out the [!TYPE] prefix from children content
        const cleanChildren = React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const pProps = child.props as { children?: React.ReactNode };
            if (pProps && pProps.children) {
              if (typeof pProps.children === "string") {
                const cleanText = pProps.children.replace(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/i, "");
                return React.cloneElement(child, {}, cleanText);
              }
              if (Array.isArray(pProps.children)) {
                const newChildren = [...pProps.children];
                if (typeof newChildren[0] === "string") {
                  newChildren[0] = newChildren[0].replace(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/i, "");
                }
                return React.cloneElement(child, {}, newChildren);
              }
            }
          }
          return child;
        });

        // Config styles & icons
        const styles = {
          NOTE: {
            border: "border-l-4 border-blue-500",
            bg: "bg-blue-50/50 dark:bg-blue-950/10",
            text: "text-blue-900 dark:text-blue-200",
            iconColor: "text-blue-500 dark:text-blue-400",
            icon: <Info className="w-5 h-5 flex-shrink-0" />,
            title: "Lưu ý"
          },
          TIP: {
            border: "border-l-4 border-emerald-500",
            bg: "bg-emerald-50/50 dark:bg-emerald-950/10",
            text: "text-emerald-900 dark:text-emerald-200",
            iconColor: "text-emerald-500 dark:text-emerald-400",
            icon: <Lightbulb className="w-5 h-5 flex-shrink-0" />,
            title: "Mẹo nhỏ"
          },
          IMPORTANT: {
            border: "border-l-4 border-purple-500",
            bg: "bg-purple-50/50 dark:bg-purple-950/10",
            text: "text-purple-900 dark:text-purple-200",
            iconColor: "text-purple-500 dark:text-purple-400",
            icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
            title: "Quan trọng"
          },
          WARNING: {
            border: "border-l-4 border-amber-500",
            bg: "bg-amber-50/50 dark:bg-amber-950/10",
            text: "text-amber-900 dark:text-amber-200",
            iconColor: "text-amber-500 dark:text-amber-400",
            icon: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
            title: "Cảnh báo"
          },
          CAUTION: {
            border: "border-l-4 border-red-500",
            bg: "bg-red-50/50 dark:bg-red-950/10",
            text: "text-red-900 dark:text-red-200",
            iconColor: "text-red-500 dark:text-red-400",
            icon: <AlertOctagon className="w-5 h-5 flex-shrink-0" />,
            title: "Cẩn thận"
          }
        }[type as "NOTE" | "TIP" | "IMPORTANT" | "WARNING" | "CAUTION"] || {
          border: "border-l-4 border-blue-500",
          bg: "bg-blue-50/50 dark:bg-blue-950/10",
          text: "text-blue-900 dark:text-blue-200",
          iconColor: "text-blue-500",
          icon: <Info className="w-5 h-5 flex-shrink-0" />,
          title: "Lưu ý"
        };

        return (
          <div className={`my-6 flex gap-3 p-4 sm:p-5 rounded-r-2xl border-t border-r border-b border-gray-150/70 dark:border-slate-800/60 ${styles.border} ${styles.bg} ${styles.text} animate-in fade-in duration-200`}>
            <div className={`${styles.iconColor} mt-0.5`}>
              {styles.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-bold text-xs uppercase tracking-wider mb-1.5 opacity-90">{styles.title}</span>
              <div className="text-sm leading-relaxed prose-sm dark:prose-invert">
                {cleanChildren}
              </div>
            </div>
          </div>
        );
      }

      return (
        <blockquote className="border-l-4 border-gray-300 dark:border-slate-700 pl-4 italic my-6 text-gray-700 dark:text-slate-350" {...rest}>
          {children}
        </blockquote>
      );
    },
    table(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      return (
        <div className="my-6 w-full overflow-x-auto border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xs">
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
        <thead className="bg-gray-50/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-200 font-bold" {...rest}>
          {children}
        </thead>
      );
    },
    th(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      return (
        <th className="px-4 py-3 font-semibold" {...rest}>
          {children}
        </th>
      );
    },
    td(props) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { node: _node, children, ...rest } = props;
      return (
        <td className="px-4 py-3 border-b border-gray-100 dark:border-slate-800/40 last:border-0 text-gray-650 dark:text-slate-300" {...rest}>
          {children}
        </td>
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