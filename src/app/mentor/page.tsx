import type { Metadata } from "next";
import { Suspense } from "react";
import MentorClient from "./MentorClient";

export const metadata: Metadata = {
  title: "Đào tạo Mentor Spring Boot 1-1 - JavaBuilder",
  description: "Chương trình huấn luyện 1-1 Spring Boot Backend toàn diện, từ phát triển ứng dụng chuyên nghiệp đến DevOps và Cloud AWS.",
};

export default function MentorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent dark:border-accent-on-dark border-t-transparent"></div>
      </div>
    }>
      <MentorClient />
    </Suspense>
  );
}
