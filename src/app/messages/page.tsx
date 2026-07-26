import { Metadata } from "next";
import MessagesClient from "./MessagesClient";

export const metadata: Metadata = {
  title: "Tin nhắn học tập & Thảo luận nhóm | JavaBuilder",
  description: "Trò chuyện trực tiếp 1-1 với Mentor, Trợ giảng và tham gia nhóm học tập trao đổi kiến thức Java Core, Spring Boot tại JavaBuilder.",
};

export default function MessagesPage() {
  return <MessagesClient />;
}
