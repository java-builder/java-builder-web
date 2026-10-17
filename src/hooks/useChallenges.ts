import { useQuery } from "@tanstack/react-query";
import { challengeService } from "@/services/challenge.service";
import { ChallengeStatus } from "@/types/challenge";

export const useChallenges = (status?: ChallengeStatus, page = 1, size = 20) => {
  return useQuery({
    queryKey: ["challenges", status, page, size],
    queryFn: async () => {
      const res = await challengeService.getChallenges(status, page, size);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useChallengeById = (id: string) => {
  return useQuery({
    queryKey: ["challenge", id],
    queryFn: async () => {
      const res = await challengeService.getChallengeById(id);
      return res.data;
    },
    enabled: Boolean(id),
  });
};

export const useChallengeBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["challenge-slug", slug],
    queryFn: async () => {
      const res = await challengeService.getChallengeBySlug(slug);
      return res.data;
    },
    enabled: Boolean(slug),
  });
};

export const useChallengePhases = (challengeId: string) => {
  return useQuery({
    queryKey: ["challenge-phases", challengeId],
    queryFn: async () => {
      const res = await challengeService.getPhasesByChallengeId(challengeId);
      return res.data;
    },
    enabled: Boolean(challengeId),
  });
};

export const useChallengeDays = (challengeId: string) => {
  return useQuery({
    queryKey: ["challenge-days", challengeId],
    queryFn: async () => {
      const res = await challengeService.getDaysByChallengeId(challengeId);
      return res.data;
    },
    enabled: Boolean(challengeId),
  });
};

export const useChallengeDayDetail = (slug: string, dayNumber: number) => {
  return useQuery({
    queryKey: ["challenge-day-detail", slug, dayNumber],
    queryFn: async () => {
      const res = await challengeService.getDayDetail(slug, dayNumber);
      return res.data;
    },
    enabled: Boolean(slug) && dayNumber > 0,
  });
};
