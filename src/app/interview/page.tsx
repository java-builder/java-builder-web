import type { Metadata } from "next";
import InterviewClient from "./InterviewClient";

export const metadata: Metadata = {
  title: "Câu hỏi phỏng vấn - JavaBuilder",
  description: "Tổng hợp câu hỏi phỏng vấn Java và lập trình để chuẩn bị cho các buổi phỏng vấn",
};

export default function InterviewPage() {
  return <InterviewClient />;
}
