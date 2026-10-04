"use client";

import React from "react";
import { useI18n } from "@/contexts/I18nContext";
import { HealthCheckHistoryItem } from "@/types/system-metric";
import { History, CheckCircle2, XCircle, AlertTriangle, Zap } from "lucide-react";

interface HealthHistoryWidgetProps {
  history: HealthCheckHistoryItem[];
}

export function HealthHistoryWidget({ history }: HealthHistoryWidgetProps) {
  const { t } = useI18n();

  if (!history || history.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">
              {t("admin.systemMetrics.checkHistoryTitle")}
            </h3>
            <p className="text-xs text-muted-foreground">Session probe log (last {history.length} checks)</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-border/70 text-muted-foreground">
              <th className="py-2.5 px-3 font-semibold">{t("admin.systemMetrics.historyTime")}</th>
              <th className="py-2.5 px-3 font-semibold">{t("admin.systemMetrics.historyStatus")}</th>
              <th className="py-2.5 px-3 font-semibold">{t("admin.systemMetrics.historyLatency")}</th>
              <th className="py-2.5 px-3 font-semibold text-right">{t("admin.systemMetrics.historyHealthRatio")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {history.map((item) => {
              const isUp = item.status === "UP";
              const isDown = item.status === "DOWN";
              return (
                <tr key={item.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-muted-foreground whitespace-nowrap">
                    {item.timestamp}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                        isUp
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : isDown
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {isUp ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      ) : isDown ? (
                        <XCircle className="w-3 h-3 text-rose-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                      )}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-mono text-muted-foreground">
                      <Zap className="w-3 h-3 text-amber-500" />
                      {item.responseTimeMs}ms
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-right text-foreground font-medium">
                    {item.healthyCount}/{item.totalCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
