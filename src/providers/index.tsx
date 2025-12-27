"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ToastProvider from "@/components/providers/ToastProvider";
import Chatbot from "@/components/Chatbot";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showChatbot = !pathname?.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastProvider />
      {showChatbot && <Chatbot />}
    </QueryClientProvider>
  );
}
