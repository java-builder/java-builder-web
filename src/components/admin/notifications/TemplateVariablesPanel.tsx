"use client";

import { SYSTEM_VARS } from "./emailTemplates";

interface Props {
  /** Custom vars that admin must fill (e.g. discount_percent, course_name) */
  customVars: string[];
  /** System vars detected in content (e.g. username, email) */
  systemVarsDetected: string[];
  /** Current values for custom vars */
  customVarValues: Record<string, string>;
  onChange: (varName: string, value: string) => void;
}

const CUSTOM_VAR_META: Record<string, { label: string; placeholder: string }> = {
  discount_percent: { label: "Phần trăm giảm giá", placeholder: "VD: 40" },
  start_time:       { label: "Thời gian bắt đầu bảo trì", placeholder: "VD: 01:00 AM Chủ Nhật" },
  end_time:         { label: "Thời gian kết thúc bảo trì", placeholder: "VD: 03:00 AM (dự kiến 2 tiếng)" },
  plan_duration:    { label: "Thời hạn gói", placeholder: "VD: 1 tháng / 3 tháng / 1 năm" },
  course_name:      { label: "Tên khóa học", placeholder: "VD: Spring Boot Microservices" },
  course_url:       { label: "Link khóa học", placeholder: "VD: https://javabuilder.online/courses/..." },
  days_left:        { label: "Số ngày còn lại", placeholder: "VD: 7" },
};

export default function TemplateVariablesPanel({
  customVars,
  systemVarsDetected,
  customVarValues,
  onChange,
}: Props) {
  const hasCustom = customVars.length > 0;
  const hasSystem = systemVarsDetected.length > 0;

  if (!hasCustom && !hasSystem) return null;

  return (
    <div className="border-b border-gray-200 dark:border-slate-700">
      {/* Custom vars — admin must fill */}
      {hasCustom && (
        <div className="px-4 py-3 bg-amber-50/70 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/20">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-amber-600 dark:text-amber-400 text-sm">✏️</span>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              Biến cần điền trước khi gửi
            </span>
            <span className="ml-auto text-[10px] font-medium text-amber-500/80 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">
              Bắt buộc
            </span>
          </div>
          <div className="space-y-2">
            {customVars.map((varName) => {
              const meta = CUSTOM_VAR_META[varName] ?? {
                label: varName,
                placeholder: `Nhập giá trị cho {${varName}}`,
              };
              const isEmpty = !customVarValues[varName]?.trim();
              return (
                <div key={varName}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <code className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                      {`{${varName}}`}
                    </code>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">{meta.label}</span>
                    {isEmpty && (
                      <span className="ml-auto text-[10px] text-red-500 font-medium">Chưa điền</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={customVarValues[varName] ?? ""}
                    onChange={(e) => onChange(varName, e.target.value)}
                    placeholder={meta.placeholder}
                    className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-all dark:bg-slate-800 dark:text-white ${
                      isEmpty
                        ? "border-amber-300 dark:border-amber-700 focus:ring-amber-400/50"
                        : "border-gray-200 dark:border-slate-600 focus:ring-accent/50"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* System vars — backend injects, FE shows preview only */}
      {hasSystem && (
        <div className="px-4 py-3 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-slate-400 text-sm">⚙️</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Biến hệ thống
            </span>
            <span className="ml-auto text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">
              Backend tự inject
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {systemVarsDetected.map((varName) => (
              <div
                key={varName}
                className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg"
                title={`Giá trị mẫu: ${SYSTEM_VARS[varName] ?? varName}`}
              >
                <code className="text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-300">
                  {`{${varName}}`}
                </code>
                <span className="text-[10px] text-slate-400">→</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                  {SYSTEM_VARS[varName] ?? "auto"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            Các biến này được backend thay thế tự động khi gửi thật. Giá trị hiển thị ở trên chỉ dùng để xem trước.
          </p>
        </div>
      )}
    </div>
  );
}
