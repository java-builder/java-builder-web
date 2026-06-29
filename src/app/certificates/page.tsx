import type { Metadata } from "next";
import CertificatesClient from "./CertificatesClient";

export const metadata: Metadata = {
  title: "Chứng chỉ của tôi - JavaBuilder",
  description: "Quản lý và xem các chứng chỉ hoàn thành khóa học từ JavaBuilder",
};

export default function CertificatesPage() {
  return <CertificatesClient />;
}
