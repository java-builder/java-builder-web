import type { Metadata } from "next";
import PasswordClient from "./PasswordClient";

export const metadata: Metadata = {
  title: "Đổi mật khẩu - JavaBuilder",
  description: "Thay đổi mật khẩu tài khoản của bạn",
};

export default function PasswordPage() {
  return <PasswordClient />;
}
