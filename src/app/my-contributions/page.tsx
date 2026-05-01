import type { Metadata } from "next";
import MyContributionsClient from "./MyContributionsClient";

export const metadata: Metadata = {
  title: "Câu hỏi đóng góp - JavaBuilder",
  description: "Quản lý các câu hỏi phỏng vấn bạn đã đóng góp cho cộng đồng JavaBuilder",
};

export default function MyContributionsPage() {
  return <MyContributionsClient />;
}
