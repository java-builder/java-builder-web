import type { Metadata } from "next";
import { challengeService } from "@/services/challenge.service";
import ChallengeDetailClient from "./ChallengeDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const response = await challengeService.getChallengeBySlug(resolvedParams.slug);
    const challenge = response.data;

    if (challenge) {
      return {
        title: `${challenge.name} - JavaBuilder`,
        description:
          challenge.description ||
          `Thử thách lập trình ${challenge.name} tại JavaBuilder`,
      };
    }
  } catch (error) {
    console.error("Error fetching challenge metadata:", error);
  }

  return {
    title: "Thử thách - JavaBuilder",
    description: "Thử thách lập trình Java tại JavaBuilder",
  };
}

export default function ChallengeDetailPage() {
  return <ChallengeDetailClient />;
}
