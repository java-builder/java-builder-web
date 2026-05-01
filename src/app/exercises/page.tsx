import type { Metadata } from "next";
import ExercisesClient from "./ExercisesClient";

export const metadata: Metadata = {
  title: "Bài tập - JavaBuilder",
  description: "Luyện tập và củng cố kiến thức qua các bài tập thực hành Java",
};

export default function ExercisesPage() {
  return <ExercisesClient />;
}
