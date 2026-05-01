import { Metadata } from "next";
import AITrainingClient from "./AITrainingClient";

export const metadata: Metadata = {
  title: "AI Training - JavaBuilder Admin",
  description: "Upload markdown files to train AI chatbot",
};

export default function AITrainingPage() {
  return <AITrainingClient />;
}
