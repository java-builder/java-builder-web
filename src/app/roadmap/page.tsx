import { Metadata } from "next";
import RoadmapClient from "@/components/roadmap/RoadmapClient";

export const metadata: Metadata = {
  title: "Lộ trình Backend Developer từ Intern đến Senior | JavaBuilder",
  description:
    "Bản đồ sự nghiệp & khung năng lực toàn diện cho Java Backend Developer: phân tách rõ ràng từng cấp độ Intern, Fresher, Junior, Middle, Senior kèm kỹ năng cốt lõi, dự án thực chiến và câu hỏi phỏng vấn.",
  keywords: [
    "roadmap java backend",
    "lộ trình backend developer",
    "lộ trình intern fresher junior middle senior",
    "java developer roadmap",
    "spring boot roadmap",
    "microservices roadmap",
    "khung năng lực lập trình viên java",
  ],
  openGraph: {
    title: "Lộ trình Backend Developer từ Intern đến Senior | JavaBuilder",
    description:
      "Bản đồ sự nghiệp & khung năng lực toàn diện cho Java Backend Developer: phân tách rõ ràng từng cấp độ Intern, Fresher, Junior, Middle, Senior kèm kỹ năng cốt lõi, dự án thực chiến và câu hỏi phỏng vấn.",
    type: "website",
  },
};

export default function RoadmapPage() {
  return <RoadmapClient />;
}
