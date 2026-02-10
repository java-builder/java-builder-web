import { useState, useEffect, useRef } from "react";
import { interviewQuestionService, InterviewQuestionResponse } from "@/services/interview-question.service";
import { questionSetService } from "@/services/question-set.service";
import { QuestionSetDetailResponse } from "@/types/question-set";
import toast from "react-hot-toast";

export function useInterviewQuestions(setSlug: string | null) {
  const [questionSet, setQuestionSet] = useState<QuestionSetDetailResponse | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!setSlug || hasFetched.current) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        hasFetched.current = true;

        const [setRes, questionsRes] = await Promise.all([
          questionSetService.getQuestionSetBySlug(setSlug),
          interviewQuestionService.getQuestionsBySlug(setSlug)
        ]);

        if (setRes.data) {
          setQuestionSet(setRes.data);
        }

        setQuestions(questionsRes.data?.questions || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setSlug]);

  return { questionSet, questions, isLoading };
}
