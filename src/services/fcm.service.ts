import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
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

      const deviceType = getDeviceType();
      const payload: FcmTokenRequest = {
        fcmToken: token,
        deviceType: deviceType,
        deviceId: navigator.userAgent
      };

      await apiClient.post(API.REGISTER_FCM_TOKEN, payload);
    } catch (error) {
      console.error("Error saving FCM token to backend:", error);
    }
  },

  deleteFCMToken: async () => {
    try {
      await apiClient.put(API.DELETE_FCM_TOKEN);
    } catch (error) {
      console.error("Error deleting FCM token from backend:", error);
    }
  },

  onForegroundMessage: (callback: (payload: MessagePayload) => void) => {
    if (typeof window === "undefined") return () => {};
    
    try {
      const messaging = getMessaging(app);
      return onMessage(messaging, (payload) => {
        callback(payload);
      });
    } catch (error) {
      console.error("Error setting up foreground message listener:", error);
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

  getSubscribedUsers: async (keyword?: string, page: number = 1, size: number = 20) => {
    try {
      const response = await apiClient.get<ApiResponse<PageResponse<unknown>>>(API.GET_SUBSCRIBED_USERS, {
        params: { keyword: keyword || undefined, page, size },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching FCM subscribed users:", error);
      throw error;
    }
  },

  sendFCMPush: async (data: {
    title: string;
    body: string;
    clickUrl?: string;
    targetAudience?: string;
    targetUserIds?: string[];
  }) => {
    try {
      const response = await apiClient.post<ApiResponse<void>>(API.SEND_FCM_PUSH, data);
      return response.data;
    } catch (error) {
      console.error("Error sending FCM Push notification:", error);
      throw error;
    }
  },
};
