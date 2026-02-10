import { useState, useEffect, useRef } from "react";
import { questionContributionService, QuestionContributionDetailResponse } from "@/services/question-contribution.service";
import toast from "react-hot-toast";

export function useQuestionContributions(page: number = 1, size: number = 10) {
  const [contributions, setContributions] = useState<QuestionContributionDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) {
      hasFetched.current = false;
    }

    const fetchContributions = async () => {
      try {
        setIsLoading(true);
        const response = await questionContributionService.getContributions(page, size);
        setContributions(response.data.data.data || []);
        setTotalPages(response.data.data.totalPages || 1);
        setTotalElements(response.data.data.totalElements || 0);
      } catch {
        toast.error("Không thể tải danh sách đóng góp");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributions();
  }, [page, size]);

  const refetch = () => {
    hasFetched.current = false;
  };

  return { contributions, isLoading, totalPages, totalElements, refetch };
}
