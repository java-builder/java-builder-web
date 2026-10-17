"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Sparkles, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSelect, SelectOption } from "@/components/ui/CustomSelect";
import {
  ChallengeLevel,
  ChallengeResponse,
  ChallengeStatus,
  CreateChallengeRequest,
  UpdateChallengeRequest,
} from "@/types/challenge";
import { categoryService } from "@/services/category.service";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import { formatPriceInput, parsePriceInput } from "@/utils/formatters";

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateChallengeRequest | UpdateChallengeRequest) => Promise<void>;
  initialData?: ChallengeResponse | null;
}

const GRADIENT_PRESETS = [
  { name: "Orange Sunset", value: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" },
  { name: "Emerald Forest", value: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
  { name: "Indigo Blue", value: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" },
  { name: "Violet Purple", value: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" },
  { name: "Rose Pink", value: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)" },
  { name: "Cyan Teal", value: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" },
];

const levelOptions: SelectOption[] = [
  { value: "INTERN", label: "Intern - Thực tập sinh" },
  { value: "FRESHER", label: "Fresher - Mới ra trường" },
  { value: "JUNIOR", label: "Junior - 1-2 năm kinh nghiệm" },
  { value: "MIDDLE", label: "Middle - Đã có nền tảng vững" },
  { value: "SENIOR", label: "Senior - Nâng cao chuyên sâu" },
];

const statusOptions: SelectOption[] = [
  { value: "ACTIVE", label: "Hoạt động (Active) - Học viên có thể tham gia" },
  { value: "INACTIVE", label: "Tạm ẩn (Inactive) - Chưa công khai" },
];

export default function ChallengeModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ChallengeModalProps) {
  const isEdit = Boolean(initialData);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<ChallengeLevel>("JUNIOR");
  const [totalDays, setTotalDays] = useState(60);
  const [freePreviewDays, setFreePreviewDays] = useState(3);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [priceDisplay, setPriceDisplay] = useState("");
  const [status, setStatus] = useState<ChallengeStatus>("ACTIVE");
  const [colorGradient, setColorGradient] = useState(GRADIENT_PRESETS[0].value);
  const [categoryId, setCategoryId] = useState<string>("");

  const [categories, setCategories] = useState<CategoryDetailResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      categoryService
        .getAll(CategoryType.CHALLENGE)
        .then((res) => {
          if (res.data) setCategories(res.data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setLevel(initialData.level || "JUNIOR");
      setTotalDays(initialData.totalDays || 60);
      setFreePreviewDays(initialData.freePreviewDays ?? 3);
      setPrice(initialData.price ?? undefined);
      setPriceDisplay(initialData.price !== undefined && initialData.price !== null ? formatPriceInput(String(initialData.price)) : "");
      setStatus(initialData.status || "ACTIVE");
      setColorGradient(initialData.colorGradient || GRADIENT_PRESETS[0].value);
      setCategoryId(initialData.category?.id || "");
    } else {
      setName("");
      setDescription("");
      setLevel("JUNIOR");
      setTotalDays(60);
      setFreePreviewDays(3);
      setPrice(undefined);
      setPriceDisplay("");
      setStatus("ACTIVE");
      setColorGradient(GRADIENT_PRESETS[0].value);
      setCategoryId("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const categoryOptions: SelectOption[] = [
    { value: "", label: "-- Không chọn danh mục --" },
    ...categories.map((c) => ({
      value: c.id,
      label: c.name,
    })),
  ];

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    if (!rawVal) {
      setPrice(undefined);
      setPriceDisplay("");
      return;
    }
    const numValue = parsePriceInput(rawVal);
    setPrice(numValue);
    setPriceDisplay(formatPriceInput(rawVal));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEdit) {
        const updatePayload: UpdateChallengeRequest = {
          name: name.trim(),
          description: description.trim(),
          level,
          totalDays,
          freePreviewDays,
          price: price !== undefined && price >= 0 ? price : undefined,
          status,
          colorGradient,
          categoryId: categoryId || undefined,
        };
        await onSubmit(updatePayload);
      } else {
        const createPayload: CreateChallengeRequest = {
          name: name.trim(),
          description: description.trim(),
          level,
          totalDays,
          freePreviewDays,
          price: price !== undefined && price >= 0 ? price : undefined,
          colorGradient,
          categoryId: categoryId || undefined,
        };
        await onSubmit(createPayload);
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
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEdit ? "Chỉnh sửa Thử thách Lập trình" : "Tạo Thử thách Lập trình mới"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Thiết lập lộ trình học tập thực chiến chia theo từng ngày
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
          {/* Tên thử thách */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Tên thử thách <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: 60 Ngày Chinh Phục Spring Boot Backend"
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Mô tả ngắn lộ trình <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tóm tắt nội dung thử thách, mục tiêu đầu ra và đối tượng phù hợp..."
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground resize-none"
            />
          </div>

          {/* Grid 2 cột: Cấp độ & Danh mục */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Cấp độ mục tiêu
              </label>
              <CustomSelect
                value={level}
                onChange={(val) => setLevel(val as ChallengeLevel)}
                options={levelOptions}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Danh mục liên quan
              </label>
              <CustomSelect
                value={categoryId}
                onChange={(val) => setCategoryId(String(val))}
                options={categoryOptions}
                placeholder="Chọn danh mục"
              />
            </div>
          </div>

          {/* Grid 3 cột: Tổng ngày, Ngày Free, Giá */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Tổng số ngày <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min={1}
                required
                value={totalDays}
                onChange={(e) => setTotalDays(parseInt(e.target.value) || 1)}
                className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Số ngày học thử miễn phí
              </label>
              <input
                type="number"
                min={0}
                max={totalDays}
                value={freePreviewDays}
                onChange={(e) => setFreePreviewDays(parseInt(e.target.value) || 0)}
                className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Giá mua lẻ (VNĐ)
              </label>
              <input
                type="text"
                value={priceDisplay}
                onChange={handlePriceChange}
                placeholder="0 = Miễn phí"
                className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
              />
            </div>
          </div>

          {/* Trạng thái (khi sửa hoặc tạo) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Trạng thái xuất bản
            </label>
            <CustomSelect
              value={status}
              onChange={(val) => setStatus(val as ChallengeStatus)}
              options={statusOptions}
            />
          </div>

          {/* Màu sắc Gradient Banner */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Màu chủ đề (Theme Gradient)</span>
              <span className="text-[11px] font-normal text-muted-foreground">Chọn màu đại diện</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {GRADIENT_PRESETS.map((p) => {
                const isSelected = colorGradient === p.value;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setColorGradient(p.value)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full shrink-0 shadow-xs"
                      style={{ background: p.value }}
                    />
                    <span className="text-xs font-medium text-foreground truncate">
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>
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
                  <span>{isEdit ? "Lưu thay đổi" : "Tạo thử thách"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
