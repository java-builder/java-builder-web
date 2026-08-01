import { ReactNode } from "react";
import type { Metadata } from "next";
import { postService } from "@/services/post.service";
import { generateSEO, generateQnAStructuredData } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await postService.getBySlug(slug);

    const description = post.content
      ? post.content.replace(/<[^>]*>/g, "").replace(/[*_~`#]/g, "").substring(0, 160)
      : post.title;

    const imgUrl = post.thumbnailUrl || `${SITE_URL}/logos/java-logo.png`;

    return generateSEO({
      title: `${post.title} | JavaBuilder Q&A`,
      description,
      image: imgUrl,
      url: `/qna/${post.slug}`,
      type: "article",
      publishedTime: post.createdAt,
      author: post.username || "JavaBuilder Member",
      tags: [post.categoryName || "Q&A", ...(post.tags || []), "hỏi đáp lập trình"],
      useTemplate: false,
    });
  } catch {
    return {
      title: "Hỏi Đáp Lập Trình | JavaBuilder Q&A",
    };
  }
}

export default async function QnaDetailLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let structuredData = null;
  try {
    const post = await postService.getBySlug(slug);
    structuredData = generateQnAStructuredData(post);
  } catch {
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
