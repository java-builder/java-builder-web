import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Đăng nhập - JavaBuilder",
  description: "Đăng nhập vào JavaBuilder để tiếp tục học lập trình Java",
};

export default function LoginPage() {
  return <LoginClient />;
}
