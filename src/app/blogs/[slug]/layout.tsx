import { ReactNode } from "react";
import type { Metadata } from "next";
import { blogService } from "@/services/blog.service";
import { generateSEO, generateBlogStructuredData } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const blog = await blogService.getBlogBySlug(slug);

    const description =
      blog.summary || blog.content.replace(/<[^>]*>/g, '').substring(0, 160);

    const imgUrl = blog.thumbnailUrl || `${SITE_URL}/hero-background.jpg`;

    return generateSEO({
      title: blog.title,
      description,
      image: imgUrl,
      url: `/blogs/${blog.slug}`,
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.createdAt,
      author: blog.author || 'JavaBuilder',
      tags: [blog.blogType, 'blog', 'lập trình'],
    });
  } catch {
    return {
      title: "Bài viết",
    };
  }
}

export default async function BlogDetailLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let structuredData = null;
  try {
    const blog = await blogService.getBlogBySlug(slug);
    structuredData = generateBlogStructuredData(blog);
  } catch {
    // Fail silently
  }

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      {children}
    </>
  );
}
