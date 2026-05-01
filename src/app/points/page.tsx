import type { Metadata } from "next";
import PointsClient from "./PointsClient";

export const metadata: Metadata = {
  title: "Điểm số - JavaBuilder",
  description: "Xem tổng điểm, lịch sử tích điểm và đổi điểm lấy phần thưởng",
};

export default function PointsPage() {
  return <PointsClient />;
}
