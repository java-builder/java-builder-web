"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PushNotificationPrompt from "@/components/notifications/PushNotificationPrompt";

export default function PushNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      isAuthenticated
    ) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, [isAuthenticated]);

  return (
    <>
      {children}
      <PushNotificationPrompt />
    </>
  );
}
