"use client";

import { useState, useEffect } from "react";
import {
  X,
  Loader2,
  CheckSquare,
  Plus,
  Trash2,
  Link2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSelect, SelectOption } from "@/components/ui/CustomSelect";
import {
  ChallengeTaskResponse,
  CreateChallengeTaskRequest,
  UpdateChallengeTaskRequest,
  TaskResourceLink,
  TaskLinkType,
  TASK_LINK_TYPE_CONFIG,
  TASK_LINK_TITLE_PRESETS,
  TASK_LINK_TITLE_PRESET_KEYS,
} from "@/types/challenge";
import { useI18n, TranslationKey } from "@/contexts/I18nContext";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateChallengeTaskRequest | UpdateChallengeTaskRequest) => Promise<void>;
  initialData?: ChallengeTaskResponse | null;
  dayId: string;
  dayNumber: number;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  dayId,
  dayNumber,
}: TaskModalProps) {
  const { t } = useI18n();
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState("");
  const [orderIndex, setOrderIndex] = useState(1);
  const [resourceLinks, setResourceLinks] = useState<TaskResourceLink[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setOrderIndex(initialData.orderIndex || 1);
      setResourceLinks(initialData.resourceLinks || []);
    } else {
      setTitle("");
      setOrderIndex(1);
      setResourceLinks([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

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

  const handleAddLink = () => {
    setResourceLinks((prev) => [
      ...prev,
      {
        type: "OFFICIAL",
        title: "",
        url: "",
      },
    ]);
  };

  const handleUpdateLink = (index: number, field: keyof TaskResourceLink, value: string) => {
    setResourceLinks((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveLink = (index: number) => {
    setResourceLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const validLinks = resourceLinks
      .map((l) => ({
        type: l.type || ("OFFICIAL" as TaskLinkType),
        title: (l.title || "").trim(),
        url: (l.url || "").trim(),
      }))
      .filter((l) => l.url.length > 0);

    try {
      setIsSubmitting(true);
      if (isEdit) {
        await onSubmit({
          title: title.trim(),
          orderIndex,
          resourceLinks: validLinks,
        } as UpdateChallengeTaskRequest);
      } else {
        await onSubmit({
          challengeDayId: dayId,
          title: title.trim(),
          orderIndex,
          resourceLinks: validLinks,
        } as CreateChallengeTaskRequest);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-accent/10 text-accent shrink-0">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-foreground truncate">
                {isEdit
                  ? `Chỉnh sửa bài tập Ngày ${dayNumber}`
                  : `Thêm bài tập mới cho Ngày ${dayNumber}`}
              </h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                Nhiệm vụ hoặc bài tập thực hành học viên cần hoàn thành
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Tiêu đề bài tập / nhiệm vụ <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cài đặt JDK 25 và cấu hình kết nối database trong application.yml"
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Thứ tự hiển thị (Order Index)
            </label>
            <input
              type="number"
              min={1}
              value={orderIndex}
              onChange={(e) => setOrderIndex(parseInt(e.target.value) || 1)}
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
          </div>

          {/* Reference Links Section */}
          <div className="pt-2 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-accent" />
                  <span>Tài liệu & Liên kết tham khảo ({resourceLinks.length})</span>
                </label>
                <p className="text-[11px] text-muted-foreground">
                  Đính kèm link documentation chính thức hoặc video YouTube để học viên tham khảo khi làm task.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLink}
                className="gap-1 text-xs h-7.5 px-2.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("taskResourceLinks.ui.addLink" as TranslationKey)}</span>
              </Button>
            </div>

            {resourceLinks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-3.5 text-center text-xs text-muted-foreground">
                {t("taskResourceLinks.ui.emptyState" as TranslationKey)}
              </div>
            ) : (
              <div className="space-y-2.5">
                {resourceLinks.map((link, idx) => {
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
                      key={idx}
                      className="p-3 rounded-lg border border-border bg-muted/20 space-y-2.5 relative group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight uppercase leading-none shadow-xs ${meta.badgeClass}`}
                          >
                            {meta.badgeLabel}
                          </span>
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            Link #{idx + 1}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveLink(idx)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded transition cursor-pointer"
                          title={t("taskResourceLinks.ui.deleteTitle" as TranslationKey)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        {/* Link Type Selector */}
                        <div className="sm:col-span-4">
                          <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                            {t("taskResourceLinks.ui.typeLabel" as TranslationKey)}
                          </label>
                          <CustomSelect
                            size="sm"
                            triggerClassName="h-8 text-xs font-semibold"
                            value={link.type}
                            onChange={(val) =>
                              handleUpdateLink(
                                idx,
                                "type",
                                val as TaskLinkType
                              )
                            }
                            options={linkTypeOptions}
                            className="w-full"
                          />
                        </div>

                        {/* Link Title Select Dropdown */}
                        <div className="sm:col-span-8">
                          <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                            {t("taskResourceLinks.ui.titleLabel" as TranslationKey)}
                          </label>
                          <CustomSelect
                            size="sm"
                            triggerClassName="h-8 text-xs"
                            value={isCustom ? "__custom__" : (link.title || "")}
                            onChange={(val) => {
                              if (val === "__custom__") {
                                handleUpdateLink(
                                  idx,
                                  "title",
                                  link.title && !isPreset
                                    ? link.title
                                    : t("taskResourceLinks.ui.customPlaceholder" as TranslationKey)
                                );
                              } else {
                                handleUpdateLink(idx, "title", String(val));
                              }
                            }}
                            options={getTitleOptions(meta)}
                            className="w-full"
                          />
                        </div>

                        {/* Optional Custom Title input */}
                        {isCustom && (
                          <div className="sm:col-span-12">
                            <input
                              type="text"
                              value={link.title || ""}
                              onChange={(e) => handleUpdateLink(idx, "title", e.target.value)}
                              placeholder={t("taskResourceLinks.ui.customPlaceholder" as TranslationKey)}
                              className="flex h-8 w-full rounded-md border border-input bg-background/50 px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                            />
                          </div>
                        )}

                        {/* Link URL */}
                        <div className="sm:col-span-12">
                          <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                            {t("taskResourceLinks.ui.urlLabel" as TranslationKey)}{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <input
                            type="url"
                            required
                            value={link.url}
                            onChange={(e) => handleUpdateLink(idx, "url", e.target.value)}
                            placeholder="https://..."
                            className="flex h-8 w-full rounded-md border border-input bg-card px-2.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                  <span>{isEdit ? "Cập nhật bài tập" : "Thêm bài tập"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
