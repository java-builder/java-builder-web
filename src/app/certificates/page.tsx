import type { Metadata } from "next";
import MyCertificatesClient from "../my-certificates/MyCertificatesClient";

export const metadata: Metadata = {
  title: "Chứng chỉ của tôi - JavaBuilder",
  description: "Quản lý và xem các chứng chỉ hoàn thành khóa học từ JavaBuilder",
};

export default function CertificatesPage() {
  return <MyCertificatesClient />;
}
