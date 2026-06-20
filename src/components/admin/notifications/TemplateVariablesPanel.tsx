"use client";

import { SYSTEM_VARS } from "./emailTemplates";

interface Props {
  customVars: string[];
  systemVarsDetected: string[];
  customVarValues: Record<string, string>;
  onChange: (varName: string, value: string) => void;
}

interface VarMeta {
  label: string;
  placeholder: string;
  /** Click-to-fill suggestion chips */
  suggestions?: (() => string)[];
}

const fmt = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}, ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const now = () => new Date();
const plus = (h: number) => new Date(Date.now() + h * 3600_000);
const tomorrowAt = (hh: number) => {
  const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(hh, 0, 0, 0); return d;
};

const CUSTOM_VAR_META: Record<string, VarMeta> = {
  discountPercent: {
    label: "Phần trăm giảm giá",
    placeholder: "VD: 40",
    suggestions: [() => "20", () => "30", () => "40", () => "50", () => "70"],
  },
  startTime: {
    label: "Thời gian bắt đầu bảo trì",
    placeholder: "HH:mm, DD/MM/YYYY",
    suggestions: [
      () => fmt(now()),
      () => fmt(plus(1)),
      () => fmt(tomorrowAt(1)),
      () => fmt(tomorrowAt(2)),
    ],
  },
  endTime: {
    label: "Thời gian kết thúc bảo trì",
    placeholder: "HH:mm, DD/MM/YYYY",
    suggestions: [
      () => fmt(plus(1)),
      () => fmt(plus(2)),
      () => fmt(plus(3)),
      () => fmt(tomorrowAt(3)),
      () => fmt(tomorrowAt(5)),
    ],
  },
  courseName: {
    label: "Tên khóa học",
    placeholder: "VD: Spring Boot Microservices",
    suggestions: [
      () => "Spring Boot Microservices",
      () => "Java Core Fundamentals",
      () => "DevOps cho Java Developer",
    ],
  },
  courseSlug: {
    label: "Slug khóa học",
    placeholder: "VD: spring-boot-microservices",
    suggestions: [
      () => "spring-boot-microservices",
      () => "java-core-fundamentals",
      () => "devops-for-java",
    ],
  },
};

const labelOf = (sug: string) => sug.length > 20 ? sug.slice(0, 18) + "…" : sug;

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
    <div className="border-b border-border">
      {hasCustom && (
        <div className="px-4 py-3 bg-amber-500/5 border-b border-amber-500/10">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-amber-500 text-sm">✏️</span>
            <span className="text-xs font-bold text-amber-500">
              Biến cần điền trước khi gửi
            </span>
            <span className="ml-auto text-[10px] font-medium text-amber-500 bg-amber-500/15 px-1.5 py-0.5 rounded-full">
              Bắt buộc
            </span>
          </div>
          <div className="space-y-3">
            {customVars.map((varName) => {
              const meta = CUSTOM_VAR_META[varName] ?? {
                label: varName,
                placeholder: `Nhập giá trị cho {${varName}}`,
              };
              const isEmpty = !customVarValues[varName]?.trim();
              const sugs = meta.suggestions?.map((fn) => fn()) ?? [];
              return (
                <div key={varName}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <code className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/15 px-1.5 py-0.5 rounded">
                      {`{${varName}}`}
                    </code>
                    <span className="text-[11px] text-muted-foreground">{meta.label}</span>
                    {isEmpty && (
                      <span className="ml-auto text-[10px] text-destructive font-medium">Chưa điền</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={customVarValues[varName] ?? ""}
                    onChange={(e) => onChange(varName, e.target.value)}
                    placeholder={meta.placeholder}
                    className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-all bg-background text-foreground ${
                      isEmpty
                        ? "border-amber-500 focus:ring-amber-500/50"
                        : "border-input focus:ring-accent/50"
                    }`}
                  />
                  {sugs.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {sugs.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => onChange(varName, s)}
                          title={s}
                          className="px-2 py-0.5 text-[10px] font-medium bg-background hover:bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:border-amber-500/40 rounded transition-colors"
                        >
                          {labelOf(s)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasSystem && (
        <div className="px-4 py-3 bg-muted/40">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-muted-foreground text-sm">⚙️</span>
            <span className="text-xs font-bold text-muted-foreground">
              Biến hệ thống
            </span>
            <span className="ml-auto text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              Backend tự inject
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {systemVarsDetected.map((varName) => (
              <div
                key={varName}
                className="flex items-center gap-1 px-2 py-1 bg-background border border-border rounded-lg"
                title={`Giá trị mẫu: ${SYSTEM_VARS[varName] ?? varName}`}
              >
                <code className="text-[10px] font-mono font-semibold text-foreground">
                  {`{${varName}}`}
                </code>
                <span className="text-[10px] text-muted-foreground">→</span>
                <span className="text-[10px] text-muted-foreground italic">
                  {SYSTEM_VARS[varName] ?? "auto"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
            Các biến này được backend thay thế tự động khi gửi thật. Giá trị hiển thị ở trên chỉ dùng để xem trước.
          </p>
        </div>
      )}
    </div>
  );
}
