import type { Metadata } from "next";
import MyCertificatesClient from "./MyCertificatesClient";

export const metadata: Metadata = {
  title: "Chứng chỉ của tôi - JavaBuilder",
  description: "Quản lý, tìm kiếm và tải xuống chứng chỉ hoàn thành khóa học từ JavaBuilder",
};

export default function MyCertificatesPage() {
  return <MyCertificatesClient />;
}
