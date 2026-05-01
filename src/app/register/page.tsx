import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Đăng ký - JavaBuilder",
  description: "Tạo tài khoản JavaBuilder để bắt đầu hành trình học lập trình Java",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
