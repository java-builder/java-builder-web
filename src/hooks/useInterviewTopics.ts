import { useState, useEffect, useMemo } from "react";
import { interviewService } from "@/services/interview.service";
import { InterviewTopicDetailResponse } from "@/types/interview";

// Global cache để tránh gọi API nhiều lần
let cachedTopics: InterviewTopicDetailResponse[] | null = null;
let cachePromise: Promise<InterviewTopicDetailResponse[]> | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 30 * 1000; // 30 giây (dev), production nên để 5 phút

export function useInterviewTopics() {
  const [topics, setTopics] = useState<InterviewTopicDetailResponse[]>(cachedTopics || []);
  const [isLoading, setIsLoading] = useState(!cachedTopics);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      // Nếu có cache và chưa hết hạn, dùng cache
      if (cachedTopics && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
        setTopics(cachedTopics);
        setIsLoading(false);
        return;
      }

      // Nếu đang có request đang chạy, đợi request đó
      if (cachePromise) {
        try {
          const result = await cachePromise;
          setTopics(result);
          setIsLoading(false);
        } catch (err) {
          setError(err as Error);
          setIsLoading(false);
        }
        return;
      }

      // Tạo request mới
      setIsLoading(true);
      cachePromise = interviewService.getAllTopics()
        .then(response => {
          const topicsData = response.data?.topics || [];
          cachedTopics = topicsData;
          cacheTimestamp = Date.now();
          return topicsData;
        });

      try {
        const result = await cachePromise;
        setTopics(result);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch interview topics:", err);
        setError(err as Error);
        setTopics([]);
      } finally {
        setIsLoading(false);
        cachePromise = null;
      }
    };

    fetchTopics();
  }, []);

  // Tính tổng số câu hỏi từ tất cả các topic
  const totalQuestions = useMemo(() => {
    return topics.reduce((total, topic) => {
      return total + (topic.totalQuestions || 0);
    }, 0);
  }, [topics]);

  return { topics, isLoading, error, totalQuestions };
}

// Function để clear cache khi cần (ví dụ sau khi tạo/update/delete topic)
export function clearInterviewTopicsCache() {
  cachedTopics = null;
  cachePromise = null;
  cacheTimestamp = null;
}
