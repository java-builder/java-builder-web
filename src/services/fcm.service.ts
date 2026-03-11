import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import { FcmTokenRequest } from "@/types/fcm";
import { API } from "@/api/api";
import { getMessaging, getToken, onMessage, MessagePayload } from "firebase/messaging";
import { app } from "@/configuration/firebaseConfiguration";

export const fcmService = {
  requestPermission: async (): Promise<string | null> => {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission !== "granted") {
        console.log("Notification permission denied");
        return null;
      }

      // Wait for service worker to be ready
      const registration = await navigator.serviceWorker.ready;

      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      return token;
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  },

  saveFCMToken: async (token: string) => {
    try {
      const getDeviceType = (): string => {
        if ('userAgentData' in navigator && (navigator as { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile) {
          return "MOBILE";
        }
        
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        
        if (isTouchDevice && isSmallScreen) {
          return "MOBILE";
        }
        
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
        if (mobileRegex.test(navigator.userAgent)) {
          return "MOBILE";
        }
        
        return "WEB";
      };
      
      const response = await apiClient.post<ApiResponse<void>>(
        API.REGISTER_FCM_TOKEN,
        { 
          fcmToken: token,
          deviceId: navigator.userAgent,
          deviceType: getDeviceType()
        } as FcmTokenRequest
      );
      return response.data;
    } catch (error) {
      console.error("Error saving FCM token:", error);
      throw error;
    }
  },

  removeFCMToken: async () => {
    try {
      const response = await apiClient.put<ApiResponse<void>>(
        API.DELETE_FCM_TOKEN
      );
      return response.data;
    } catch (error) {
      console.error("Error removing FCM token:", error);
      throw error;
    }
  },

  setupForegroundListener: (callback: (payload: MessagePayload) => void) => {
    try {
      const messaging = getMessaging(app);
      return onMessage(messaging, callback);
    } catch (error) {
      console.error("Error setting up foreground listener:", error);
      return () => {};
    }
  },

  isSupported: (): boolean => {
    return (
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    );
  },

  getPermissionStatus: (): NotificationPermission => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "default";
    }
    return Notification.permission;
  },
};
