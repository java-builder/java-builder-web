"use client";

import { useEffect, useState, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";
import { chatbotApi } from "@/services/chatbot.service";
import type {
  ExplainQuestionRequest,
  ExplainQuestionResponse,
} from "@/types/chatbot";
import type { QuestionResultResponse } from "@/types/exercise-submission";

interface ExplainQuestionModalProps {
  isOpen: boolean;
  questionResult: QuestionResultResponse | null;
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
};

const markdownComponents: Components = {
  code({ inline, className, children, ...props }: CodeProps) {
    const match = /language-(\w+)/.exec(className || "");
    const codeString = String(children).replace(/\n$/, "");
    if (!inline && match) {
      return (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="!my-2 rounded-lg text-xs"
        >
          {codeString}
        </SyntaxHighlighter>
      );
    }
    return (
      <code
        className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[12.5px] text-accent dark:bg-slate-700 dark:text-accent"
        {...props}
      >
        {children}
      </code>
    );
  },
  p({ children }) {
    return (
      <p className="mb-2 text-sm leading-relaxed text-gray-700 last:mb-0 dark:text-gray-300">
        {children}
      </p>
    );
  },
  ul({ children }) {
    return (
      <ul className="mb-2 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
        {children}
      </ul>
    );
  },
  ol({ children }) {
    return (
      <ol className="mb-2 list-inside list-decimal space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
        {children}
      </ol>
    );
  },
  li({ children }) {
    return (
      <li className="flex items-start gap-2 leading-relaxed">
        <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400 dark:bg-gray-500" />
        <span className="flex-1">{children}</span>
      </li>
    );
  },
  strong({ children }) {
    return (
      <strong className="font-semibold text-gray-900 dark:text-white">
        {children}
      </strong>
    );
  },
  em({ children }) {
    return <em className="italic text-gray-700 dark:text-gray-300">{children}</em>;
  },
  blockquote({ children }) {
    return (
      <blockquote className="my-2 rounded-r-md border-l-2 border-accent/60 bg-accent/5 px-3 py-1.5 italic text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    );
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline-offset-2 hover:underline"
      >
        {children}
      </a>
    );
  },
  h1({ children }) {
    return (
      <h4 className="mb-1.5 mt-3 text-sm font-semibold text-gray-900 first:mt-0 dark:text-white">
        {children}
      </h4>
    );
  },
  h2({ children }) {
    return (
      <h5 className="mb-1.5 mt-3 text-sm font-semibold text-gray-900 first:mt-0 dark:text-white">
        {children}
      </h5>
    );
  },
  h3({ children }) {
    return (
      <h6 className="mb-1.5 mt-3 text-sm font-semibold text-gray-900 first:mt-0 dark:text-white">
        {children}
      </h6>
    );
  },
};

export default function ExplainQuestionModal({
  isOpen,
  questionResult,
  onClose,
}: ExplainQuestionModalProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<ExplainQuestionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cachedQuestionId, setCachedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchExplanation = useCallback(async () => {
    if (!questionResult) return;

    const sortedOptions = [...questionResult.options].sort(
      (a, b) => a.orderIndex - b.orderIndex,
    );

    const letterById = new Map<string, string>();
    sortedOptions.forEach((opt, idx) => {
      letterById.set(opt.id, String.fromCharCode(65 + idx));
    });

    const options = sortedOptions.map(
      (opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt.content}`,
    );

    const userAnswers = sortedOptions
      .filter((o) => questionResult.userSelectedOptionIds?.includes(o.id))
      .map((o) => letterById.get(o.id) || "");

    const correctAnswers = sortedOptions
      .filter((o) => o.isCorrect)
      .map((o) => letterById.get(o.id) || "");

    const payload: ExplainQuestionRequest = {
      questionContent: questionResult.content,
      userAnswers,
      correctAnswers,
      options,
    };

    setStatus("loading");
    setError(null);
    try {
      const res = await chatbotApi.explainQuestion(payload);
      if (res.data) {
        setData(res.data);
        setCachedQuestionId(questionResult.questionId);
        setStatus("success");
      } else {
        throw new Error("Không nhận được dữ liệu phản hồi.");
      }
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Có lỗi xảy ra khi gọi AI giải thích. Vui lòng thử lại.";
      setError(message);
      setStatus("error");
    }
  }, [questionResult]);

  // Fetch only when modal opens for a question whose explanation isn't cached yet
  useEffect(() => {
    if (!isOpen || !questionResult) return;

    const isSameQuestion =
      cachedQuestionId === questionResult.questionId && data !== null;

    if (isSameQuestion) {
      // Already have explanation for this question — reuse it
      setStatus("success");
      setError(null);
      return;
    }

    // Different question or no cached data — fetch fresh
    setData(null);
    setError(null);
    fetchExplanation();
  }, [isOpen, questionResult, cachedQuestionId, data, fetchExplanation]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="explain-modal"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="explain-modal-title"
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-accent/5 via-transparent to-transparent px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 sm:h-10 sm:w-10">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      id="explain-modal-title"
                      className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base"
                    >
                      AI Coach giải thích câu hỏi
                    </h2>
                    {status === "success" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Đã phân tích
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Phân tích chi tiết đáp án đúng, sai và mẹo ghi nhớ kiến thức
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Đóng"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Question summary */}
            {questionResult && (
              <div className="border-b border-gray-200 bg-gray-50/60 px-4 py-3 sm:px-5 dark:border-slate-700 dark:bg-slate-900/30">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Câu hỏi
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-200">
                  {questionResult.content}
                </p>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
              {status === "loading" && <LoadingState />}

              {status === "error" && (
                <ErrorState message={error} onRetry={fetchExplanation} />
              )}

              {status === "success" && data && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 gap-3 sm:gap-4"
                >
                  <Section
                    icon={<BookOpen className="h-3.5 w-3.5" />}
                    title="Giải thích"
                    iconBg="bg-accent/10"
                    iconColor="text-accent"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {data.explanation}
                    </ReactMarkdown>
                  </Section>

                  <Section
                    icon={<XCircle className="h-3.5 w-3.5" />}
                    title="Vì sao đáp án bạn chọn chưa đúng"
                    iconBg="bg-rose-50 dark:bg-rose-900/20"
                    iconColor="text-rose-600 dark:text-rose-400"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {data.whyWrong}
                    </ReactMarkdown>
                  </Section>

                  <Section
                    icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                    title="Vì sao đáp án này mới đúng"
                    iconBg="bg-emerald-50 dark:bg-emerald-900/20"
                    iconColor="text-emerald-600 dark:text-emerald-400"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {data.whyCorrect}
                    </ReactMarkdown>
                  </Section>

                  <Section
                    icon={<Lightbulb className="h-3.5 w-3.5" />}
                    title="Mẹo ghi nhớ"
                    iconBg="bg-amber-50 dark:bg-amber-900/20"
                    iconColor="text-amber-600 dark:text-amber-400"
                    highlight
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {data.tip}
                    </ReactMarkdown>
                  </Section>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/60 px-4 py-3 sm:px-5 dark:border-slate-700 dark:bg-slate-900/30">
              <p className="hidden text-[11px] text-gray-500 sm:block dark:text-gray-400">
                Phản hồi do AI tạo, có thể không chính xác tuyệt đối.
              </p>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="rounded-lg bg-accent px-4 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
                >
                  Đóng
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

function Section({
  icon,
  title,
  iconBg,
  iconColor,
  highlight = false,
  children,
}: {
  icon: ReactNode;
  title: string;
  iconBg: string;
  iconColor: string;
  highlight?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-slate-700 ${
        highlight
          ? "bg-amber-50/30 dark:bg-amber-900/10"
          : "bg-white dark:bg-slate-800"
      } p-4`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md ${iconBg} ${iconColor}`}
        >
          {icon}
        </span>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h4>
      </div>
      <div>{children}</div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center sm:py-14">
      <div className="relative mb-4 flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/30 opacity-75" />
        <span className="absolute inset-0 rounded-full bg-accent/15" />
        <Sparkles className="relative h-6 w-6 animate-pulse text-accent" />
      </div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
        AI đang phân tích câu hỏi
      </h4>
      <p className="mt-1 max-w-md text-xs text-gray-500 dark:text-gray-400">
        Đang đối chiếu đáp án và xây dựng phần giải thích phù hợp...
      </p>
      <div className="mt-5 w-full max-w-xs space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-accent to-accent-600" />
        </div>
        <div className="flex justify-between text-[11px] text-gray-400 dark:text-gray-500">
          <span>Đang xử lý</span>
          <span>Vài giây</span>
        </div>
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
        <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
      </div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
        Không thể lấy giải thích
      </h4>
      <p className="mt-1 max-w-md text-xs text-gray-500 dark:text-gray-400">
        {message || "Đã xảy ra lỗi. Vui lòng thử lại sau."}
      </p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-accent hover:text-accent dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Thử lại
      </button>
    </div>
  );
}
