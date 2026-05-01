import type { Metadata } from "next";
import FavoriteCoursesClient from "./FavoriteCoursesClient";

export const metadata: Metadata = {
  title: "Khóa học yêu thích - JavaBuilder",
  description: "Danh sách các khóa học bạn đã đánh dấu yêu thích",
};

export default function FavoriteCoursesPage() {
  return <FavoriteCoursesClient />;
}
