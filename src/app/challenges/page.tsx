import type { Metadata } from "next";
import { Suspense } from "react";
import ChallengesListClient from "./ChallengesListClient";

export const metadata: Metadata = {
  title: "Trung Tâm Thử Thách Lập Trình - JavaBuilder",
  description:
    "Hệ thống các thử thách học tập định hướng từng ngày (10, 14, 21, 30, 60 ngày) cho Java Core, Spring Boot, JPA, Security và AWS Cloud. Rèn luyện kỷ luật, không mất phương hướng.",
};

export default function ChallengesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 p-8 animate-pulse space-y-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="h-64 bg-gray-200 dark:bg-slate-800 rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-slate-800 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ChallengesListClient />
    </Suspense>
  );
}
