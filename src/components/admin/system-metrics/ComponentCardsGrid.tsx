"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/contexts/I18nContext";
import { SystemHealthComponents } from "@/types/system-metric";
import { formatBytes } from "@/utils/formatters";
import { 
  HardDrive, 
  Wifi, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FolderOpen,
  Gauge,
  CheckCircle,
  Activity,
  Zap
} from "lucide-react";

interface ComponentCardsGridProps {
  components?: SystemHealthComponents;
  groups?: string[];
  responseTimeMs?: number;
}

export function ComponentCardsGrid({ components, groups, responseTimeMs }: ComponentCardsGridProps) {
  const { t } = useI18n();

  const db = components?.db;
  const disk = components?.diskSpace;
  const redis = components?.redis;
  const ping = components?.ping;
  const liveness = components?.livenessState;
  const readiness = components?.readinessState;

  // Status badge renderer
  const renderStatusBadge = (status?: string) => {
    const isUp = status === "UP";
    const isDown = status === "DOWN";

    const config = isUp
      ? {
          bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          dot: "bg-emerald-500",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
          label: "UP",
        }
      : isDown
      ? {
          bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          dot: "bg-rose-500",
          icon: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
          label: "DOWN",
        }
      : {
          bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          dot: "bg-amber-500",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
          label: status || "UNKNOWN",
        };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}>
        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
        <span>{config.label}</span>
      </span>
    );
  };

  // Disk calculations
  const diskTotal = disk?.details?.total || 0;
  const diskFree = disk?.details?.free || 0;
  const diskUsed = Math.max(0, diskTotal - diskFree);
  const diskUsedPercentage = diskTotal > 0 ? Math.round((diskUsed / diskTotal) * 100) : 0;
  const diskThreshold = disk?.details?.threshold || 0;

  const diskBarColor =
    diskUsedPercentage > 90
      ? "bg-rose-500"
      : diskUsedPercentage > 75
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <div className="space-y-6">
      {/* 4 Core Monitoring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. PostgreSQL Database Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 p-2 flex items-center justify-center">
                <Image
                  src="/logos/logo-posgtres.png"
                  alt="PostgreSQL"
                  width={36}
                  height={36}
                  className="w-8 h-8 object-contain"
                />
              </div>
              {renderStatusBadge(db?.status)}
            </div>

            <div>
              <h3 className="font-bold text-base text-foreground">
                {t("admin.systemMetrics.dbTitle")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {db?.details?.database || "PostgreSQL"} Relational DB
              </p>
            </div>

            <div className="space-y-2.5 mt-4 pt-3 border-t border-border/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("admin.systemMetrics.dbType")}:</span>
                <span className="font-semibold text-foreground bg-secondary px-2 py-0.5 rounded-md">
                  {db?.details?.database || "PostgreSQL"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("admin.systemMetrics.dbValidation")}:</span>
                <code className="font-mono text-primary text-[11px] bg-primary/10 px-2 py-0.5 rounded-md">
                  {db?.details?.validationQuery || "isValid()"}
                </code>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Connection Pool</span>
            <span className="text-emerald-500 font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Connected
            </span>
          </div>
        </div>

        {/* 2. Redis Cache Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-rose-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 p-2 flex items-center justify-center">
                <Image
                  src="/logos/logo-redis.jpg"
                  alt="Redis"
                  width={36}
                  height={36}
                  className="w-8 h-8 object-contain rounded-md"
                />
              </div>
              {renderStatusBadge(redis?.status)}
            </div>

            <div>
              <h3 className="font-bold text-base text-foreground">
                {t("admin.systemMetrics.redisTitle")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">In-Memory Cache & Session</p>
            </div>

            <div className="space-y-2.5 mt-4 pt-3 border-t border-border/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("admin.systemMetrics.redisVersion")}:</span>
                <span className="font-mono font-semibold text-foreground bg-secondary px-2 py-0.5 rounded-md">
                  v{redis?.details?.version || "8.x"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cache Driver:</span>
                <span className="font-semibold text-foreground bg-secondary px-2 py-0.5 rounded-md">
                  Lettuce / Redis
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Caches</span>
            <Link
              href="/admin/caches"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              <span>{t("admin.systemMetrics.redisActionManage")}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3. Disk Space Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <HardDrive className="w-6 h-6" />
              </div>
              {renderStatusBadge(disk?.status)}
            </div>

            <div>
              <h3 className="font-bold text-base text-foreground">
                {t("admin.systemMetrics.diskTitle")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatBytes(diskFree)} {t("admin.systemMetrics.diskFree").toLowerCase()}
              </p>
            </div>

            {/* Storage bar */}
            <div className="space-y-1.5 mt-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">
                  {t("admin.systemMetrics.diskUsed")}: {formatBytes(diskUsed)}
                </span>
                <span className="font-bold text-foreground">{diskUsedPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${diskBarColor}`}
                  style={{ width: `${Math.min(100, Math.max(2, diskUsedPercentage))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                <span>{t("admin.systemMetrics.diskFree")}: {formatBytes(diskFree)}</span>
                <span>{t("admin.systemMetrics.diskTotal")}: {formatBytes(diskTotal)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/50 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <FolderOpen className="w-3 h-3" />
                {t("admin.systemMetrics.diskPath")}:
              </span>
              <span className="font-mono text-foreground bg-secondary px-1.5 py-0.5 rounded-sm truncate max-w-[120px]" title={disk?.details?.path}>
                {disk?.details?.path || "Root"}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <Gauge className="w-3 h-3" />
                {t("admin.systemMetrics.diskThreshold")}:
              </span>
              <span className="font-mono text-muted-foreground">
                {formatBytes(diskThreshold)}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Ping & Heartbeat Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-teal-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Wifi className="w-6 h-6" />
              </div>
              {renderStatusBadge(ping?.status)}
            </div>

            <div>
              <h3 className="font-bold text-base text-foreground">
                {t("admin.systemMetrics.pingTitle")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Server Heartbeat</p>
            </div>

            <div className="space-y-2.5 mt-4 pt-3 border-t border-border/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("admin.systemMetrics.responseTime")}:</span>
                <span className="font-mono font-semibold text-foreground bg-secondary px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  {responseTimeMs !== undefined ? `${responseTimeMs}ms` : "Active"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Heartbeat:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Hoạt động
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Ping Service</span>
            <span className="text-emerald-500 font-medium">Healthy</span>
          </div>
        </div>
      </div>

      {/* Lifecycle & Readiness Group Bar */}
      {((groups && groups.length > 0) || liveness || readiness) && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  Trạng thái vận hành ứng dụng (Application Lifecycle)
                </h4>
                <p className="text-xs text-muted-foreground">
                  Kiểm tra tiến trình dịch vụ và khả năng sẵn sàng phục vụ lưu lượng
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Readiness status */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-secondary/50">
                <span className="text-xs text-muted-foreground font-medium">Readiness:</span>
                {renderStatusBadge(readiness?.status || "UP")}
              </div>

              {/* Liveness status */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-secondary/50">
                <span className="text-xs text-muted-foreground font-medium">Liveness:</span>
                {renderStatusBadge(liveness?.status || "UP")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
