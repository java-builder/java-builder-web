"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Layers,
  Plus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChallengeResponse } from "@/types/challenge";

interface ChallengeDetailHeaderProps {
  challenge: ChallengeResponse;
  phasesCount: number;
  daysCount: number;
  activeTab: "days" | "phases";
  onTabChange: (tab: "days" | "phases") => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onCreatePhase: () => void;
  onCreateDay: () => void;
}

export default function ChallengeDetailHeader({
  challenge,
  phasesCount,
  daysCount,
  activeTab,
  onTabChange,
  onRefresh,
  isRefreshing = false,
  onCreatePhase,
  onCreateDay,
}: ChallengeDetailHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/admin/challenges"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quản lý Thử thách Lập trình</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="gap-1.5 h-8 text-xs font-semibold"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Link href={`/challenges/${challenge.slug}`} target="_blank">
            <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs font-semibold">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Xem trang học viên</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Challenge Header Card */}
      <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        {/* Top Banner Gradient */}
        <div
          className="h-2.5 w-full"
          style={{
            background:
              challenge.colorGradient || "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          }}
        />

        <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-accent/10 text-accent border border-accent/20">
                {challenge.level}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                  challenge.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    challenge.status === "ACTIVE" ? "bg-emerald-500" : "bg-muted-foreground"
                  }`}
                />
                {challenge.status === "ACTIVE" ? "Đang mở" : "Tạm ẩn"}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                /{challenge.slug}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
              {challenge.name}
            </h1>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed max-w-3xl">
              {challenge.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shrink-0">
            <div className="p-3 bg-muted/30 border border-border rounded-xl min-w-[90px]">
              <span className="text-[11px] text-muted-foreground font-medium block">Tổng ngày</span>
              <p className="text-lg font-bold text-foreground mt-0.5">{challenge.totalDays} ngày</p>
            </div>
            <div className="p-3 bg-muted/30 border border-border rounded-xl min-w-[90px]">
              <span className="text-[11px] text-muted-foreground font-medium block">Học thử</span>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {challenge.freePreviewDays} ngày
              </p>
            </div>
            <div className="p-3 bg-muted/30 border border-border rounded-xl min-w-[90px]">
              <span className="text-[11px] text-muted-foreground font-medium block">Chặng</span>
              <p className="text-lg font-bold text-foreground mt-0.5">{phasesCount} chặng</p>
            </div>
            <div className="p-3 bg-muted/30 border border-border rounded-xl min-w-[90px]">
              <span className="text-[11px] text-muted-foreground font-medium block">Đã soạn</span>
              <p className="text-lg font-bold text-accent mt-0.5">{daysCount} ngày</p>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3.5 bg-muted/20 border-t border-border flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onTabChange("days")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === "days"
                  ? "bg-accent text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Lộ trình theo ngày ({daysCount})</span>
            </button>
            <button
              type="button"
              onClick={() => onTabChange("phases")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === "phases"
                  ? "bg-accent text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Chặng kiến trúc ({phasesCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCreatePhase}
              className="gap-1.5 h-8 text-xs font-semibold"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Thêm chặng</span>
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={onCreateDay}
              className="gap-1.5 h-8 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm thử thách ngày</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
