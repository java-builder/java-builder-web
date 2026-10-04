"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { systemMetricsService } from "@/services/system-metrics.service";
import { SystemHealthResponse, HealthCheckHistoryItem } from "@/types/system-metric";
import { ComponentCardsGrid } from "@/components/admin/system-metrics/ComponentCardsGrid";
import { ServerEnvironmentCard } from "@/components/admin/system-metrics/ServerEnvironmentCard";
import { HealthHistoryWidget } from "@/components/admin/system-metrics/HealthHistoryWidget";
import { DiagnosticInspectorModal } from "@/components/admin/system-metrics/DiagnosticInspectorModal";
import { CustomSelect, SelectOption } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/button";
import { RefreshCw, Code2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSystemMetricsPage() {
  const { t } = useI18n();

  const [metrics, setMetrics] = useState<SystemHealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(30); // 30s default
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [history, setHistory] = useState<HealthCheckHistoryItem[]>([]);
  const [lastResponseTime, setLastResponseTime] = useState<number | undefined>(undefined);

  const isMountedRef = useRef(true);

  const refreshOptions: SelectOption[] = useMemo(() => [
    { value: 0, label: t("admin.systemMetrics.refreshIntervalOff") || "Tắt" },
    { value: 10, label: t("admin.systemMetrics.refreshInterval10s") || "10 giây" },
    { value: 30, label: t("admin.systemMetrics.refreshInterval30s") || "30 giây" },
    { value: 60, label: t("admin.systemMetrics.refreshInterval60s") || "60 giây" },
  ], [t]);

  const fetchMetrics = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const res = await systemMetricsService.getSystemHealth();
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (isMountedRef.current) {
        const data = res.data || null;
        setMetrics(data);
        const now = new Date();
        setLastResponseTime(latency);

        if (data) {
          const comps = data.components ? Object.values(data.components).filter(Boolean) : [];
          const healthy = comps.filter(
            (c) => typeof c === "object" && c !== null && "status" in c && (c as { status: string }).status === "UP"
          ).length;

          const historyItem: HealthCheckHistoryItem = {
            id: `${now.getTime()}-${Math.random().toString(36).substring(2, 7)}`,
            timestamp: now.toLocaleTimeString(),
            status: data.status,
            responseTimeMs: latency,
            healthyCount: healthy,
            totalCount: comps.length || 4,
          };

          setHistory((prev) => [historyItem, ...prev.slice(0, 9)]);
        }
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : t("admin.systemMetrics.errorFetch") || "Không thể tải dữ liệu giám sát hệ thống";
        setError(errorMsg);
        if (!isSilent) {
          toast.error(errorMsg);
        }
      }
    } finally {
      if (isMountedRef.current && !isSilent) {
        setIsLoading(false);
      }
    }
  }, [t]);

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;
    fetchMetrics();
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchMetrics]);

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefreshInterval || autoRefreshInterval <= 0) return;

    const timer = setInterval(() => {
      fetchMetrics(true);
    }, autoRefreshInterval * 1000);

    return () => clearInterval(timer);
  }, [autoRefreshInterval, fetchMetrics]);

  const isUp = metrics?.status === "UP";

  return (
    <div className="p-6 min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Page Header (Matching standard admin pages: Caches, Users, etc.) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            {t("admin.systemMetrics.pageTitle")}
            {metrics && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  isUp
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isUp ? "bg-emerald-400" : "bg-rose-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isUp ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                </span>
                {metrics.status}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("admin.systemMetrics.pageSubtitle")}
          </p>
        </div>

        {/* Header Action Controls (No overflow-hidden, clean CustomSelect) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Auto Refresh Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {t("admin.systemMetrics.autoRefresh")}:
            </span>
            <div className="w-[125px]">
              <CustomSelect
                value={autoRefreshInterval}
                onChange={(val) => setAutoRefreshInterval(Number(val))}
                options={refreshOptions}
                size="sm"
                searchable={false}
                align="right"
              />
            </div>
          </div>

          {/* Diagnostic JSON Viewer Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDiagnosticOpen(true)}
            className="cursor-pointer gap-2"
          >
            <Code2 className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">JSON</span>
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMetrics()}
            disabled={isLoading}
            className="cursor-pointer gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>{t("admin.systemMetrics.refreshBtn")}</span>
          </Button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && !metrics && (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-card border border-border" />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !metrics && (
        <div className="p-8 rounded-xl border border-destructive/30 bg-destructive/5 text-center flex flex-col items-center justify-center space-y-4">
          <div className="p-3 rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {t("admin.systemMetrics.errorFetch") || "Không thể kết nối đến API System Metrics"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{error}</p>
          </div>
          <Button onClick={() => fetchMetrics()} className="cursor-pointer gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>{t("admin.systemMetrics.refreshBtn") || "Thử lại"}</span>
          </Button>
        </div>
      )}

      {/* Main Content (Single set of cards with logos, no duplicate) */}
      {metrics && (
        <div className="space-y-6">
          {/* Detailed Component Monitoring Cards (PostgreSQL, Redis, Disk, Ping) */}
          <ComponentCardsGrid
            components={metrics.components}
            groups={metrics.groups}
            responseTimeMs={lastResponseTime}
          />

          {/* Server & Runtime Environment (AWS EC2 / App Info) */}
          <ServerEnvironmentCard info={metrics.info} appInfo={metrics.appInfo} />

          {/* Session Health Check History Timeline */}
          <HealthHistoryWidget history={history} />
        </div>
      )}

      {/* Raw Diagnostic JSON Modal */}
      <DiagnosticInspectorModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        data={metrics}
      />
    </div>
  );
}
