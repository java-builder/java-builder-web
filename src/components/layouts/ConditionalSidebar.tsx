"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default function ConditionalSidebar() {
  const pathname = usePathname();
  
  const hideOnRoutes = [
    "/admin",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/terms",
    "/privacy-policy",
    "/oauth2/callback",
    "/learn",
    "/docs",
    "/courses/"
  ];
  
  const shouldHideSidebar = hideOnRoutes.some(route => pathname?.startsWith(route));
  
  if (shouldHideSidebar) {
    return null;
  }
  
  return <Sidebar />;
}
