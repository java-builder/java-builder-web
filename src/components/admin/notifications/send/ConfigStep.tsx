"use client";

import StepCard from "./StepCard";
import StepFooter from "./StepFooter";
import { ICON_TONE, SUBJECT_PRESETS } from "./helpers";

interface ConfigStepProps {
  subject: string;
  preheader: string;
  senderName: string;
  senderEmail: string;
  replyTo: string;
  onSubjectChange: (value: string) => void;
  onPreheaderChange: (value: string) => void;
  onSenderNameChange: (value: string) => void;
  onSenderEmailChange: (value: string) => void;
  onReplyToChange: (value: string) => void;
  onNext: () => void;
}

export default function ConfigStep({
  subject,
  preheader,
  senderName,
  senderEmail,
  replyTo,
  onSubjectChange,
  onPreheaderChange,
  onSenderNameChange,
  onSenderEmailChange,
  onReplyToChange,
  onNext,
}: ConfigStepProps) {
  const handleApplyPreset = (presetSubject: string, presetSummary: string) => {
    onSubjectChange(presetSubject);
    onPreheaderChange(presetSummary);
  };

  return (
    <div className="space-y-5">
      <StepCard
        title="Mẫu tiêu đề nhanh"
        description="Bấm để áp dụng tiêu đề và preheader gợi ý"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {SUBJECT_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isActive = subject === preset.subject;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyPreset(preset.subject, preset.summary)}
                className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                  isActive
                    ? "border-accent bg-accent/5 ring-1 ring-accent/30"
                    : "border-border bg-card hover:border-accent/50 hover:bg-muted"
                }`}
              >
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                    isActive ? "bg-accent/10 text-accent" : ICON_TONE[preset.tone]
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span
                  className={`min-w-0 flex-1 truncate text-xs font-semibold ${
                    isActive ? "text-accent" : "text-foreground"
                  }`}
                >
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>
      </StepCard>

      <StepCard
        title="Cấu hình chiến dịch"
        description="Tiêu đề thư, preheader và thông tin người gửi"
      >
        <div className="space-y-4">
          <Field
            label="Tiêu đề thư (Subject)"
            required
            hint="Hiển thị ở dòng tiêu đề trong hộp thư của người nhận"
          >
            <input
              type="text"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              placeholder="VD: Cập nhật tài khoản Premium của bạn ngay hôm nay..."
              className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            />
          </Field>

          <Field
            label="Preheader (nội dung tóm tắt)"
            hint="Xuất hiện cạnh tiêu đề trong inbox preview"
          >
            <input
              type="text"
              value={preheader}
              onChange={(e) => onPreheaderChange(e.target.value)}
              placeholder="VD: Nhận ưu đãi lớn nhất trong năm từ cộng đồng JavaBuilder"
              className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Tên người gửi">
              <input
                type="text"
                value={senderName}
                onChange={(e) => onSenderNameChange(e.target.value)}
                className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              />
            </Field>
            <Field label="Email người gửi">
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => onSenderEmailChange(e.target.value)}
                className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              />
            </Field>
          </div>

          <Field
            label="Email phản hồi (Reply-To)"
            hint="Khi người nhận bấm Trả lời, email sẽ gửi tới địa chỉ này"
          >
            <input
              type="email"
              value={replyTo}
              onChange={(e) => onReplyToChange(e.target.value)}
              className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            />
          </Field>
        </div>
      </StepCard>

      <StepFooter onNext={onNext} nextLabel="Soạn nội dung" />
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
        {hint && (
          <span className="text-[11px] text-muted-foreground/60">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}
