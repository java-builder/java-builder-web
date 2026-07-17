import type { Metadata } from "next";
import CoursesClient from "./CoursesClient";
import { metadata as seoMetadata } from "./metadata";

export const metadata: Metadata = seoMetadata;

export default function CoursesPage() {
  return <CoursesClient />;
}
