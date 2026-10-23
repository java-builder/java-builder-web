"use client";

import { useState, useEffect } from "react";
import {
  X,
  Loader2,
  Calendar,
  Plus,
  Trash2,
  Link2,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSelect, SelectOption } from "@/components/ui/CustomSelect";
import {
  ChallengeDayResponse,
  ChallengePhaseResponse,
  CreateChallengeDayRequest,
  UpdateChallengeDayRequest,
  TaskResourceLink,
  TaskLinkType,
  ChallengeDayTaskRequest,
  TASK_LINK_TYPE_CONFIG,
  TASK_LINK_TITLE_PRESETS,
  TASK_LINK_TITLE_PRESET_KEYS,
} from "@/types/challenge";
import { useI18n, TranslationKey } from "@/contexts/I18nContext";

interface TaskDraft {
  title: string;
  resourceLinks: TaskResourceLink[];
  isExpanded?: boolean;
}

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
  const { t } = useI18n();
  const isEdit = Boolean(initialData);

  const [dayNumber, setDayNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [coreMission, setCoreMission] = useState("");
  const [whyLearn, setWhyLearn] = useState("");
  const [content, setContent] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [keyConceptsText, setKeyConceptsText] = useState("");
  const [tasks, setTasks] = useState<TaskDraft[]>([{ title: "", resourceLinks: [], isExpanded: false }]);
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
      if (initialData.tasks && initialData.tasks.length > 0) {
        setTasks(
          initialData.tasks.map((t) => ({
            title: t.title,
            resourceLinks: t.resourceLinks || [],
            isExpanded: (t.resourceLinks && t.resourceLinks.length > 0) || false,
          }))
        );
      } else {
        setTasks([{ title: "", resourceLinks: [], isExpanded: false }]);
      }
      setIsFreePreview(Boolean(initialData.freePreview ?? initialData.isFreePreview));
    } else {
      setDayNumber(nextDayNumber);
      setTitle("");
      setCoreMission("");
      setWhyLearn("");
      setContent("");
      setKeyConceptsText("");
      setTasks([{ title: "", resourceLinks: [], isExpanded: false }]);
      setPhaseId(phases.length > 0 ? phases[0].id : "");
      setIsFreePreview(false);
    }
  }, [initialData, isOpen, nextDayNumber, phases]);

  if (!isOpen) return null;

  const phaseOptions: SelectOption[] = [
    { value: "", label: "-- Không thuộc giai đoạn nào --" },
    ...phases.map((p) => ({
      value: p.id,
      label: `Giai đoạn ${p.phaseNumber}: ${p.title}`,
    })),
  ];

  const linkTypeOptions: SelectOption[] = (
    Object.keys(TASK_LINK_TYPE_CONFIG) as TaskLinkType[]
  ).map((typeKey) => {
    const m = TASK_LINK_TYPE_CONFIG[typeKey];
    return {
      value: typeKey,
      label: t(`taskResourceLinks.types.${typeKey}` as TranslationKey) || m.label,
      badge: (
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight uppercase leading-none shadow-xs shrink-0 ${m.badgeClass}`}
        >
          {m.badgeLabel}
        </span>
      ),
    };
  });

  const getTitleOptions = (meta: { badgeLabel: string }): SelectOption[] => [
    {
      value: "",
      label: t("taskResourceLinks.ui.defaultOption" as TranslationKey).replace(
        "{type}",
        meta.badgeLabel
      ),
    },
    ...TASK_LINK_TITLE_PRESET_KEYS.map((k) => {
      const presetVal = t(`taskResourceLinks.presets.${k}` as TranslationKey);
      return {
        value: presetVal,
        label: presetVal,
      };
    }),
    {
      value: "__custom__",
      label: t("taskResourceLinks.ui.customOption" as TranslationKey),
    },
  ];

  const handleAddTask = () => {
    setTasks((prev) => [...prev, { title: "", resourceLinks: [], isExpanded: false }]);
  };

  const handleTaskTitleChange = (index: number, val: string) => {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, title: val } : t))
    );
  };

  const handleRemoveTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleTaskExpand = (index: number) => {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, isExpanded: !t.isExpanded } : t))
    );
  };

  const handleAddLinkToTask = (taskIndex: number) => {
    setTasks((prev) =>
      prev.map((t, i) =>
        i === taskIndex
          ? {
              ...t,
              isExpanded: true,
              resourceLinks: [
                ...t.resourceLinks,
                { type: "OFFICIAL", title: "", url: "" },
              ],
            }
          : t
      )
    );
  };

  const handleUpdateTaskLink = (
    taskIndex: number,
    linkIndex: number,
    field: keyof TaskResourceLink,
    value: string
  ) => {
    setTasks((prev) =>
      prev.map((t, i) => {
        if (i !== taskIndex) return t;
        const updatedLinks = t.resourceLinks.map((l, li) =>
          li === linkIndex ? { ...l, [field]: value } : l
        );
        return { ...t, resourceLinks: updatedLinks };
      })
    );
  };

  const handleRemoveTaskLink = (taskIndex: number, linkIndex: number) => {
    setTasks((prev) =>
      prev.map((t, i) => {
        if (i !== taskIndex) return t;
        return {
          ...t,
          resourceLinks: t.resourceLinks.filter((_, li) => li !== linkIndex),
        };
      })
    );
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

      const validTasks: ChallengeDayTaskRequest[] = tasks
        .map((t) => ({
          title: t.title.trim(),
          resourceLinks: (t.resourceLinks || [])
            .map((l) => ({
              type: l.type || ("OFFICIAL" as TaskLinkType),
              title: (l.title || "").trim(),
              url: (l.url || "").trim(),
            }))
            .filter((l) => l.url.length > 0),
        }))
        .filter((t) => t.title.length > 0);

      if (isEdit) {
        await onSubmit({
          challengePhaseId: phaseId || undefined,
          dayNumber,
          title: title.trim(),
          coreMission: coreMission.trim(),
          content: content.trim() || coreMission.trim(),
          whyLearn: whyLearn.trim() || coreMission.trim(),
          keyConcepts: parsedKeyConcepts.length > 0 ? parsedKeyConcepts : undefined,
          tasks: validTasks,
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
      <div className="bg-card border border-border w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEdit ? `Chỉnh sửa Ngày ${dayNumber}` : "Thêm ngày thử thách mới"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Thiết lập lộ trình học và bài tập thực hành theo từng ngày
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Day number & Phase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Thứ tự ngày (Day Number) <span className="text-destructive">*</span>
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
                Giai đoạn (Phase)
              </label>
              <CustomSelect
                options={phaseOptions}
                value={phaseId}
                onChange={setPhaseId}
                placeholder="Chọn giai đoạn..."
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Tiêu đề bài học <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cài đặt môi trường & Viết chương trình Java đầu tiên"
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
          </div>

          {/* Core Mission */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Nhiệm vụ cốt lõi (Core Mission) <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={coreMission}
              onChange={(e) => setCoreMission(e.target.value)}
              placeholder="Tóm tắt 1-2 câu về mục tiêu phải đạt được trong ngày này..."
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground resize-none"
            />
          </div>

          {/* Why Learn */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Tại sao cần học bài này? (Why Learn)
            </label>
            <textarea
              rows={2}
              value={whyLearn}
              onChange={(e) => setWhyLearn(e.target.value)}
              placeholder="Lý giải tại sao kiến thức này quan trọng khi phỏng vấn hoặc đi làm thực tế..."
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground resize-none"
            />
          </div>

          {/* Content (Markdown) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Nội dung hướng dẫn chi tiết (Hỗ trợ Markdown)
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung lý thuyết, hướng dẫn từng bước, code mẫu bằng cú pháp Markdown..."
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs font-mono transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground resize-y"
            />
          </div>

          {/* Key Concepts */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Khái niệm then chốt (Key Concepts - phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={keyConceptsText}
              onChange={(e) => setKeyConceptsText(e.target.value)}
              placeholder="VD: JVM, JDK, Bytecode, ClassLoader, JIT"
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
          </div>

          {/* Checklist bài tập / nhiệm vụ trong ngày */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  <span>Checklist bài tập / nhiệm vụ trong ngày ({tasks.length})</span>
                </label>
                <p className="text-[11px] text-muted-foreground">
                  Mỗi nhiệm vụ có thể đính kèm tài liệu docs hoặc video YouTube để học viên tham khảo.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTask}
                className="h-7 text-xs gap-1 cursor-pointer shrink-0"
              >
                <Plus className="h-3 w-3" />
                <span>Thêm nhiệm vụ</span>
              </Button>
            </div>

            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-3 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-muted-foreground w-6 text-center shrink-0">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => handleTaskTitleChange(idx, e.target.value)}
                      placeholder={`Nhiệm vụ ${idx + 1}: VD: Cài đặt JDK 25 và kết nối PostgreSQL`}
                      className="flex-1 flex h-10 rounded-lg border border-input bg-card px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    />

                    {/* Button to toggle links / add link */}
                    <button
                      type="button"
                      onClick={() => {
                        if (task.resourceLinks.length === 0) {
                          handleAddLinkToTask(idx);
                        } else {
                          handleToggleTaskExpand(idx);
                        }
                      }}
                      className={`h-10 px-3 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                        task.resourceLinks.length > 0
                          ? "bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
                          : "bg-card border-input text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      title={
                        task.resourceLinks.length > 0
                          ? "Đóng/mở danh sách link tham khảo"
                          : "Thêm link tài liệu / video cho nhiệm vụ này"
                      }
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>{task.resourceLinks.length > 0 ? `Link (${task.resourceLinks.length})` : "+ Link"}</span>
                      {task.resourceLinks.length > 0 && (
                        task.isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </button>

                    {tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(idx)}
                        className="h-10 w-10 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition cursor-pointer shrink-0"
                        title="Xóa nhiệm vụ này"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Resource Links Drawer / Expanded List */}
                  {(task.isExpanded || task.resourceLinks.length > 0) && (
                    <div className="ml-8 pl-3.5 border-l-2 border-accent/40 pt-2 pb-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          {t("taskResourceLinks.ui.sectionTitle" as TranslationKey)} ({task.resourceLinks.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddLinkToTask(idx)}
                          className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer py-0.5"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t("taskResourceLinks.ui.addLink" as TranslationKey)}</span>
                        </button>
                      </div>

                      {task.resourceLinks.map((link, lIdx) => {
                        const meta =
                          TASK_LINK_TYPE_CONFIG[link.type] ||
                          TASK_LINK_TYPE_CONFIG.OFFICIAL;
                        const isPreset =
                          TASK_LINK_TITLE_PRESETS.some((p) => p === link.title) ||
                          TASK_LINK_TITLE_PRESET_KEYS.some(
                            (k) => t(`taskResourceLinks.presets.${k}` as TranslationKey) === link.title
                          );
                        const isDefault = !link.title;
                        const isCustom = !isDefault && !isPreset;

                        return (
                          <div
                            key={lIdx}
                            className="space-y-1.5"
                          >
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              {/* Type CustomSelect */}
                              <div className="w-full sm:w-[190px] shrink-0">
                                <CustomSelect
                                  size="sm"
                                  triggerClassName="h-8 text-xs font-semibold"
                                  value={link.type}
                                  onChange={(val) =>
                                    handleUpdateTaskLink(
                                      idx,
                                      lIdx,
                                      "type",
                                      val as TaskLinkType
                                    )
                                  }
                                  options={linkTypeOptions}
                                  className="w-full"
                                />
                              </div>

                              {/* Title CustomSelect */}
                              <div className="w-full sm:w-[230px] shrink-0">
                                <CustomSelect
                                  size="sm"
                                  triggerClassName="h-8 text-xs"
                                  value={isCustom ? "__custom__" : (link.title || "")}
                                  onChange={(val) => {
                                    if (val === "__custom__") {
                                      handleUpdateTaskLink(
                                        idx,
                                        lIdx,
                                        "title",
                                        link.title && !isPreset
                                          ? link.title
                                          : t("taskResourceLinks.ui.customPlaceholder" as TranslationKey)
                                      );
                                    } else {
                                      handleUpdateTaskLink(idx, lIdx, "title", String(val));
                                    }
                                  }}
                                  options={getTitleOptions(meta)}
                                  className="w-full"
                                />
                              </div>

                              {/* URL Input */}
                              <div className="flex-1 min-w-[180px]">
                                <input
                                  type="url"
                                  value={link.url}
                                  onChange={(e) =>
                                    handleUpdateTaskLink(idx, lIdx, "url", e.target.value)
                                  }
                                  placeholder="https://..."
                                  className="w-full h-8 rounded-md border border-input bg-background/50 px-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 font-mono shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                              </div>

                              {/* Delete Link Button */}
                              <div className="shrink-0 flex items-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTaskLink(idx, lIdx)}
                                  className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                                  title={t("taskResourceLinks.ui.deleteTitle" as TranslationKey)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Show custom title input if __custom__ selected */}
                            {isCustom && (
                              <div className="flex items-center gap-2 pl-0.5">
                                <span className="text-[11px] text-muted-foreground shrink-0 font-medium">
                                  {t("taskResourceLinks.ui.customLabel" as TranslationKey)}:
                                </span>
                                <input
                                  type="text"
                                  value={link.title || ""}
                                  onChange={(e) =>
                                    handleUpdateTaskLink(idx, lIdx, "title", e.target.value)
                                  }
                                  placeholder={t("taskResourceLinks.ui.customPlaceholder" as TranslationKey)}
                                  className="flex-1 h-8 rounded-md border border-input bg-background/50 px-2.5 text-xs text-foreground placeholder:text-muted-foreground/60"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Học thử miễn phí */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground">
                Học thử miễn phí (Free Preview)
              </p>
              <p className="text-[11px] text-muted-foreground">
                Cho phép học viên chưa mua thử thách được xem trước bài học này
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isFreePreview}
                onChange={(e) => setIsFreePreview(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting}
              className="gap-2 font-semibold cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
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
