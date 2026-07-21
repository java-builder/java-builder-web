"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fcmService } from "@/services/fcm.service";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROMPT_DISMISSED_KEY = "push_notification_prompt_dismissed";
const PROMPT_DELAY = 2500;

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
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 p-4 space-y-3.5 backdrop-blur-xl">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent/10 p-1.5 flex items-center justify-center shrink-0 border border-accent/20">
              <Image
                src="/logos/java-logo.png"
                alt="JavaBuilder Logo"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h4 className="text-sm font-bold text-foreground">Nhận Tips & Kiến Thức Java</h4>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap shrink-0">
                  <Lightbulb className="w-3 h-3 mr-1 shrink-0" /> Java Tips
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                JavaBuilder Platform
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          Cập nhật sớm nhất mẹo lập trình Java Backend, bộ câu hỏi phỏng vấn HOT & kiến thức công nghệ mới từ JavaBuilder.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Để sau
          </Button>

          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={handleEnable}
            disabled={isEnabling}
            className="gap-1.5 text-xs font-semibold"
          >
            {isEnabling ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang kích hoạt...
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" /> Bật Nhận Tips Ngay
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
