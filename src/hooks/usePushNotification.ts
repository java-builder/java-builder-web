"use client";

import { useEffect, useState } from "react";
import { fcmService } from "@/services/fcm.service";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { MessagePayload } from "firebase/messaging";

export function usePushNotification() {
  const { isAuthenticated } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(fcmService.isSupported());
    setIsEnabled(fcmService.getPermissionStatus() === "granted");
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isSupported) return;

    const unsubscribe = fcmService.setupForegroundListener((payload: MessagePayload) => {
      const title = payload.notification?.title || "Thông báo mới";
      const body = payload.notification?.body || "";
      
      toast.success(`${title}: ${body}`, {
        duration: 5000,
        icon: "🔔",
      });
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [isAuthenticated, isSupported]);

  const enableNotifications = async () => {
    try {
      const token = await fcmService.requestPermission();
      
      if (token) {
        await fcmService.saveFCMToken(token);
        setIsEnabled(true);
        toast.success("Đã bật thông báo thành công");
        return true;
      } else {
        toast.error("Không thể bật thông báo. Vui lòng kiểm tra quyền trình duyệt");
        return false;
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      toast.error("Có lỗi xảy ra khi bật thông báo");
      return false;
    }
  };

  const disableNotifications = async () => {
    try {
      await fcmService.removeFCMToken();
      setIsEnabled(false);
      toast.success("Đã tắt thông báo");
      return true;
    } catch (error) {
      console.error("Error disabling notifications:", error);
      toast.error("Có lỗi xảy ra khi tắt thông báo");
      return false;
    }
  };

  return {
    isEnabled,
    isSupported,
    enableNotifications,
    disableNotifications,
  };
}
