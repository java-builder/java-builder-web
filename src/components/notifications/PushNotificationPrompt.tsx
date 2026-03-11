"use client";

import { useState, useEffect } from "react";
import { fcmService } from "@/services/fcm.service";
import { useAuth } from "@/contexts/AuthContext";
import { FaBell, FaTimes } from "react-icons/fa";

const PROMPT_DISMISSED_KEY = "push_notification_prompt_dismissed";
const PROMPT_DELAY = 3000;

export default function PushNotificationPrompt() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);

  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      fcmService.isSupported() &&
      fcmService.getPermissionStatus() === "default" &&
      !localStorage.getItem(PROMPT_DISMISSED_KEY)
    ) {
      const timer = setTimeout(() => setShowPrompt(true), PROMPT_DELAY);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading]);

  const handleEnable = async () => {
    setIsEnabling(true);
    try {
      const token = await fcmService.requestPermission();
      if (token) {
        await fcmService.saveFCMToken(token);
        setShowPrompt(false);
      } else {
        localStorage.setItem(PROMPT_DISMISSED_KEY, "true");
        setShowPrompt(false);
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
    } finally {
      setIsEnabling(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(PROMPT_DISMISSED_KEY, "true");
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center gap-2">
            <FaBell className="text-white text-sm" />
            <span className="text-white font-semibold text-sm">Bật thông báo</span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white hover:text-white/90 transition-colors"
            aria-label="Đóng"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        <div className="p-3">
          <p className="text-gray-600 dark:text-gray-300 text-xs mb-3">
            Nhận thông báo về khóa học mới và hoạt động quan trọng
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleDismiss}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Để sau
            </button>
            <button
              onClick={handleEnable}
              disabled={isEnabling}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isEnabling ? (
                <>
                  <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang bật...
                </>
              ) : (
                "Bật ngay"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
