import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Thông tin cá nhân - JavaBuilder",
  description: "Quản lý thông tin tài khoản và cài đặt cá nhân của bạn",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
