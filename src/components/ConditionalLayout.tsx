"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useSidebar } from "@/contexts/SidebarContext";

export default function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  
  const noMarginRoutes = [
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
    "/courses/",
  ];
  
  const shouldRemoveMargin = noMarginRoutes.some(route => pathname?.startsWith(route));
  
  return (
    <div className={`transition-all duration-300 ${shouldRemoveMargin ? "" : isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
      {children}
    </div>
  );
}
