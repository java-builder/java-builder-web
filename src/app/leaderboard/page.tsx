import type { Metadata } from "next";
import LeaderboardClient from "./LeaderboardClient";

export const metadata: Metadata = {
  title: "Bảng xếp hạng học tập - JavaBuilder",
  description: "Bảng xếp hạng thi đấu học tập, tích lũy XP và bứt phá giới hạn lập trình mỗi tuần",
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
