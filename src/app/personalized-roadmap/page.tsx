import type { Metadata } from "next";
import PersonalizedRoadmapClient from "./PersonalizedRoadmapClient";

export const metadata: Metadata = {
  title: "Lộ trình cá nhân hóa - JavaBuilder",
  description:
    "Tạo lộ trình học tập cá nhân hóa với mục tiêu rõ ràng, điểm yếu hiện tại và bài tập theo từng giai đoạn.",
};

export default function PersonalizedRoadmapPage() {
  return <PersonalizedRoadmapClient />;
}
