"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import ToastProvider from "@/components/providers/ToastProvider";
import PushNotificationProvider from "@/components/providers/PushNotificationProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import PresenceProvider from "@/components/providers/PresenceProvider";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { Locale } from "@/i18n/config";
 
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 60 * 1000, 
      },
    },
  });
}
 
let browserQueryClient: QueryClient | undefined = undefined;
 
function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
 
export default function Providers({ children, initialLocale = "en" }: { children: ReactNode; initialLocale?: Locale }) {
  const [queryClient] = useState(() => getQueryClient());
 
  useEffect(() => {
    const accentTheme = localStorage.getItem("accent-theme") || "blue";
    document.documentElement.dataset.accentTheme = accentTheme;
  }, []);
 
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <I18nProvider initialLocale={initialLocale}>
          <AuthProvider>
            <PresenceProvider>
              <SettingsProvider>
                <SidebarProvider>
                  <PushNotificationProvider>
                    {children}
                    <ToastProvider />
                  </PushNotificationProvider>
                </SidebarProvider>
              </SettingsProvider>
            </PresenceProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
