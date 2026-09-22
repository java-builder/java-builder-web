import type { Metadata } from "next";
import { Suspense } from "react";
import AboutClient from "./AboutClient";
import { generateSEO } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://javabuilder.online";

export const metadata: Metadata = {
  ...generateSEO({
    title: "Về tác giả - Lê Khánh Đức | Java Developer & Cloud Engineer",
    description: "Giới thiệu tác giả Lê Khánh Đức - Senior Java Developer & Cloud Engineer, AWS Certified Solutions Architect Associate (SSA-C03), Founder tại JavaBuilder.online. Chuyên sâu Spring Boot, Microservices, AWS, GCP và DevOps.",
    url: "/about",
    tags: [
      "Lê Khánh Đức",
      "Khanh Duc",
      "Java Developer",
      "AWS Certified Solutions Architect",
      "SSA-C03",
      "Spring Boot Specialist",
      "Cloud Engineer",
      "DevOps",
      "JavaBuilder Founder",
    ],
    image: `${SITE_URL}/ssa-c03.webp`,
    useTemplate: true,
  }),
};

export default function AboutPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Lê Khánh Đức",
    alternateName: ["Khanh Duc", "Le Khanh Duc"],
    jobTitle: "Senior Java Developer & Cloud Architect",
    worksFor: {
      "@type": "Organization",
      name: "JavaBuilder",
      url: SITE_URL,
    },
    url: `${SITE_URL}/about`,
    sameAs: [
      "https://github.com/JavaBuilder",
      "https://www.credly.com/earner/earned/badge/9f9b7ac4-845d-46cb-a2d5-277e0f0c7baf",
    ],
    knowsAbout: [
      "Java Core",
      "Spring Boot",
      "Spring Security",
      "Spring Data JPA",
      "Spring Cloud",
      "Spring AI",
      "AWS (Amazon Web Services)",
      "Google Cloud Platform (GCP)",
      "Docker",
      "CI/CD (Jenkins, GitHub Actions)",
      "ELK Stack",
      "SonarQube",
      "Apache Kafka",
      "Redis",
      "PostgreSQL",
      "MySQL",
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "AWS Certified Solutions Architect – Associate",
      credentialCategory: "Certification",
      recognizedBy: {
        "@type": "Organization",
        name: "Amazon Web Services Training and Certification",
      },
      url: "https://www.credly.com/earner/earned/badge/9f9b7ac4-845d-46cb-a2d5-277e0f0c7baf",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 p-8 animate-pulse space-y-8">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="h-64 bg-gray-200 dark:bg-slate-800 rounded-3xl" />
              <div className="h-80 bg-gray-200 dark:bg-slate-800 rounded-3xl" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-60 bg-gray-200 dark:bg-slate-800 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <AboutClient />
      </Suspense>
    </>
  );
}
