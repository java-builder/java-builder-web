import type { Metadata } from "next";
import LeaderboardClient from "./LeaderboardClient";

export const metadata: Metadata = {
  title: "Bảng xếp hạng - JavaBuilder",
  description: "Xem thứ hạng của bạn và cạnh tranh với các học viên khác trong cộng đồng JavaBuilder",
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
