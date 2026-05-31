import { useState, useEffect, useCallback } from "react";
import { interviewQuestionService } from "@/services/interview-question.service";
import { InterviewQuestionResponse } from "@/types/interview-question";
import { useI18n } from "@/contexts/I18nContext";
import toast from "react-hot-toast";

// Cache list theo (key + locale)
const listCache = new Map<string, InterviewQuestionResponse[]>();

type FetchMode = "id" | "slug";

function useInterviewQuestionsBy(
  identifier: string | null | undefined,
  mode: FetchMode
) {
  const { locale } = useI18n();
  const [questions, setQuestions] = useState<InterviewQuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    if (!identifier) return;
    const key = `${mode}:${identifier}:${locale}`;
    if (listCache.has(key)) {
      setQuestions(listCache.get(key)!);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res =
        mode === "id"
          ? await interviewQuestionService.getInterviewQuestionsByQuestionSetId(identifier)
          : await interviewQuestionService.getInterviewQuestionsByQuestionSetSlug(identifier);
      const data = res.data?.questions || [];
      listCache.set(key, data);
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch interview questions:", error);
      toast.error("Không thể tải danh sách câu hỏi");
    } finally {
      setIsLoading(false);
    }
  }, [identifier, mode, locale]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const refetch = useCallback(async () => {
    if (!identifier) return;
    listCache.delete(`${mode}:${identifier}:${locale}`);
    await fetchQuestions();
  }, [identifier, mode, locale, fetchQuestions]);

  return { questions, isLoading, refetch };
}

/**
 * Lấy questions theo questionSetId (admin).
 */
export function useInterviewQuestionsByQuestionSetId(
  questionSetId: string | null | undefined
) {
  return useInterviewQuestionsBy(questionSetId, "id");
}

/**
 * Lấy questions theo questionSetSlug (user-facing).
 * Trả thêm questionSet display data nếu cần dùng kèm `useQuestionSet`.
 */
export function useInterviewQuestionsByQuestionSetSlug(
  questionSetSlug: string | null | undefined
) {
  return useInterviewQuestionsBy(questionSetSlug, "slug");
}

export function clearInterviewQuestionsCache(identifier?: string) {
  if (!identifier) {
    listCache.clear();
    return;
  }
  for (const key of listCache.keys()) {
    if (key.includes(`:${identifier}:`)) {
      listCache.delete(key);
    }
  }
}

// ─── Admin: lấy 1 question kèm full translations để edit ──────────────────
const adminCache = new Map<string, InterviewQuestionResponse>();
const adminInFlight = new Map<string, Promise<InterviewQuestionResponse>>();

export function useAdminInterviewQuestion(
  questionId: string | null | undefined,
  enabled: boolean = true
) {
  const hasCached = !!(questionId && adminCache.has(questionId));

  const [question, setQuestion] = useState<InterviewQuestionResponse | null>(
    hasCached ? adminCache.get(questionId!)! : null
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    enabled && !!questionId && !hasCached
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !questionId) return;

    if (adminCache.has(questionId)) {
      setQuestion(adminCache.get(questionId)!);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    let promise = adminInFlight.get(questionId);
    if (!promise) {
      promise = interviewQuestionService.getInterviewQuestionForAdmin(questionId).then((res) => {
        const data = res.data;
        if (data) adminCache.set(questionId, data);
        return data!;
      });
      adminInFlight.set(questionId, promise);
    }

    promise
      .then((data) => {
        if (cancelled) return;
        setQuestion(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
        adminInFlight.delete(questionId);
      });

    return () => {
      cancelled = true;
    };
  }, [questionId, enabled]);

  return { question, isLoading, error };
}

export function clearAdminInterviewQuestionCache(questionId?: string) {
  if (questionId) {
    adminCache.delete(questionId);
  } else {
    adminCache.clear();
  }
}
