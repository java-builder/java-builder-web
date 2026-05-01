import type { Metadata } from "next";
import NotificationsClient from "./NotificationsClient";

export const metadata: Metadata = {
  title: "Thông báo - JavaBuilder",
  description: "Xem tất cả thông báo và cập nhật mới nhất từ JavaBuilder",
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
