import type { Metadata } from "next";
import StreakClient from "./StreakClient";

export const metadata: Metadata = {
  title: "Chuỗi ngày học - JavaBuilder",
  description: "Theo dõi chuỗi ngày học liên tục và duy trì động lực học tập mỗi ngày",
};

export default function StreakPage() {
  return <StreakClient />;
}
