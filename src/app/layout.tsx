import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import { generateSEO, generateOrganizationStructuredData, generateWebsiteStructuredData, generateEducationalOrganizationStructuredData, generateFAQStructuredData } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  ...generateSEO({
    title: "JavaBuilder - Làm chủ Backend Java",
    description: "JavaBuilder - Nền tảng học lập trình Java Backend chuyên sâu. Làm chủ Java Core, Spring Boot, Microservices với lộ trình bài bản và mentor chuyên nghiệp.",
    url: "/",
    tags: ["javabuilder", "học java backend", "spring boot", "microservices", "java developer", "backend developer vietnam"],
  }),
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "GHY1F4vuVRXuOvOHSC3nupGE7OOsvnwI3Ff2z1x7_m4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationStructuredData();
  const websiteSchema = generateWebsiteStructuredData();
  const educationalSchema = generateEducationalOrganizationStructuredData();
  const faqSchema = generateFAQStructuredData();

  return (
    <html lang="vi">
      <head>
        <link rel="icon" type="image/jpeg" href="/logos/java-coffee-logo-icon-vector.jpg" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/logos/java-coffee-logo-icon-vector.jpg" />
        
        {/* Structured Data */}
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
