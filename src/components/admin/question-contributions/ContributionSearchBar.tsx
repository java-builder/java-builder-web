"use client";

import {
  SlidersHorizontal,
  RotateCw,
  LayoutGrid,
  List,
  Clock,
  CheckCircle2,
  XCircle,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

interface ContributionSearchBarProps {
  filterStatus: string;
  onStatusChange: (status: string) => void;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
  isLoading: boolean;
  onRefresh: () => void;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const ContributionSearchBar = ({
  filterStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  isLoading,
  onRefresh,
  stats,
}: ContributionSearchBarProps) => {
  const { t } = useI18n();

  const statusTabs = [
    { value: "ALL", label: t("admin.questionContributions.tabAll"), icon: Layers, count: stats.total },
    { value: "PENDING", label: t("admin.questionContributions.tabPending"), icon: Clock, count: stats.pending, activeColor: "text-amber-500" },
    { value: "APPROVED", label: t("admin.questionContributions.tabApproved"), icon: CheckCircle2, count: stats.approved, activeColor: "text-emerald-500" },
    { value: "REJECTED", label: t("admin.questionContributions.tabRejected"), icon: XCircle, count: stats.rejected, activeColor: "text-rose-500" },
  ];

  return (
    <div className="relative z-20 rounded-xl border border-border bg-card shadow-xs p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-border/80">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
              <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("admin.questionContributions.filterStatus")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-input bg-muted/30 p-1">
            {statusTabs.map((tab) => {
              const isActive = filterStatus === tab.value;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => onStatusChange(tab.value)}
                  className={`flex h-7.5 items-center gap-1.5 px-3 text-xs font-medium rounded-md transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-background text-foreground shadow-xs ring-1 ring-border/80 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 transition-colors ${
                      isActive ? (tab.activeColor || "text-accent") : "text-muted-foreground/70"
                    }`}
                  />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      className={`ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: View Mode Toggle & Refresh Button */}
        <div className="flex items-center gap-2 ml-auto">
          {/* View Mode Switcher */}
          <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/30">
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              title={t("admin.questionContributions.viewModeTable")}
              className={`flex h-7 w-7 items-center justify-center rounded transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-background text-foreground shadow-xs ring-1 ring-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              title={t("admin.questionContributions.viewModeGrid")}
              className={`flex h-7 w-7 items-center justify-center rounded transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs ring-1 ring-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-1.5 h-8 text-xs font-medium cursor-pointer"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{t("admin.questionContributions.refreshBtn")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
