import { ReactNode } from "react";
import type { Metadata } from "next";
import { courseApi } from "@/services/course.service";
import { generateSEO, generateCourseStructuredData } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const result = await courseApi.getBySlug(slug);

    if (result.code !== 200 || !result.data) {
      return { title: "Khóa học" };
    }

    const course = result.data;
    const description = course.description.substring(0, 160);

    const imgUrl = course.thumbnailUrl || `${SITE_URL}/hero-background.jpg`;

    return generateSEO({
      title: course.title,
      description,
      image: imgUrl,
      url: `/courses/${course.slug}`,
      type: 'website',
      tags: [course.level || 'khóa học', 'lập trình', 'online course'],
    });
  } catch {
    return {
      title: "Khóa học",
    };
  }
}

export default async function CourseDetailLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let structuredData = null;
  try {
    const result = await courseApi.getBySlug(slug);
    if (result.code === 200 && result.data) {
      structuredData = generateCourseStructuredData(result.data);
    }
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
