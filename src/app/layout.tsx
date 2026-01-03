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
        <link
          rel="icon"
          href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%230056d2'/><g transform='translate(12,10)'><path d='M12 8 Q14 4 12 0' stroke='%23fff' stroke-width='2' fill='none' opacity='0.7'/><path d='M20 10 Q22 5 20 1' stroke='%23fff' stroke-width='2' fill='none' opacity='0.7'/><path d='M28 8 Q30 4 28 0' stroke='%23fff' stroke-width='2' fill='none' opacity='0.7'/><path d='M4 14 H36 V38 Q36 46 28 46 H12 Q4 46 4 38 Z' fill='%23fff'/><path d='M36 20 H40 Q46 20 46 28 Q46 36 40 36 H36' stroke='%23fff' stroke-width='4' fill='none'/><text x='14' y='36' font-family='Arial' font-size='22' font-weight='bold' fill='%230056d2'>J</text></g></svg>"
        />
        <link rel="icon" href="/favicon-academic.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/favicon-academic.svg" />
        
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
