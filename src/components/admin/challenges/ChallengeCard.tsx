"use client";

import Link from "next/link";
import {
  Edit2,
  Trash2,
  Calendar,
  Eye,
  CreditCard,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChallengeLevel, ChallengeResponse } from "@/types/challenge";

interface ChallengeCardProps {
  challenge: ChallengeResponse;
  onEdit: (challenge: ChallengeResponse) => void;
  onDelete: (id: string, name: string) => void;
}

const LEVEL_CONFIG: Record<
  ChallengeLevel,
  { label: string; className: string }
> = {
  INTERN: {
    label: "Intern",
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
  },
  FRESHER: {
    label: "Fresher",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  JUNIOR: {
    label: "Junior",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  },
  MIDDLE: {
    label: "Middle",
    className:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300",
  },
  SENIOR: {
    label: "Senior",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
  },
};

export default function ChallengeCard({
  challenge,
  onEdit,
  onDelete,
}: ChallengeCardProps) {
  const levelCfg =
    LEVEL_CONFIG[challenge.level as ChallengeLevel] || LEVEL_CONFIG.JUNIOR;
  const isActive = challenge.status === "ACTIVE";

  return (
    <div className="group relative bg-card border border-border rounded-xl shadow-xs hover:shadow-md hover:border-accent/40 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* Top Accent Gradient Bar */}
      <div
        className="h-1.5 w-full shrink-0"
        style={{
          background:
            challenge.colorGradient ||
            "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        }}
      />

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Badges & Status */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${levelCfg.className}`}
              >
                {levelCfg.label}
              </span>
              {challenge.category && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border/60">
                  {challenge.category.name}
                </span>
              )}
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-muted-foreground"
                }`}
              />
              {isActive ? "Đang mở" : "Tạm ẩn"}
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/admin/challenges/${challenge.id}`}
            className="block group-hover:text-accent transition-colors"
          >
            <h3
              className="text-base font-bold text-foreground line-clamp-2 leading-snug tracking-tight"
              title={challenge.name}
            >
              {challenge.name}
            </h3>
          </Link>

          {/* Description */}
          {challenge.description && (
            <p className="mt-2.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {challenge.description}
            </p>
          )}
        </div>

        {/* Clean Metrics Strip */}
        <div className="mt-4 pt-3.5 border-t border-border/80 grid grid-cols-3 divide-x divide-border/60 text-center">
          <div className="px-1">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center justify-center gap-1 tracking-wider">
              <Calendar className="h-3 w-3 text-accent" /> Lộ trình
            </span>
            <p className="text-xs font-bold text-foreground mt-1">
              {challenge.totalDays} ngày
            </p>
          </div>

          <div className="px-1">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center justify-center gap-1 tracking-wider">
              <Eye className="h-3 w-3 text-emerald-500" /> Miễn phí
            </span>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {challenge.freePreviewDays ?? 0} ngày
            </p>
          </div>

          <div className="px-1">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center justify-center gap-1 tracking-wider">
              <CreditCard className="h-3 w-3 text-muted-foreground" /> Giá bán
            </span>
            <p className="text-xs font-bold text-foreground mt-1 truncate">
              {challenge.price && challenge.price > 0
                ? `${challenge.price.toLocaleString("vi-VN")} đ`
                : "Miễn phí"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 py-3 bg-muted/20 border-t border-border flex items-center justify-between gap-2">
        <Link href={`/admin/challenges/${challenge.id}`} className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs font-semibold gap-1.5 justify-center hover:border-accent hover:text-accent hover:bg-accent/5 cursor-pointer"
          >
            <Layers className="h-3.5 w-3.5 text-accent" />
            <span>Chi tiết & Lộ trình</span>
            <ArrowRight className="h-3 w-3 opacity-60 ml-auto" />
          </Button>
        </Link>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(challenge)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Chỉnh sửa thử thách"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(challenge.id, challenge.name)}
            className="h-8 w-8 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            title="Xóa thử thách"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
