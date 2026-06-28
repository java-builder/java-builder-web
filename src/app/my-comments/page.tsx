import type { Metadata } from "next";
import MyCommentsClient from "./MyCommentsClient";

export const metadata: Metadata = {
  title: "Bình luận của tôi - JavaBuilder",
  description: "Xem lại danh sách tất cả bình luận bạn đã viết trên JavaBuilder",
};

export default function MyCommentsPage() {
  return <MyCommentsClient />;
}
