"use client";

import { useState, useEffect } from "react";
import { interviewService } from "@/services/interview.service";
import { InterviewTopicDetailResponse } from "@/types/interview";

export function useInterviewTopics() {
  const [topics, setTopics] = useState<InterviewTopicDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        const response = await interviewService.getAllTopics();
        setTopics(response.data?.topics || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch interview topics:", err);
        setError("Không thể tải danh sách chủ đề");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const totalQuestions = topics.reduce(
    (sum, topic) =>
      sum +
      (topic.questionSets?.reduce(
        (s, set) => s + (set.questions?.length || 0),
        0
      ) || 0),
    0
  );

  return {
    topics,
    isLoading,
    error,
    totalQuestions,
  };
}
