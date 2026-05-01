import type { Metadata } from "next";
import BlogsClient from "./BlogsClient";

export const metadata: Metadata = {
  title: "Bài viết - JavaBuilder",
  description: "Khám phá các bài viết, hướng dẫn và kiến thức về lập trình Java từ cộng đồng JavaBuilder",
};

export default function BlogsPage() {
  return <BlogsClient />;
}
