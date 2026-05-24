import { useState, useEffect } from "react";
import { submissionApi } from "@/services/submission.service";
import { ExerciseSubmissionSummaryResponse, ExerciseSubmissionStatisticsResponse } from "@/types/submission";

export function useMyExercises(page: number = 1) {
  const [submissions, setSubmissions] = useState<ExerciseSubmissionSummaryResponse[]>([]);
  const [statistics, setStatistics] = useState<ExerciseSubmissionStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [submissionsResponse, statisticsResponse] = await Promise.all([
          submissionApi.getMyExercises(page),
          submissionApi.getMyStatistics()
        ]);
        
        if (submissionsResponse.code === 200 && submissionsResponse.data) {
          setSubmissions(submissionsResponse.data.data);
          setTotalPages(submissionsResponse.data.totalPages);
          setTotalElements(submissionsResponse.data.totalElements);
        }

        if (statisticsResponse.code === 200 && statisticsResponse.data) {
          setStatistics(statisticsResponse.data);
        }
      } catch (err) {
        console.error("Error fetching my exercises:", err);
        setError("Không thể tải danh sách bài tập. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return {
    submissions,
    statistics,
    loading,
    error,
    totalPages,
    totalElements,
  };
}
