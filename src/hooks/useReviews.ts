import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/services/review.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function useReviews(courseId: string) {
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["reviews", courseId],
    queryFn: async () => {
      const result = await reviewApi.getByCourse(courseId, 1, 100);
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!courseId,
  });

  const reviews = data?.data || [];
  const totalReviews = data?.totalElements || 0;
  const hasReviewed = currentUser ? reviews.some(r => r.username === currentUser.username) : false;

  const createReviewMutation = useMutation({
    mutationFn: (params: { rating: number; content?: string }) => 
      reviewApi.create({ courseId, ...params }),
    onSuccess: (result) => {
      if (result.code === 200 && result.data) {
        queryClient.invalidateQueries({ queryKey: ["reviews", courseId] });
      }
    },
  });

  return {
    reviews,
    totalReviews,
    isLoading,
    error,
    hasReviewed,
    createReview: createReviewMutation.mutate,
    isSubmitting: createReviewMutation.isPending,
  };
}
