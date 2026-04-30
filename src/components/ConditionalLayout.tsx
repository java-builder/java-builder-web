"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
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
  ];
  
  const shouldRemoveMargin = noMarginRoutes.some(route => pathname?.startsWith(route));
  
  return (
    <div className={shouldRemoveMargin ? "" : "lg:ml-64"}>
      {children}
    </div>
  );
}
