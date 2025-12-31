"use client";

import { useQuery } from "@tanstack/react-query";
import { courseApi } from "@/services/course.service";

export const useCourses = (page = 1, size = 10) => {
  return useQuery({
    queryKey: ["courses", page, size],
    queryFn: async () => {
      const res = await courseApi.getCourses(page, size);
      return res.result;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useFeaturedCourses = () => {
  return useCourses(1, 3);
};
