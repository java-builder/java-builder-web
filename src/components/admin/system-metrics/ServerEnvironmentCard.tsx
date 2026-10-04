"use client";

import React from "react";
import { AppInfo, ActuatorInfo } from "@/types/system-metric";
import { Server, Cpu, Layers } from "lucide-react";

interface ServerEnvironmentCardProps {
  info?: ActuatorInfo;
  appInfo?: AppInfo;
}

export function ServerEnvironmentCard({ info, appInfo }: ServerEnvironmentCardProps) {
  // If neither info nor appInfo is provided, don't crash
  const hasInfo = Boolean(info && Object.keys(info).length > 0);
  const hasAppInfo = Boolean(appInfo);

  if (!hasInfo && !hasAppInfo) return null;

  const appData = info?.app;
  const javaData = info?.java;
  const osData = info?.os;

  const appName = appData?.name || appInfo?.appName || "java-builder";
  const appVersion = appData?.version || appInfo?.appVersion || "1.0.0";
  const activeProfile = appData?.environment || appInfo?.activeProfile || "prod";
  const javaVersion = javaData?.version || appInfo?.java?.version || "21+";
  
  const javaVendor = (typeof javaData?.vendor === "object" && javaData.vendor !== null)
    ? javaData.vendor.name || "OpenJDK"
    : (typeof javaData?.vendor === "string" ? javaData.vendor : null) || appInfo?.java?.vendor || "OpenJDK";
    
  const osName = osData?.name || appInfo?.os?.name || "Linux";
  const osArch = osData?.arch || appInfo?.os?.arch || "amd64";

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-foreground flex flex-wrap items-center gap-2">
              <span>Môi trường máy chủ & Ứng dụng</span>
              <span className="text-[11px] font-semibold font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                AWS EC2
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Thông tin cấu hình phần cứng, hệ điều hành và phiên bản Java Runtime
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Profile:</span>
          <span className="uppercase text-xs font-bold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
            {activeProfile}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs">
        {/* App Info */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40 border border-border/50">
          <div className="p-2 rounded-md bg-blue-500/10 text-blue-500 flex-shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <p className="text-muted-foreground text-[11px]">Tên ứng dụng</p>
            <p className="font-bold text-foreground mt-0.5">{appName}</p>
            <p className="text-muted-foreground text-[11px] mt-0.5">Phiên bản: <span className="font-mono text-foreground font-medium">v{appVersion}</span></p>
          </div>
        </div>

        {/* OS Info */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40 border border-border/50">
          <div className="p-2 rounded-md bg-purple-500/10 text-purple-500 flex-shrink-0">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <p className="text-muted-foreground text-[11px]">Hệ điều hành Host</p>
            <p className="font-bold text-foreground mt-0.5">{osName}</p>
            <p className="text-muted-foreground text-[11px] mt-0.5">Kiến trúc: <span className="font-mono text-foreground font-medium">{osArch}</span></p>
          </div>
        </div>

        {/* Java Info */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40 border border-border/50">
          <div className="p-2 rounded-md bg-rose-500/10 text-rose-500 flex-shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <p className="text-muted-foreground text-[11px]">Java Runtime</p>
            <p className="font-bold text-foreground mt-0.5 font-mono">Java {javaVersion}</p>
            <p className="text-muted-foreground text-[11px] mt-0.5 truncate max-w-[150px]" title={javaVendor}>{javaVendor}</p>
          </div>
        </div>

        {/* Virtual Threads / Loom */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40 border border-border/50">
          <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-500 flex-shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <p className="text-muted-foreground text-[11px]">Virtual Threads</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Enabled</span>
            </div>
            <p className="text-muted-foreground text-[11px] mt-0.5">Project Loom</p>
          </div>
        </div>
      </div>
    </div>
  );
}
