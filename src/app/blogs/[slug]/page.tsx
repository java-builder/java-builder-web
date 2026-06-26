import type { Metadata } from "next";
import { blogService } from "@/services/blog.service";
import BlogDetailClient from "./BlogDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const blog = await blogService.getBlogBySlug(resolvedParams.slug);

    if (blog) {
      return {
        title: `${blog.title} - JavaBuilder`,
        description: blog.summary || blog.content?.substring(0, 160) || `Đọc bài viết ${blog.title} tại JavaBuilder`,
      };
    }
  } catch (error) {
    console.error("Error fetching blog metadata:", error);
  }

  return {
    title: "Bài viết - JavaBuilder",
    description: "Bài viết về lập trình Java tại JavaBuilder",
  };
}

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}
