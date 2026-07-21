"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Monitor, Smartphone, Wifi, Battery, Signal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PushPreviewCardProps {
  title: string;
  body: string;
}

export default function PushPreviewCard({ title, body }: PushPreviewCardProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Header & Device Selector */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            {device === "desktop" ? (
              <Monitor className="w-4 h-4 text-accent" />
            ) : (
              <Smartphone className="w-4 h-4 text-accent" />
            )}
            Xem Trước Hiển Thị Push
          </p>

          {/* Toggle Pills */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                device === "desktop"
                  ? "bg-card text-accent dark:text-accent-on-dark shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                device === "mobile"
                  ? "bg-card text-accent dark:text-accent-on-dark shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>
        </div>

        {/* Preview Display */}
        {device === "desktop" ? (
          /* Mock Windows Chrome Notification Banner */
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-xl border border-slate-700 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-semibold text-amber-400">JavaBuilder Platform</span>
              <span>Google Chrome • bây giờ</span>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <Image
                src="/logos/java-logo.png"
                alt="JavaBuilder Logo"
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white line-clamp-1">{title || "Tiêu đề thông báo..."}</h4>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {body || "Nội dung chi tiết sẽ xuất hiện ở góc dưới trình duyệt khi người dùng đang lướt web..."}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">javabuilder.online</p>
              </div>
            </div>
          </div>
        ) : (
          /* Realistic iPhone Smartphone Chassis Mockup */
          <div className="flex justify-center py-2">
            <div className="relative w-[260px] h-[510px] bg-slate-950 text-white rounded-[44px] p-3 shadow-2xl border-[7px] border-slate-800 ring-1 ring-slate-700 flex flex-col justify-between overflow-hidden">
              {/* Ambient Background Wallpaper Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/60 via-slate-950 to-slate-950 pointer-events-none" />
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

              {/* Top Section: Status Bar & Dynamic Island Notch */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between px-3 text-[10px] font-semibold text-slate-300">
                  <span>09:41</span>
                  {/* Dynamic Island Notch Pill */}
                  <div className="w-20 h-5 bg-black rounded-full shadow-inner flex items-center justify-end px-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Signal className="w-3 h-3" />
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Lockscreen Time */}
                <div className="text-center pt-3">
                  <p className="text-4xl font-extralight tracking-tight text-white/95">09:41</p>
                  <p className="text-[10px] text-slate-300 font-medium mt-0.5">Thứ Ba, 21 tháng 7</p>
                </div>
              </div>

              {/* Middle Section: iOS Push Notification Card */}
              <div className="relative z-10 my-auto">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl space-y-2.5 transform transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/logos/java-logo.png"
                        alt="JavaBuilder Logo"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <span className="text-[11px] font-bold text-white tracking-wide">JavaBuilder Push</span>
                    </div>
                    <span className="text-[9px] font-medium text-slate-400">bây giờ</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">
                      {title || "Tiêu đề thông báo..."}
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-3 leading-relaxed font-normal">
                      {body || "Nội dung chi tiết thông báo đẩy..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Section: iOS Home Bar Indicator */}
              <div className="relative z-10 text-center pb-1">
                <div className="w-28 h-1 bg-white/40 rounded-full mx-auto" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
