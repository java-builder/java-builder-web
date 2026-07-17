import type { Metadata } from "next";
import BlogsClient from "./BlogsClient";
import { metadata as seoMetadata } from "./metadata";

export const metadata: Metadata = seoMetadata;

export default function BlogsPage() {
  return <BlogsClient />;
}
