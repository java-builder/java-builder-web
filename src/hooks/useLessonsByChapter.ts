import { useQuery } from "@tanstack/react-query";
import { lessonApi } from "@/services/course.service";

export function useLessonsByChapter(chapterId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["lessons", "chapter", chapterId],
    queryFn: async () => {
      const res = await lessonApi.getByChapterId(chapterId);
      return res.data || [];
    },
    enabled: !!chapterId && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}
