import type { Metadata } from "next";
import StudyProgressClient from "./StudyProgressClient";

export const metadata: Metadata = {
  title: "Nhật ký học tập - JavaBuilder",
  description: "Theo dõi lịch sử hoạt động học tập và các thành tích của bạn",
};

export default function StudyProgressPage() {
  return <StudyProgressClient />;
}
