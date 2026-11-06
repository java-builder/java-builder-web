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
  Users,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChallengeLevel, ChallengeResponse } from "@/types/challenge";

interface ChallengeCardProps {
  challenge: ChallengeResponse;
  onEdit: (challenge: ChallengeResponse) => void;
  onDelete: (id: string, title: string) => void;
  onEnroll?: (challengeId: string, challengeTitle: string) => void;
}

const LEVEL_CONFIG: Record<
  ChallengeLevel,
  { label: string; className: string; dot: string }
> = {
  INTERN: {
    label: "Intern",
    className:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300",
    dot: "bg-slate-400",
  },
  FRESHER: {
    label: "Fresher",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  JUNIOR: {
    label: "Junior",
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  MIDDLE: {
    label: "Middle",
    className:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  SENIOR: {
    label: "Senior",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

export default function ChallengeCard({
  challenge,
  onEdit,
  onDelete,
  onEnroll,
}: ChallengeCardProps) {
  const levelCfg =
    LEVEL_CONFIG[challenge.level as ChallengeLevel] || LEVEL_CONFIG.JUNIOR;
  const isActive = challenge.status === "ACTIVE";
  const isFree =
    Boolean(challenge.isFree) ||
    challenge.price === undefined ||
    challenge.price === null ||
    Number(challenge.price) <= 0;

  return (
    <article className="group relative bg-surface border border-border rounded-2xl shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* Visual Gradient Banner Header */}
      <div
        className="relative px-5 pt-4 pb-4 text-white overflow-hidden border-b border-black/10"
        style={{
          background:
            challenge.colorGradient ||
            "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_55%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/5"
        />

        {/* Top Row: Category + Status */}
        <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {challenge.category ? (
              <span className="inline-flex items-center rounded-md bg-black/30 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white border border-white/15">
                {challenge.category.name}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-black/30 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white border border-white/15">
                Thử thách
              </span>
            )}
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md border ${
              isActive
                ? "bg-emerald-500/25 text-white border-emerald-300/40"
                : "bg-black/40 text-white/85 border-white/20"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-emerald-300" : "bg-white/60"
              }`}
            />
            {isActive ? "Đang mở" : "Tạm ẩn"}
          </span>
        </div>

        {/* Title inside Banner */}
        <Link
          href={`/admin/challenges/${challenge.id}`}
          className="relative z-10 block"
        >
          <h3
            className="text-base font-extrabold text-white line-clamp-2 leading-snug drop-shadow-xs group-hover:underline"
            title={challenge.title}
          >
            {challenge.title}
          </h3>
        </Link>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Level & Public link row */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${levelCfg.className}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${levelCfg.dot}`} />
              {levelCfg.label}
            </span>

            {challenge.slug && (
              <Link
                href={`/challenges/${challenge.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                title="Xem trang học viên"
              >
                <span>Xem trang public</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.25rem]">
            {challenge.description || "Chưa có mô tả cho lộ trình thử thách này."}
          </p>
        </div>

        {/* Metrics Strip */}
        <div className="rounded-xl border border-border bg-muted/25 p-3 grid grid-cols-3 divide-x divide-border text-center">
          <div className="px-1">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center justify-center gap-1 tracking-wider">
              <Calendar className="h-3 w-3 text-primary" /> Lộ trình
            </span>
            <p className="text-xs font-bold text-foreground mt-1 tabular-nums">
              {challenge.totalDays} ngày
            </p>
          </div>

          <div className="px-1">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center justify-center gap-1 tracking-wider">
              <Eye className="h-3 w-3 text-emerald-500" /> Học thử
            </span>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              {isFree ? "Toàn bộ" : `${challenge.freePreviewDays ?? 0} ngày`}
            </p>
          </div>

          <div className="px-1">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center justify-center gap-1 tracking-wider">
              <CreditCard className="h-3 w-3 text-muted-foreground" /> Học phí
            </span>
            <p className="text-xs font-bold text-foreground mt-1 truncate tabular-nums">
              {!isFree && challenge.price
                ? `${challenge.price.toLocaleString("vi-VN")} đ`
                : "Miễn phí"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 py-3.5 bg-muted/20 border-t border-border flex items-center justify-between gap-2">
        <Link href={`/admin/challenges/${challenge.id}`} className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8.5 text-xs font-semibold gap-1.5 justify-center bg-primary-soft/60 border-primary/25 text-primary hover:bg-primary hover:text-white rounded-full cursor-pointer transition-all"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Quản lý lộ trình</span>
            <ArrowRight className="h-3 w-3 ml-0.5" />
          </Button>
        </Link>

        <div className="flex items-center gap-1 shrink-0">
          <Link href={`/admin/challenges/${challenge.id}/enrollments`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8.5 w-8.5 p-0 text-muted-foreground hover:text-primary border-border rounded-full cursor-pointer"
              title="Danh sách học viên tham gia"
            >
              <Users className="h-3.5 w-3.5" />
            </Button>
          </Link>

          {onEnroll && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEnroll(challenge.id, challenge.title)}
              className="h-8.5 w-8.5 p-0 text-muted-foreground hover:text-emerald-600 border-border rounded-full cursor-pointer"
              title="Ghi danh học viên vào thử thách"
            >
              <UserPlus className="h-3.5 w-3.5" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(challenge)}
            className="h-8.5 w-8.5 p-0 text-muted-foreground hover:text-foreground border-border rounded-full cursor-pointer"
            title="Chỉnh sửa thông tin thử thách"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(challenge.id, challenge.title)}
            className="h-8.5 w-8.5 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10 border-destructive/20 rounded-full cursor-pointer"
            title="Xóa thử thách"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}
