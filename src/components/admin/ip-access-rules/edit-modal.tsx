"use client";

import { useState, useEffect } from "react";
import { CloudflareAccessRule } from "@/types/cloudflare";
import { X, Check } from "lucide-react";

const MODE_OPTIONS = [
  { value: "block", label: "Chặn truy cập (Block)", desc: "Từ chối mọi yêu cầu từ nguồn này ngay lập tức" },
  { value: "challenge", label: "Xác minh Captcha (Challenge)", desc: "Hiển thị thử thách hình ảnh để xác minh người dùng" },
  { value: "js_challenge", label: "Kiểm tra trình duyệt (JS Challenge)", desc: "Kiểm tra trình duyệt tự động ngầm trong vài giây" },
  { value: "managed_challenge", label: "Thử thách ngầm thông minh (Managed)", desc: "Cloudflare tự chọn thử thách hiệu quả và nhẹ nhất" },
  { value: "whitelist", label: "Tin cậy / Cấp phép (Whitelist)", desc: "Luôn cấp quyền truy cập và bỏ qua các bộ chặn khác" }
];

interface EditRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  rule: CloudflareAccessRule | null;
  isSubmitting: boolean;
  onSubmit: (formData: { target: string; value: string; mode: string; notes: string }) => Promise<void>;
}

export function EditRuleModal({ isOpen, onClose, rule, isSubmitting, onSubmit }: EditRuleModalProps) {
  const [formData, setFormData] = useState({
    target: "ip",
    value: "",
    mode: "block",
    notes: "",
  });

  const [isEditModeDropdownOpen, setIsEditModeDropdownOpen] = useState(false);

  useEffect(() => {
    if (rule) {
      setFormData({
        target: rule.configuration.target,
        value: rule.configuration.value,
        mode: rule.mode,
        notes: rule.notes || "",
      });
    }
  }, [rule]);

  if (!isOpen || !rule) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-card border border-border text-foreground rounded-2xl shadow-2xl overflow-hidden flex flex-col transform animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">Chỉnh sửa rule</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Cập nhật quy tắc cấu hình truy cập hệ thống
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mục tiêu chỉnh sửa</label>
              <div className="px-4 py-2.5 bg-muted/50 text-muted-foreground border border-input rounded-lg text-sm font-mono select-all">
                {formData.value} ({formData.target})
              </div>
            </div>

            {/* Mode selection dropdown */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Chế độ hành vi (Mode)</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModeDropdownOpen(!isEditModeDropdownOpen);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-background border border-input rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-ring transition-all text-foreground cursor-pointer"
                >
                  <span className="font-semibold text-sm">{MODE_OPTIONS.find(o => o.value === formData.mode)?.label}</span>
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isEditModeDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsEditModeDropdownOpen(false)} />
                    <div className="absolute z-50 w-full mt-1.5 bg-popover border border-border rounded-xl shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto transform origin-top transition-all duration-150 animate-in slide-in-from-top-1.5">
                      {MODE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, mode: opt.value });
                            setIsEditModeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 hover:bg-muted/70 flex items-start gap-3 transition-colors border-b border-border last:border-0 ${
                            formData.mode === opt.value ? "bg-muted/50" : ""
                          }`}
                        >
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-foreground">{opt.label}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 leading-normal">{opt.desc}</div>
                          </div>
                          {formData.mode === opt.value && (
                            <Check className="w-4 h-4 text-primary shrink-0 self-center" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Notes description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Ghi chú</label>
              <textarea
                rows={3}
                placeholder="Ghi chú chi tiết lý do..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
              <div className="mt-2.5 flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground w-full block mb-0.5 font-medium">Gợi ý nhanh:</span>
                {[
                  "Chặn IP tấn công ddos/spam request",
                  "Chặn IP brute-force đăng nhập",
                  "Whitelisted IP của Developer / Admin",
                  "Whitelisted IP đối tác / Webhook",
                  "Bảo trì hệ thống tạm thời"
                ].map((tpl) => (
                  <button
                    key={tpl}
                    type="button"
                    onClick={() => setFormData({ ...formData, notes: tpl })}
                    className="text-xs px-2.5 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors border border-border font-medium cursor-pointer"
                  >
                    {tpl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 border-t border-border bg-muted/30 px-6 py-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold border border-input bg-background hover:bg-muted text-foreground rounded-lg transition-colors"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? "Đang cập nhật..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
