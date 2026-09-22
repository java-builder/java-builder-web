"use client";

import { useI18n } from "@/contexts/I18nContext";
import { Database, KeyRound, Activity } from "lucide-react";

interface CacheStatsCardsProps {
  totalCaches: number;
  totalKeys: number;
  isLoading: boolean;
}

export function CacheStatsCards({
  totalCaches,
  totalKeys,
  isLoading,
}: CacheStatsCardsProps) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Caches Card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs transition-all hover:border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("admin.caches.totalCaches")}
            </p>
            <h3 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
              {isLoading ? "..." : totalCaches}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Active Keys Card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs transition-all hover:border-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("admin.caches.activeKeys")}
            </p>
            <h3 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
              {isLoading ? "..." : totalKeys}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Redis Status Card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs transition-all hover:border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("admin.caches.redisStatus")}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                {t("admin.caches.statusConnected")}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
