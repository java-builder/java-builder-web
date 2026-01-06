"use client";

import { useQuery } from "@tanstack/react-query";
import { courseApi } from "@/services/course.service";
import { CourseLevel } from "@/types/course";

export const useCourses = (
  page = 1, 
  size = 10, 
  title?: string, 
  level?: CourseLevel
) => {
  return useQuery({
    queryKey: ["courses", page, size, title, level],
    queryFn: async () => {
      const res = await courseApi.getCourses(page, size, title, level);
      return res.result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - match BE cache
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useFeaturedCourses = () => {
  return useCourses(1, 3);
};
