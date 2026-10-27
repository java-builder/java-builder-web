import type { Metadata } from "next";
import { Suspense } from "react";
import MentorClient from "./MentorClient";

export const metadata: Metadata = {
  title: "Đào tạo Mentor 1-1 Java 25 & Spring Boot 4 - JavaBuilder",
  description: "Chương trình đào tạo Mentor 1-1 Java 25 & Spring Boot 4 thực chiến, thực hành Git Flow, code review PR, thiết kế RESTful API chuẩn quốc tế và triển khai Cloud AWS.",
};

export default function MentorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 animate-pulse space-y-10 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="h-6 bg-muted rounded-md w-28 mx-auto" />
          <div className="h-10 bg-muted rounded-lg w-3/4 mx-auto" />
          <div className="h-4 bg-muted rounded-md w-5/6 mx-auto" />
          <div className="flex justify-center gap-3 pt-4">
            <div className="h-10 bg-muted rounded-lg w-36" />
            <div className="h-10 bg-muted rounded-lg w-36" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border/80 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
                <div className="h-5 bg-muted rounded w-2/3" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <MentorClient />
    </Suspense>
  );
}
