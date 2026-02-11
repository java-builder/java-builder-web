import { useQuery } from "@tanstack/react-query";
import { questionContributionService } from "@/services/question-contribution.service";

export const useMyContributions = (page: number = 1, size: number = 10, status?: string) => {
  return useQuery({
    queryKey: ["my-contributions", page, size, status],
    queryFn: async () => {
      const response = await questionContributionService.getMyContributions(page, size, status);
      return response.data;
    },
  });
};
