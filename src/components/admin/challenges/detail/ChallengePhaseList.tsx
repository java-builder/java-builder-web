"use client";

import { Layers, Edit2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChallengeDayResponse, ChallengePhaseResponse } from "@/types/challenge";

interface ChallengePhaseListProps {
  phases: ChallengePhaseResponse[];
  days?: ChallengeDayResponse[];
  onCreatePhase: () => void;
  onEditPhase: (phase: ChallengePhaseResponse) => void;
  onDeletePhase: (id: string, title: string) => void;
}

export default function ChallengePhaseList({
  phases,
  days,
  onCreatePhase,
  onEditPhase,
  onDeletePhase,
}: ChallengePhaseListProps) {
  if (phases.length === 0) {
    return (
      <div className="text-center py-16 bg-card border border-border border-dashed rounded-xl p-8">
        <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-3">
          <Layers className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Chưa có giai đoạn nào</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
          Phân chia lộ trình thành các giai đoạn giúp học viên có đích đến cụ thể sau mỗi chặng đường học tập.
        </p>
        <Button
          variant="accent"
          size="sm"
          onClick={onCreatePhase}
          className="mt-4 text-xs font-semibold"
        >
          Tạo giai đoạn đầu tiên
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Layers className="h-4 w-4 text-accent" />
          <span>Danh sách giai đoạn ({phases.length})</span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onCreatePhase}
          className="gap-2 cursor-pointer font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm giai đoạn</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {phases.map((phase) => (
          <div
            key={phase.id}
            className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-accent/40 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-accent/10 text-accent border border-accent/20">
                  Giai đoạn {phase.phaseNumber}
                </span>
                {(phase.days || days) && (
                  <span className="text-xs text-muted-foreground font-medium">
                    {phase.days?.length ??
                      days?.filter((d) => d.phaseNumber === phase.phaseNumber).length ??
                      0}{" "}
                    ngày học
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-foreground leading-snug">{phase.title}</h3>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditPhase(phase)}
                className="h-8 gap-1 text-xs"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Chỉnh sửa</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeletePhase(phase.id, phase.title)}
                className="h-8 gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Xóa</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
