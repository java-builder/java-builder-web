"use client";

import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChallengeDayResponse,
  ChallengeTaskResponse,
} from "@/types/challenge";
import ChallengeDayItem from "./ChallengeDayItem";

interface ChallengeDayListProps {
  days: ChallengeDayResponse[];
  onCreateDay: () => void;
  onEditDay: (day: ChallengeDayResponse) => void;
  onDeleteDay: (id: string, dayNumber: number, title: string) => void;
  onCreateTask: (dayInfo: { id: string; dayNumber: number }) => void;
  onEditTask: (dayInfo: { id: string; dayNumber: number }, task: ChallengeTaskResponse) => void;
  onDeleteTask: (taskId: string, title: string, onDone: () => void) => void;
}

export default function ChallengeDayList({
  days,
  onCreateDay,
  onEditDay,
  onDeleteDay,
  onCreateTask,
  onEditTask,
  onDeleteTask,
}: ChallengeDayListProps) {
  if (days.length === 0) {
    return (
      <div className="text-center py-16 bg-card border border-border border-dashed rounded-xl p-8">
        <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-3">
          <Calendar className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Chưa có ngày thử thách nào</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
          Tạo các ngày thử thách để giao bài học và bài tập hàng ngày cho học viên theo dõi.
        </p>
        <Button
          variant="accent"
          size="sm"
          onClick={onCreateDay}
          className="mt-4 text-xs font-semibold"
        >
          Thêm Ngày 1 ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-accent" />
          <span>Lộ trình theo ngày ({days.length} ngày)</span>
        </h2>
        <Button
          variant="accent"
          size="sm"
          onClick={onCreateDay}
          className="gap-2 cursor-pointer font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm ngày học</span>
        </Button>
      </div>

      <div className="space-y-4">
        {days.map((day) => (
          <ChallengeDayItem
            key={day.id}
            day={day}
            onEditDay={onEditDay}
            onDeleteDay={onDeleteDay}
            onCreateTask={onCreateTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}
