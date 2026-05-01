import type { Metadata } from "next";
import RoadmapClient from "./RoadmapClient";

export const metadata: Metadata = {
  title: "Lộ trình học - JavaBuilder",
  description: "Lộ trình học lập trình Java từ cơ bản đến nâng cao tại JavaBuilder",
};

export default function RoadmapPage() {
  return <RoadmapClient />;
}
