"use client";

import { Layers, Edit2, Trash2, Plus, Calendar } from "lucide-react";
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
      <div className="text-center py-12 bg-card border border-border border-dashed rounded-xl p-8">
        <div className="mx-auto w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-3">
          <Layers className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Chưa có giai đoạn nào</h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
          Phân chia lộ trình thành các giai đoạn giúp học viên dễ theo dõi mục tiêu học tập.
        </p>
        <Button
          variant="accent"
          size="sm"
          onClick={onCreatePhase}
          className="mt-3 text-xs font-medium"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Thêm giai đoạn đầu tiên
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-accent" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            Danh sách giai đoạn ({phases.length})
          </h2>
        </div>
      </div>

      {/* Standard Admin Table */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-medium text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 w-32 whitespace-nowrap">
                  Giai đoạn
                </th>
                <th scope="col" className="px-4 py-3 min-w-[240px]">
                  Tên giai đoạn
                </th>
                <th scope="col" className="px-4 py-3 w-48 whitespace-nowrap">
                  Phạm vi ngày học
                </th>
                <th scope="col" className="px-4 py-3 text-right w-36 whitespace-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {phases.map((phase) => {
                const daysNum =
                  phase.daysNumber && phase.daysNumber.length > 0
                    ? phase.daysNumber
                    : days
                    ? days.filter((d) => d.phaseNumber === phase.phaseNumber).map((d) => d.dayNumber)
                    : [];
                const daysCount = daysNum.length;

                let dayRangeText = "Chưa có ngày";
                if (phase.startDay && phase.endDay) {
                  dayRangeText = `Ngày ${phase.startDay} - ${phase.endDay}`;
                } else if (daysNum.length > 0) {
                  const sortedDays = [...daysNum].sort((a, b) => a - b);
                  dayRangeText = `Ngày ${sortedDays[0]} - ${sortedDays[sortedDays.length - 1]}`;
                }

                return (
                  <tr
                    key={phase.id}
                    className="hover:bg-muted/30 transition-colors duration-150"
                  >
                    {/* Badge Giai đoạn */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-muted text-foreground border border-border/80">
                        Giai đoạn {phase.phaseNumber}
                      </span>
                    </td>

                    {/* Tên giai đoạn */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground text-sm leading-snug">
                        {phase.title}
                      </span>
                    </td>

                    {/* Phạm vi ngày */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span>{dayRangeText}</span>
                        <span className="text-border">•</span>
                        <span>{daysCount} ngày</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditPhase(phase)}
                          className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Chỉnh sửa giai đoạn"
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1" />
                          <span>Sửa</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeletePhase(phase.id, phase.title)}
                          className="h-8 px-2 text-xs font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Xóa giai đoạn"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          <span>Xóa</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
