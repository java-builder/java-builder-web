import type { Metadata } from "next";
import RoadmapClient from "./RoadmapClient";
import { metadata as seoMetadata } from "./metadata";

export const metadata: Metadata = seoMetadata;

export default function RoadmapPage() {
  return <RoadmapClient />;
}
