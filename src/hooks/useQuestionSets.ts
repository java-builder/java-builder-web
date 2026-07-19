import { useState, useEffect } from "react";
import { questionSetService } from "@/services/question-set.service";
import { QuestionSetDetailResponse } from "@/types/question-set";
import { useI18n } from "@/contexts/I18nContext";
import toast from "react-hot-toast";

// Cache theo (topicSlug + locale) — đổi locale phải refetch vì BE trả data theo ngôn ngữ
const cache = new Map<string, QuestionSetDetailResponse[]>();

export function useQuestionSets(topicSlug: string | null) {
  const { locale } = useI18n();
  const [questionSets, setQuestionSets] = useState<QuestionSetDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!topicSlug) return;

    const cacheKey = `${topicSlug}:${locale}`;
    if (cache.has(cacheKey)) {
      setQuestionSets(cache.get(cacheKey)!);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    questionSetService
      .getQuestionSetsByTopicSlug(topicSlug)
      .then((response) => {
        if (cancelled) return;
        const data = response.data || [];
        cache.set(cacheKey, data);
        setQuestionSets(data);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to fetch question sets:", error);
        toast.error("Không thể tải danh sách câu hỏi");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [topicSlug, locale]);

  return { questionSets, isLoading };
}

export function clearQuestionSetsCache() {
  cache.clear();
}

// ─── Admin: lấy 1 question set kèm full translations để edit ──────────────────
const adminCache = new Map<string, QuestionSetDetailResponse>();
const adminInFlight = new Map<string, Promise<QuestionSetDetailResponse>>();

export function useAdminQuestionSet(
  questionSetId: string | null | undefined,
  enabled: boolean = true
) {
  const hasCached = !!(questionSetId && adminCache.has(questionSetId));

  const [questionSet, setQuestionSet] = useState<QuestionSetDetailResponse | null>(
    hasCached ? adminCache.get(questionSetId!)! : null
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    enabled && !!questionSetId && !hasCached
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !questionSetId) return;

    if (adminCache.has(questionSetId)) {
      setQuestionSet(adminCache.get(questionSetId)!);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    let promise = adminInFlight.get(questionSetId);
    if (!promise) {
      promise = questionSetService.getQuestionSetForAdmin(questionSetId).then((res) => {
        const data = res.data;
        if (data) adminCache.set(questionSetId, data);
        return data!;
      });
      adminInFlight.set(questionSetId, promise);
    }

    promise
      .then((data) => {
        if (cancelled) return;
        setQuestionSet(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
        adminInFlight.delete(questionSetId);
      });

    return () => {
      cancelled = true;
    };
  }, [questionSetId, enabled]);

  return { questionSet, isLoading, error };
}

export function clearAdminQuestionSetCache(questionSetId?: string) {
  if (questionSetId) {
    adminCache.delete(questionSetId);
  } else {
    adminCache.clear();
  }
}
