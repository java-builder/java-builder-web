"use client";

import { useState, useMemo } from "react";
import { COUNTRIES } from "@/app/admin/ip-access-rules/countries";
import { X, Check } from "lucide-react";

const TARGET_OPTIONS = [
  { value: "ip", label: "Địa chỉ IP đơn lẻ", desc: "Chặn hoặc cấp phép cho một IP cụ thể (ví dụ: 1.1.1.1)", icon: "💻", disabled: false },
  { value: "ip_range", label: "Dải địa chỉ IP (CIDR)", desc: "Chặn dải mạng lớp /24 hoặc /16 (ví dụ: 192.168.1.0/24)", icon: "🌐", disabled: false },
  { value: "country", label: "Quốc gia / Lãnh thổ (Yêu cầu Enterprise)", desc: "Chỉ hỗ trợ trên tài khoản Cloudflare gói Enterprise", icon: "🌍", disabled: true },
  { value: "asn", label: "Hệ thống mạng (ASN)", desc: "Chặn lưu lượng từ nhà mạng cụ thể (ví dụ: AS13335)", icon: "🏢", disabled: false }
];

const MODE_OPTIONS = [
  { value: "block", label: "Chặn truy cập (Block)", desc: "Từ chối mọi yêu cầu từ nguồn này ngay lập tức" },
  { value: "challenge", label: "Xác minh Captcha (Challenge)", desc: "Hiển thị thử thách hình ảnh để xác minh người dùng" },
  { value: "js_challenge", label: "Kiểm tra trình duyệt (JS Challenge)", desc: "Kiểm tra trình duyệt tự động ngầm trong vài giây" },
  { value: "managed_challenge", label: "Thử thách ngầm thông minh (Managed)", desc: "Cloudflare tự chọn thử thách hiệu quả và nhẹ nhất" },
  { value: "whitelist", label: "Tin cậy / Cấp phép (Whitelist)", desc: "Luôn cấp quyền truy cập và bỏ qua các bộ chặn khác" }
];

interface CreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onSubmit: (data: { target: string; value: string; mode: string; notes: string }) => Promise<void>;
}

