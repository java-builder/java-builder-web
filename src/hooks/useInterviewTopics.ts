import { useState, useEffect, useMemo } from "react";
import { interviewService } from "@/services/interview.service";
import { InterviewTopicDetailResponse } from "@/types/interview";
import { useI18n } from "@/contexts/I18nContext";

// Cache theo locale — đổi locale phải refetch vì data trả về theo ngôn ngữ
let cachedTopics: Record<string, InterviewTopicDetailResponse[]> = {};
let cachePromise: Record<string, Promise<InterviewTopicDetailResponse[]> | null> = {};
let cacheTimestamp: Record<string, number> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

export function useInterviewTopics() {
  const { locale } = useI18n();
  const [topics, setTopics] = useState<InterviewTopicDetailResponse[]>(
    cachedTopics[locale] || []
  );
  const [isLoading, setIsLoading] = useState(!cachedTopics[locale]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      const cached = cachedTopics[locale];
      const ts = cacheTimestamp[locale];

      if (cached && ts && Date.now() - ts < CACHE_DURATION) {
        setTopics(cached);
        setIsLoading(false);
        return;
      }

      if (cachePromise[locale]) {
        try {
          const result = await cachePromise[locale]!;
          setTopics(result);
          setIsLoading(false);
        } catch (err) {
          setError(err as Error);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      cachePromise[locale] = interviewService.getAllTopics().then((response) => {
        const topicsData = response.data || [];
        cachedTopics[locale] = topicsData;
        cacheTimestamp[locale] = Date.now();
        return topicsData;
      });

      try {
        const result = await cachePromise[locale]!;
        setTopics(result);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch interview topics:", err);
        setError(err as Error);
        setTopics([]);
      } finally {
        setIsLoading(false);
        cachePromise[locale] = null;
      }
    };

    fetchTopics();
  }, [locale]);

  const totalQuestions = useMemo(() => {
    return topics.reduce((total, topic) => {
      return total + (topic.totalQuestions || 0);
    }, 0);
  }, [topics]);

  return { topics, isLoading, error, totalQuestions };
}

export function clearInterviewTopicsCache() {
  cachedTopics = {};
  cachePromise = {};
  cacheTimestamp = {};
}

const adminTopicCache = new Map<string, InterviewTopicDetailResponse>();
const adminTopicInFlight = new Map<string, Promise<InterviewTopicDetailResponse>>();

interface UseAdminInterviewTopicResult {
  topic: InterviewTopicDetailResponse | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAdminInterviewTopic(
  topicId: string | null | undefined,
  enabled: boolean = true
): UseAdminInterviewTopicResult {
  const hasCached = !!(topicId && adminTopicCache.has(topicId));

  const [topic, setTopic] = useState<InterviewTopicDetailResponse | null>(
    hasCached ? adminTopicCache.get(topicId!)! : null
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    enabled && !!topicId && !hasCached
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !topicId) return;

    if (adminTopicCache.has(topicId)) {
      setTopic(adminTopicCache.get(topicId)!);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    let promise = adminTopicInFlight.get(topicId);
    if (!promise) {
      promise = interviewService.getTopicForAdmin(topicId).then((res) => {
        const data = res.data;
        if (data) adminTopicCache.set(topicId, data);
        return data!;
      });
      adminTopicInFlight.set(topicId, promise);
    }

    promise
      .then((data) => {
        if (cancelled) return;
        setTopic(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
        adminTopicInFlight.delete(topicId);
      });

    return () => {
      cancelled = true;
    };
  }, [topicId, enabled]);

  return { topic, isLoading, error };
}

export function clearAdminInterviewTopicCache(topicId?: string) {
  if (topicId) {
    adminTopicCache.delete(topicId);
  } else {
    adminTopicCache.clear();
  }
}
