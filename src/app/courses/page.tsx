import type { Metadata } from "next";
import CoursesClient from "./CoursesClient";

export const metadata: Metadata = {
  title: "Khóa học - JavaBuilder",
  description: "Danh sách các khóa học Java từ cơ bản đến nâng cao, học Java Backend chuyên sâu",
};

export default function CoursesPage() {
  return <CoursesClient />;
}
