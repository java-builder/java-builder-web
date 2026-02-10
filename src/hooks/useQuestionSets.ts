import { useState, useEffect, useRef } from "react";
import { questionSetService } from "@/services/question-set.service";
import { QuestionSetDetailResponse } from "@/types/question-set";
import toast from "react-hot-toast";

export function useQuestionSets(topicSlug: string | null) {
  const [questionSets, setQuestionSets] = useState<QuestionSetDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!topicSlug || hasFetched.current) return;

    const fetchQuestionSets = async () => {
      try {
        setIsLoading(true);
        hasFetched.current = true;
        const response = await questionSetService.getQuestionSetsByTopicSlug(topicSlug);
        setQuestionSets(response.data?.questionSets || []);
      } catch (error) {
        console.error("Failed to fetch question sets:", error);
        toast.error("Không thể tải danh sách câu hỏi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionSets();
  }, [topicSlug]);

  return { questionSets, isLoading };
}

export function clearQuestionSetsCache() {
  window.location.reload();
}