export function CreateRuleModal({ isOpen, onClose, isSubmitting, onSubmit }: CreateRuleModalProps) {
  const [formData, setFormData] = useState({
    target: "ip",
    value: "",
    mode: "block",
    notes: "",
  });

  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const filteredCountries = useMemo(() => {
    const q = countrySearchQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countrySearchQuery]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getValuePlaceholder = (target: string) => {
    switch (target) {
      case "ip":
        return "Ví dụ: 198.51.100.4 (IPv4) hoặc 2400:cb00::1 (IPv6)";
      case "ip_range":
        return "Ví dụ: 198.51.100.0/24 (Dải địa chỉ CIDR)";
      case "country":
        return "Tìm kiếm quốc gia từ danh sách gợi ý...";
      case "asn":
        return "Ví dụ: AS13335 (Mã hiệu mạng ASN)";
      default:
        return "Nhập giá trị cấu hình...";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-card border border-border text-foreground rounded-2xl shadow-2xl overflow-hidden flex flex-col transform animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">Chặn IP / Access Rule mới</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Thiết lập quy tắc truy cập cho hệ thống thông qua Cloudflare
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
            {/* Target Type selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Loại mục tiêu (Target)</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsTargetDropdownOpen(!isTargetDropdownOpen);
                    setIsModeDropdownOpen(false);
                    setIsCountryDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-background border border-input rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-ring transition-all text-foreground cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{TARGET_OPTIONS.find(o => o.value === formData.target)?.icon}</span>
                    <span className="font-semibold text-sm">{TARGET_OPTIONS.find(o => o.value === formData.target)?.label}</span>
                  </div>
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isTargetDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsTargetDropdownOpen(false)} />
                    <div className="absolute z-50 w-full mt-1.5 bg-popover border border-border rounded-xl shadow-lg overflow-hidden py-1 max-h-64 overflow-y-auto transform origin-top transition-all duration-150 animate-in slide-in-from-top-1.5">
                      {TARGET_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          disabled={opt.disabled}
                          onClick={() => {
                            if (opt.disabled) return;
                            setFormData({ ...formData, target: opt.value, value: "" });
                            setCountrySearchQuery("");
                            setIsTargetDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors border-b border-border last:border-0 ${
                            formData.target === opt.value ? "bg-muted/50" : ""
                          } ${
                            opt.disabled
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-muted/70"
                          }`}
                        >
                          <span className="text-lg mt-0.5">{opt.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                              {opt.label}
                              {opt.disabled && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 rounded-md border border-red-200 dark:border-red-900/50">
                                  Trả phí
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 leading-normal">{opt.desc}</div>
                          </div>
                          {formData.target === opt.value && !opt.disabled && (
                            <Check className="w-4 h-4 text-primary shrink-0 self-center" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Config value selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Giá trị cấu hình</label>
              {formData.target === "country" ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm quốc gia (e.g. Việt Nam, VN, US...)"
                    value={countrySearchQuery}
                    onChange={(e) => {
                      setCountrySearchQuery(e.target.value);
                      setIsCountryDropdownOpen(true);
                      setFormData({ ...formData, value: e.target.value.toUpperCase() });
                    }}
                    onFocus={() => setIsCountryDropdownOpen(true)}
                    className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all text-foreground"
                    required
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                    {formData.value && (
                      <span className="text-xs bg-accent text-accent-foreground font-bold px-2 py-0.5 rounded-md uppercase">
                        {formData.value}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {isCountryDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setIsCountryDropdownOpen(false)}
                      />
                      <div className="absolute z-50 w-full mt-1.5 max-h-56 overflow-y-auto bg-popover border border-border rounded-lg shadow-lg">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, value: c.code });
                                setCountrySearchQuery(`${c.name} (${c.code})`);
                                setIsCountryDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-muted/70 text-sm text-foreground flex justify-between items-center transition-colors border-b border-border last:border-0"
                            >
                              <span>{c.name}</span>
                              <span className="font-mono text-xs text-muted-foreground uppercase">{c.code}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-muted-foreground italic text-center">
                            Không tìm thấy quốc gia nào
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder={getValuePlaceholder(formData.target)}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-sm font-mono placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all text-foreground"
                  required
                />
              )}
              <span className="text-xs text-muted-foreground mt-1.5 block font-medium">
                {formData.target === "ip" && "Nhập địa chỉ IPv4 (e.g. 1.1.1.1) hoặc IPv6 (e.g. 2400:cb00::1)."}
                {formData.target === "ip_range" && "Nhập dải IP CIDR như 192.0.2.0/24 hoặc 2001:db8::/32."}
                {formData.target === "country" && "Chọn từ danh sách quốc gia gợi ý ở trên."}
                {formData.target === "asn" && "Bắt đầu bằng chữ 'AS' viết hoa kèm theo số hiệu mạng (e.g. AS13335)."}
              </span>
            </div>

            {/* Mode select */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Chế độ hành vi (Mode)</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsModeDropdownOpen(!isModeDropdownOpen);
                    setIsTargetDropdownOpen(false);
                    setIsCountryDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-background border border-input rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-ring transition-all text-foreground cursor-pointer"
                >
                  <span className="font-semibold text-sm">{MODE_OPTIONS.find(o => o.value === formData.mode)?.label}</span>
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isModeDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsModeDropdownOpen(false)} />
                    <div className="absolute z-50 w-full mt-1.5 bg-popover border border-border rounded-xl shadow-lg overflow-hidden py-1 max-h-64 overflow-y-auto transform origin-top transition-all duration-150 animate-in slide-in-from-top-1.5">
                      {MODE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, mode: opt.value });
                            setIsModeDropdownOpen(false);
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
                placeholder="Lý do chặn hoặc mô tả chi tiết..."
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
              {isSubmitting ? "Đang xử lý..." : "Xác nhận tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
