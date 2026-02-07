import { useState, useEffect } from "react";
import { questionSetService } from "@/services/question-set.service";
import { QuestionSetDetailResponse } from "@/types/question-set";

// Global cache để tránh gọi API nhiều lần
let cachedQuestionSets: QuestionSetDetailResponse[] | null = null;
let cachePromise: Promise<QuestionSetDetailResponse[]> | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

export function useQuestionSets() {
  const [questionSets, setQuestionSets] = useState<QuestionSetDetailResponse[]>(cachedQuestionSets || []);
  const [isLoading, setIsLoading] = useState(!cachedQuestionSets);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchQuestionSets = async () => {
      // Nếu có cache và chưa hết hạn, dùng cache
      if (cachedQuestionSets && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
        setQuestionSets(cachedQuestionSets);
        setIsLoading(false);
        return;
      }

      // Nếu đang có request đang chạy, đợi request đó
      if (cachePromise) {
        try {
          const result = await cachePromise;
          setQuestionSets(result);
          setIsLoading(false);
        } catch (err) {
          setError(err as Error);
          setIsLoading(false);
        }
        return;
      }

      // Tạo request mới
      setIsLoading(true);
      cachePromise = questionSetService.getAllQuestionSets()
        .then(response => {
          const setsData = response.data?.questionSets || [];
          cachedQuestionSets = setsData;
          cacheTimestamp = Date.now();
          return setsData;
        });

      try {
        const result = await cachePromise;
        setQuestionSets(result);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch question sets:", err);
        setError(err as Error);
        setQuestionSets([]);
      } finally {
        setIsLoading(false);
        cachePromise = null;
      }
    };

    fetchQuestionSets();
  }, []);

  return { questionSets, isLoading, error };
}

// Function để clear cache khi cần (ví dụ sau khi tạo/update/delete question set)
export function clearQuestionSetsCache() {
  cachedQuestionSets = null;
  cachePromise = null;
  cacheTimestamp = null;
}
