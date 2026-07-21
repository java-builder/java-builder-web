"use client";

import React from "react";
import { X } from "lucide-react";
import { PushNotificationItem } from "./PushNotificationsTable";
import { Button } from "@/components/ui/button";

interface PushDetailModalProps {
  item: PushNotificationItem;
  onClose: () => void;
}

export default function PushDetailModal({ item, onClose }: PushDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-border">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-bold text-foreground text-base">Chi Tiết Push Notification</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-foreground">
          <div>
            <span className="text-muted-foreground block mb-0.5 font-medium">Tiêu đề:</span>
            <p className="font-bold text-sm text-foreground">{item.title}</p>
          </div>

          <div>
            <span className="text-muted-foreground block mb-0.5 font-medium">Nội dung:</span>
            <p className="bg-muted/50 p-3 rounded-xl border border-border text-foreground leading-relaxed">
              {item.body}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-muted/40 rounded-xl">
              <span className="text-muted-foreground">Đối tượng:</span>
              <p className="font-semibold text-foreground mt-0.5">{item.targetAudience}</p>
            </div>
            <div className="p-3 bg-muted/40 rounded-xl">
              <span className="text-muted-foreground">Liên kết URL:</span>
              <p className="font-semibold text-accent dark:text-accent-on-dark mt-0.5 truncate">{item.url}</p>
            </div>
            <div className="p-3 bg-muted/40 rounded-xl">
              <span className="text-muted-foreground">Đã phát:</span>
              <p className="font-semibold text-foreground mt-0.5">{item.sentCount} thiết bị</p>
            </div>
            <div className="p-3 bg-muted/40 rounded-xl">
              <span className="text-muted-foreground">Lượt click:</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{item.clickCount} clicks</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
