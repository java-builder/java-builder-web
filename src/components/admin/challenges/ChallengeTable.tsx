"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Edit2, Trash2, Calendar, Eye, Layers, Users, MoreVertical, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChallengeLevel, ChallengeResponse } from "@/types/challenge";

interface ChallengeTableProps {
  challenges: ChallengeResponse[];
  isLoading: boolean;
  onEdit: (challenge: ChallengeResponse) => void;
  onDelete: (id: string, title: string) => void;
  onCreateNew?: () => void;
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

export default function ChallengeTable({
  challenges,
  isLoading,
  onEdit,
  onDelete,
  onCreateNew,
}: ChallengeTableProps) {
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState<{
    id: string;
    challenge: ChallengeResponse;
    top: number;
    right: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const handleClose = () => setOpenMenu(null);
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);
    return () => {
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [openMenu]);

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
              <div className="h-6 bg-muted rounded w-20" />
              <div className="h-6 bg-muted rounded w-24" />
              <div className="h-8 bg-muted rounded w-28" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
          <Layers className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          Chưa có thử thách lập trình nào
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Tạo lộ trình thử thách đầu tiên để học viên có thể rèn luyện kiến thức mỗi ngày.
        </p>
        {onCreateNew && (
          <Button onClick={onCreateNew} variant="accent" size="sm" className="mt-5 gap-1.5">
            + Tạo thử thách mới
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase font-semibold text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-3.5 min-w-[280px]">
                Thử thách
              </th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                Cấp độ
              </th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                Lộ trình
              </th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                Học phí
              </th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                Trạng thái
              </th>
              <th scope="col" className="px-5 py-3.5 text-right whitespace-nowrap">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-normal">
            {challenges.map((c) => {
              const levelCfg =
                LEVEL_CONFIG[c.level as ChallengeLevel] || LEVEL_CONFIG.JUNIOR;
              const isActive = c.status === "ACTIVE";

              return (
                <tr
                  key={c.id}
                  className="hover:bg-muted/30 transition-colors duration-150 group"
                >
                  {/* Name & Metadata */}
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      {/* Gradient preview indicator */}
                      <div
                        className="w-1.5 h-10 rounded-full shrink-0 mt-0.5"
                        style={{
                          background:
                            c.colorGradient ||
                            "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/admin/challenges/${c.id}`}
                            className="font-semibold text-foreground hover:text-accent transition-colors line-clamp-1 text-sm group-hover:underline"
                            title={c.title}
                          >
                            {c.title}
                          </Link>
                          {c.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground border border-border/60">
                              {c.category.name}
                            </span>
                          )}
                        </div>

                        {c.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-1 max-w-lg leading-relaxed">
                            {c.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Level */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${levelCfg.className}`}
                    >
                      {levelCfg.label}
                    </span>
                  </td>

                  {/* Schedule */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-accent" />
                        {c.totalDays} ngày
                      </span>
                      <span className="text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Eye className="h-3 w-3 text-emerald-500" />
                        {c.isFree || !c.price || c.price === 0
                          ? "Toàn bộ miễn phí"
                          : `${c.freePreviewDays ?? 0} ngày miễn phí`}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {c.price && c.price > 0 ? (
                      <span className="font-semibold text-foreground text-sm">
                        {c.price.toLocaleString("vi-VN")} đ
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Miễn phí
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
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
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (openMenu?.id === c.id) {
                          setOpenMenu(null);
                          return;
                        }
                        const rect = e.currentTarget.getBoundingClientRect();
                        const dropdownHeight = 220;
                        const spaceBelow = window.innerHeight - rect.bottom;
                        const showAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
                        setOpenMenu({
                          id: c.id,
                          challenge: c,
                          top: showAbove ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
                          right: Math.max(16, window.innerWidth - rect.right),
                        });
                      }}
                      className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                      title="Thao tác"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {mounted && openMenu && createPortal(
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu(null);
            }}
          />
          <div
            style={{
              position: "fixed",
              top: `${openMenu.top}px`,
              right: `${openMenu.right}px`,
            }}
            className="w-52 bg-card rounded-lg shadow-xl border border-border py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-100"
          >
            <Link
              href={`/admin/challenges/${openMenu.challenge.id}`}
              className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              onClick={() => setOpenMenu(null)}
            >
              <Layers className="w-4 h-4 text-accent" />
              <span>Chi tiết & Lộ trình</span>
            </Link>

            <Link
              href={`/admin/challenges/${openMenu.challenge.id}/enrollments`}
              className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              onClick={() => setOpenMenu(null)}
            >
              <Users className="w-4 h-4 text-blue-500" />
              <span>Danh sách học viên</span>
            </Link>

            {openMenu.challenge.slug && (
              <Link
                href={`/challenges/${openMenu.challenge.slug}`}
                target="_blank"
                className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                onClick={() => setOpenMenu(null)}
              >
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                <span>Xem trang học viên</span>
              </Link>
            )}

            <div className="border-t border-border my-1" />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const target = openMenu.challenge;
                setOpenMenu(null);
                onEdit(target);
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
            >
              <Edit2 className="w-4 h-4 text-muted-foreground" />
              <span>Chỉnh sửa thông tin</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const target = openMenu.challenge;
                setOpenMenu(null);
                onDelete(target.id, target.title);
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa thử thách</span>
            </button>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
