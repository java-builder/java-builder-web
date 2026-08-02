import { ReactNode } from "react";

interface StepCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function StepCard({ title, description, children }: StepCardProps) {
  return (
    <div className="relative z-20 rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-3 rounded-t-2xl">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}
