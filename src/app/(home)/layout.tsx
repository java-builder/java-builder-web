import { Metadata } from "next";
import { generateSEO, generateOrganizationStructuredData, generateWebsiteStructuredData, generateEducationalOrganizationStructuredData, generateFAQStructuredData } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  ...generateSEO({
    title: "JavaBuilder - Học lập trình Java, Spring Boot Online",
    description: "JavaBuilder (Java Builder) - Nền tảng học lập trình Java, Spring Boot, React, Next.js online hàng đầu Việt Nam. Khóa học chất lượng cao với mentor chuyên nghiệp. Từ zero đến hero cùng javabuilder.online",
    url: "/",
    tags: ["javabuilder", "java builder", "học java", "học lập trình java", "khóa học java online", "spring boot tutorial", "học spring boot", "java developer vietnam"],
  }),
  metadataBase: new URL(SITE_URL),
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationStructuredData();
  const websiteSchema = generateWebsiteStructuredData();
  const educationalSchema = generateEducationalOrganizationStructuredData();
  const faqSchema = generateFAQStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
