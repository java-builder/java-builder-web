import { useQuery } from "@tanstack/react-query";
import { courseApi } from "@/services/course.service";

export function useCourseDetail(courseId: string) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const res = await courseApi.getById(courseId);
      return res.data;
    },
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}
