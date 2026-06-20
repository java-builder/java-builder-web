"use client";

import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseEditHeaderProps {
  courseTitle?: string;
  isSaving: boolean;
  onSave: () => void;
}

export default function CourseEditHeader({
  courseTitle,
  isSaving,
  onSave,
}: CourseEditHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/courses" 
          className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors border border-border/40"
          title="Quay lại danh sách khóa học"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Chỉnh sửa khóa học
          </h1>
          <p className="text-sm text-muted-foreground">
            {courseTitle || "Đang tải thông tin..."}
          </p>
        </div>
      </div>
      <Button
        variant="accent"
        onClick={onSave}
        disabled={isSaving}
        className="gap-2 font-medium"
      >
        {isSaving ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        Lưu thay đổi
      </Button>
    </div>
  );
}
