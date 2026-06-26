import type { Metadata } from "next";
import { courseApi } from "@/services/course.service";
import CourseDetailClient from "./CourseDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const response = await courseApi.getBySlug(resolvedParams.slug);
    const course = response.data;

    if (course) {
      return {
        title: `${course.title} - JavaBuilder`,
        description: course.description || `Học ${course.title} từ cơ bản đến nâng cao tại JavaBuilder`,
      };
    }
  } catch (error) {
    console.error("Error fetching course metadata:", error);
  }

  return {
    title: "Khóa học - JavaBuilder",
    description: "Khóa học lập trình Java tại JavaBuilder",
  };
}

export default function CourseDetailPage() {
  return <CourseDetailClient />;
}
