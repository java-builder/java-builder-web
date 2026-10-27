"use client";

import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChallengeResponse } from "@/types/challenge";

interface ChallengeDetailHeaderProps {
  challenge: ChallengeResponse;
  phasesCount: number;
  daysCount: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function ChallengeDetailHeader({
  challenge,
  phasesCount,
  daysCount,
  onRefresh,
  isRefreshing = false,
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
            className="gap-2 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Link href={`/admin/challenges/${challenge.id}/enrollments`}>
            <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
              <Users className="h-4 w-4 text-accent" />
              <span>Học viên</span>
            </Button>
          </Link>

          <Link href={`/challenges/${challenge.slug}`} target="_blank">
            <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
              <ExternalLink className="h-4 w-4" />
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
              {challenge.title}
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
              <span className="text-[11px] text-muted-foreground font-medium block">Giai đoạn</span>
              <p className="text-lg font-bold text-foreground mt-0.5">{phasesCount} giai đoạn</p>
            </div>
            <div className="p-3 bg-muted/30 border border-border rounded-xl min-w-[90px]">
              <span className="text-[11px] text-muted-foreground font-medium block">Đã soạn</span>
              <p className="text-lg font-bold text-accent mt-0.5">{daysCount} ngày</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
