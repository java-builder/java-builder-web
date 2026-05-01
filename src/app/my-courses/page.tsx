import type { Metadata } from "next";
import MyCoursesClient from "./MyCoursesClient";

export const metadata: Metadata = {
  title: "Khóa học của tôi - JavaBuilder",
  description: "Quản lý và tiếp tục học các khóa học bạn đã đăng ký",
};

export default function MyCoursesPage() {
  return <MyCoursesClient />;
}
