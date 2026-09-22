"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface ContributionStatsCardsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  isLoading?: boolean;
  onSelectStatus?: (status: string) => void;
  activeStatus?: string;
}

export const ContributionStatsCards = ({
  stats,
  isLoading = false,
  onSelectStatus,
  activeStatus,
}: ContributionStatsCardsProps) => {
  const { t } = useI18n();

  const items = [
    {
      key: "ALL",
      label: t("admin.questionContributions.tabAll"),
      value: stats.total,
      icon: <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      accent: "border-blue-100 dark:border-blue-900/30",
      ring: "ring-blue-500/20",
      valueClass: "text-foreground",
    },
    {
      key: "PENDING",
      label: t("admin.questionContributions.tabPending"),
      value: stats.pending,
      icon: <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      bg: "bg-amber-50 dark:bg-amber-950/30",
      accent: "border-amber-100 dark:border-amber-900/30",
      ring: "ring-amber-500/20",
      valueClass: "text-amber-600 dark:text-amber-400",
    },
    {
      key: "APPROVED",
      label: t("admin.questionContributions.tabApproved"),
      value: stats.approved,
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      accent: "border-emerald-100 dark:border-emerald-900/30",
      ring: "ring-emerald-500/20",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      key: "REJECTED",
      label: t("admin.questionContributions.tabRejected"),
      value: stats.rejected,
      icon: <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
      bg: "bg-rose-50 dark:bg-rose-950/30",
      accent: "border-rose-100 dark:border-rose-900/30",
      ring: "ring-rose-500/20",
      valueClass: "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((item) => {
        const isSelected = activeStatus === item.key;
        return (
          <Card
            key={item.key}
            onClick={() => onSelectStatus && onSelectStatus(item.key)}
            className={`border ${item.accent} transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.01] ${
              isSelected ? `ring-2 ${item.ring} shadow-xs` : ""
            }`}
          >
            <CardContent className="flex items-center justify-between p-4 sm:p-5">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                {isLoading ? (
                  <div className="h-7 w-12 animate-pulse rounded bg-muted mt-1" />
                ) : (
                  <p className={`text-2xl font-bold tracking-tight tabular-nums ${item.valueClass}`}>
                    {item.value.toLocaleString()}
                  </p>
                )}
              </div>
              <div className={`rounded-xl p-3 ${item.bg}`}>
                {item.icon}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
