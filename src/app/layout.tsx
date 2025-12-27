import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

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
  title: "F Learning - Nền tảng học tập trực tuyến",
  description:
    "Nền tảng học tập trực tuyến hiện đại, giúp bạn tiếp cận kiến thức mọi lúc, mọi nơi",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: "F Learning",
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* Inline data URL favicon (academic cap) to override cached icons immediately */}
        <link
          rel="icon"
          href={
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='%230056D2'/><polygon points='10,28 32,18 54,28 32,36' fill='%23ffffff' /><rect x='22' y='34' width='20' height='8' rx='2' fill='%23ffffff' /><circle cx='44' cy='26' r='2' fill='%23f59e0b'/><path d='M44 28 L40 34' stroke='%23f59e0b' stroke-width='1.6' stroke-linecap='round' /></svg>"
          }
        />
        <link rel="icon" href="/favicon-academic.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/favicon-academic.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
