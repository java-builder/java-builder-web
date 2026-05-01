import type { Metadata } from "next";
import FavoriteBlogsClient from "./FavoriteBlogsClient";

export const metadata: Metadata = {
  title: "Bài viết yêu thích - JavaBuilder",
  description: "Danh sách các bài viết bạn đã lưu để đọc lại sau",
};

export default function FavoriteBlogsPage() {
  return <FavoriteBlogsClient />;
}
