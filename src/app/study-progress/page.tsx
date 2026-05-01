import type { Metadata } from "next";
import StudyProgressClient from "./StudyProgressClient";

export const metadata: Metadata = {
  title: "Tiến độ học tập - JavaBuilder",
  description: "Theo dõi tiến độ học tập, thời gian học và các khóa học đang theo học",
};

export default function StudyProgressPage() {
  return <StudyProgressClient />;
}
