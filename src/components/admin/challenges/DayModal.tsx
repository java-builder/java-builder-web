"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Calendar, Sparkles, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSelect, SelectOption } from "@/components/ui/CustomSelect";
import {
  ChallengeDayResponse,
  ChallengePhaseResponse,
  CreateChallengeDayRequest,
  UpdateChallengeDayRequest,
} from "@/types/challenge";

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateChallengeDayRequest | UpdateChallengeDayRequest) => Promise<void>;
  initialData?: ChallengeDayResponse | null;
  challengeId: string;
  phases: ChallengePhaseResponse[];
  nextDayNumber: number;
}

export default function DayModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  challengeId,
  phases,
  nextDayNumber,
}: DayModalProps) {
  const isEdit = Boolean(initialData);

  const [dayNumber, setDayNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [coreMission, setCoreMission] = useState("");
  const [whyLearn, setWhyLearn] = useState("");
  const [content, setContent] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [keyConceptsText, setKeyConceptsText] = useState("");
  const [tasksList, setTasksList] = useState<string[]>([""]);
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setDayNumber(initialData.dayNumber);
      setTitle(initialData.title || "");
      setCoreMission(initialData.coreMission || "");
      setWhyLearn(initialData.whyLearn || "");
      setContent(initialData.content || "");
      const matchedPhase = phases.find((p) => p.phaseNumber === initialData.phaseNumber);
      setPhaseId(matchedPhase?.id || "");
      setKeyConceptsText(initialData.keyConcepts?.join(", ") || "");
      setTasksList(
        initialData.tasks && initialData.tasks.length > 0
          ? initialData.tasks.map((t) => t.title)
          : [""]
      );
      setIsFreePreview(Boolean(initialData.freePreview ?? initialData.isFreePreview));
    } else {
      setDayNumber(nextDayNumber);
      setTitle("");
      setCoreMission("");
      setWhyLearn("");
      setContent("");
      setKeyConceptsText("");
      setTasksList([""]);
      setPhaseId(phases.length > 0 ? phases[0].id : "");
      setIsFreePreview(nextDayNumber <= 3);
    }
  }, [initialData, isOpen, nextDayNumber, phases]);

  if (!isOpen) return null;

  const phaseOptions: SelectOption[] = [
    { value: "", label: "-- Không thuộc chặng nào --" },
    ...phases.map((p) => ({
      value: p.id,
      label: `Chặng ${p.phaseNumber}: ${p.title}`,
    })),
  ];

  const handleAddTask = () => {
    setTasksList([...tasksList, ""]);
  };

  const handleTaskChange = (index: number, val: string) => {
    const updated = [...tasksList];
    updated[index] = val;
    setTasksList(updated);
  };

  const handleRemoveTask = (index: number) => {
    setTasksList(tasksList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !coreMission.trim()) return;

    try {
      setIsSubmitting(true);

      const parsedKeyConcepts = keyConceptsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const validTasks = tasksList.map((t) => t.trim()).filter(Boolean);

      if (isEdit) {
        await onSubmit({
          challengePhaseId: phaseId || undefined,
          dayNumber,
          title: title.trim(),
          coreMission: coreMission.trim(),
          content: content.trim() || coreMission.trim(),
          whyLearn: whyLearn.trim() || coreMission.trim(),
          keyConcepts: parsedKeyConcepts.length > 0 ? parsedKeyConcepts : undefined,
          isFreePreview,
        } as UpdateChallengeDayRequest);
      } else {
        await onSubmit({
          challengeId,
          challengePhaseId: phaseId || undefined,
          dayNumber,
          title: title.trim(),
          coreMission: coreMission.trim(),
          content: content.trim() || coreMission.trim(),
          whyLearn: whyLearn.trim() || coreMission.trim(),
          keyConcepts: parsedKeyConcepts.length > 0 ? parsedKeyConcepts : undefined,
          tasks: validTasks.length > 0 ? validTasks : undefined,
          isFreePreview,
        } as CreateChallengeDayRequest);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEdit
                  ? `Chỉnh sửa Thử thách Ngày ${dayNumber}`
                  : `Thêm Thử thách Ngày ${dayNumber} mới`}
              </h2>
              <p className="text-xs text-muted-foreground">
                Thiết lập nhiệm vụ và nội dung bài học thử thách theo ngày
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Grid 2 cột: Số ngày & Chặng kiến trúc */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Số ngày thử thách (Day Number) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min={1}
                required
                value={dayNumber}
                onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
                className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Thuộc chặng kiến trúc (Phase)
              </label>
              <CustomSelect
                value={phaseId}
                onChange={(val) => setPhaseId(String(val))}
                options={phaseOptions}
                placeholder="Chọn chặng"
              />
            </div>
          </div>

          {/* Tên thử thách trong ngày */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Tiêu đề bài học <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cấu hình Spring Boot và kết nối PostgreSQL"
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
          </div>

          {/* Nhiệm vụ cốt lõi (Core Mission) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Mục tiêu chính của bài (Core Mission) <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={coreMission}
              onChange={(e) => setCoreMission(e.target.value)}
              placeholder="VD: Khởi tạo project và kết nối thành công với PostgreSQL."
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground resize-none"
            />
          </div>

          {/* Tại sao cần học (Why Learn) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Tại sao cần học bài này? (Why Learn)
            </label>
            <textarea
              rows={2}
              value={whyLearn}
              onChange={(e) => setWhyLearn(e.target.value)}
              placeholder="VD: Làm backend thì phải lưu dữ liệu vào database thật ngay từ đầu."
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground resize-none"
            />
          </div>

          {/* Nội dung bài học (Content) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Nội dung hướng dẫn (Markdown)
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập kiến thức trọng tâm, ghi chú kiến trúc hoặc hướng dẫn các bước thực hành..."
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-mono"
            />
          </div>

          {/* Khái niệm then chốt (Key Concepts) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Khái niệm then chốt (Cách nhau bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={keyConceptsText}
              onChange={(e) => setKeyConceptsText(e.target.value)}
              placeholder="VD: JVM, JDK, Bytecode, ClassLoader, JIT"
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
          </div>

          {/* Danh sách nhiệm vụ ban đầu (khi tạo mới) */}
          {!isEdit && (
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Checklist bài tập / nhiệm vụ trong ngày
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTask}
                  className="h-7 text-xs gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Thêm nhiệm vụ</span>
                </Button>
              </div>

              <div className="space-y-2">
                {tasksList.map((taskText, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground w-6 text-center">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={taskText}
                      onChange={(e) => handleTaskChange(idx, e.target.value)}
                      placeholder={`Nhiệm vụ ${idx + 1}: VD: Cài đặt JDK 21 và kiểm tra javac`}
                      className="flex-1 flex h-9 rounded-lg border border-input bg-transparent px-3 py-1 text-xs shadow-xs placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    />
                    {tasksList.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTask(idx)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Học thử miễn phí */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground">
                Học thử miễn phí (Free Preview)
              </p>
              <p className="text-[11px] text-muted-foreground">
                Cho phép học viên chưa mua có thể truy cập ngày này
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isFreePreview}
                onChange={(e) => setIsFreePreview(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting}
              className="gap-2 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{isEdit ? "Cập nhật ngày" : "Tạo thử thách ngày"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
