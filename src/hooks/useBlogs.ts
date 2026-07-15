"use client";

import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blog.service";

export const useBlogs = (page = 1, size = 10) => {
  return useQuery({
    queryKey: ["blogs", page, size],
    queryFn: async () => {
      const res = await blogService.getBlogs({ page, size });
      return res.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useFeaturedBlogs = () => {
  return useQuery({
    queryKey: ["blogs", "featured"],
    queryFn: async () => {
      return await blogService.getFeaturedBlogs();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
