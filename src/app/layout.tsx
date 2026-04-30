import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import ConditionalSidebar from "@/components/ConditionalSidebar";
import ConditionalLayout from "@/components/ConditionalLayout";
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
    title: "JavaBuilder - Java Builder Online - Làm chủ Backend Java",
    description: "JavaBuilder (Java Builder Online) - Nền tảng học lập trình Java Backend chuyên sâu. Làm chủ Java Core, Spring Boot, Microservices với lộ trình bài bản và mentor chuyên nghiệp. Học Java online tại javabuilder.online",
    url: "/",
    tags: [
      "javabuilder", 
      "java builder", 
      "javabuilder online",
      "java builder online",
      "học java backend", 
      "spring boot", 
      "microservices", 
      "java developer", 
      "backend developer vietnam",
      "học java online",
      "khóa học java",
    ],
    useTemplate: false,
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
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/logos/java-logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/logos/java-logo.png" />
        
        {/* Additional SEO meta tags */}
        <meta name="application-name" content="JavaBuilder" />
        <meta name="apple-mobile-web-app-title" content="JavaBuilder" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#f97316" />
        
        {/* Alternate names for brand recognition */}
        <meta property="og:site_name" content="JavaBuilder - Java Builder Online" />
        <meta name="twitter:site" content="@JavaBuilder" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          suppressHydrationWarning
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          suppressHydrationWarning
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalSchema) }}
          suppressHydrationWarning
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          suppressHydrationWarning
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <ConditionalSidebar />
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </div>
        </Providers>
      </body>
    </html>
  );
}
