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
      <ul className="list-disc pl-6 mb-2 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
        {children}
      </ul>
    );
  },
  ol({ children }) {
    return (
      <ol className="list-decimal pl-6 mb-2 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
        {children}
      </ol>
    );
  },
  li({ children }) {
    return (
      <li className="leading-relaxed">
        {children}
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

  useEffect(() => {
    if (!isOpen || !questionResult) return;

    const isSameQuestion =
      cachedQuestionId === questionResult.questionId && data !== null;

    if (isSameQuestion) {
      setStatus("success");
      setError(null);
      return;
    }

    setData(null);
    setError(null);
    fetchExplanation();
  }, [isOpen, questionResult, cachedQuestionId, data, fetchExplanation]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

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
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
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
            className="relative my-4 w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800 sm:my-8"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 sm:h-12 sm:w-12">
                    <Sparkles className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2
                        id="explain-modal-title"
                        className="text-base font-bold text-gray-900 dark:text-white sm:text-lg"
                      >
                        AI Coach — Giải thích câu hỏi
                      </h2>
                      {status === "success" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Hoàn tất
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                      Phân tích chi tiết đáp án đúng, sai và mẹo ghi nhớ kiến thức
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Đóng"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Question summary bar */}
              {questionResult && (
                <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-3 sm:px-6 dark:border-slate-700/50 dark:bg-slate-900/30">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Câu hỏi
                  </p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-200">
                    {questionResult.content}
                  </p>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              {status === "loading" && <LoadingState />}

              {status === "error" && (
                <ErrorState message={error} onRetry={fetchExplanation} />
              )}

              {status === "success" && data && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <SectionCard
                    icon={<BookOpen className="h-4 w-4" />}
                    iconBg="bg-accent/10"
                    iconColor="text-accent"
                    title="Giải thích"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {data.explanation}
                    </ReactMarkdown>
                  </SectionCard>

                  <SectionCard
                    icon={<XCircle className="h-4 w-4" />}
                    iconBg="bg-rose-100 dark:bg-rose-900/30"
                    iconColor="text-rose-600 dark:text-rose-400"
                    title="Vì sao đáp án bạn chọn chưa đúng"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {data.whyWrong}
                    </ReactMarkdown>
                  </SectionCard>

                  <SectionCard
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    iconBg="bg-emerald-100 dark:bg-emerald-900/30"
                    iconColor="text-emerald-600 dark:text-emerald-400"
                    title="Vì sao đáp án này mới đúng"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {data.whyCorrect}
                    </ReactMarkdown>
                  </SectionCard>

                  <div className="rounded-xl bg-gradient-to-br from-amber-50/60 via-amber-50/30 to-transparent p-4 dark:from-amber-900/15 dark:via-amber-900/5 sm:p-5">
                    <div className="mb-3 flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                        <Lightbulb className="h-4 w-4" />
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        Mẹo ghi nhớ
                      </h4>
                    </div>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {data.tip}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {status === "success" && (
              <div className="sticky bottom-0 border-t border-gray-200 bg-white px-5 py-3 sm:px-6 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-end">
                  <button
                    onClick={onClose}
                    className="ml-auto w-full sm:w-auto rounded-lg border border-gray-200 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

/* ─── Shared Section Card ─────────────────────────────────────────────────── */

function SectionCard({
  icon,
  iconBg,
  iconColor,
  title,
  children,
}: {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 sm:p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
        >
          {icon}
        </span>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
          {title}
        </h4>
      </div>
      {children}
    </div>
  );
}

/* ─── Loading & Error ─────────────────────────────────────────────────────── */

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/20 opacity-75" />
        <span className="absolute inset-0 rounded-full bg-accent/10" />
        <Sparkles className="relative h-7 w-7 animate-pulse text-accent" />
      </div>
      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
        AI đang phân tích câu hỏi...
      </h4>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        Đang đối chiếu đáp án và xây dựng phần giải thích phù hợp.
      </p>
      <div className="mt-6 w-full max-w-xs">
        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
          <div className="h-full w-3/5 animate-pulse rounded-full bg-gradient-to-r from-accent to-accent-600" />
        </div>
        <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
          Thường mất vài giây...
        </p>
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
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
        <AlertTriangle className="h-7 w-7 text-rose-500 dark:text-rose-400" />
      </div>
      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
        Không thể lấy giải thích
      </h4>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {message || "Đã xảy ra lỗi. Vui lòng thử lại sau."}
      </p>
      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
      >
        <RotateCcw className="h-4 w-4" />
        Thử lại
      </button>
    </div>
  );
}
