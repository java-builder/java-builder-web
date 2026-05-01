import type { Metadata } from "next";
import ChatbotClient from "./ChatbotClient";

export const metadata: Metadata = {
  title: "AI Chatbot - JavaBuilder",
  description: "Trợ lý AI hỗ trợ học lập trình Java 24/7",
};

export default function ChatbotPage() {
  return <ChatbotClient />;
}
