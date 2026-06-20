"use client";

import { Check } from "lucide-react";
import type { ActiveTab } from "@/components/admin/notifications/useEmailCampaign";
import { STEPS } from "./helpers";

interface StepNavProps {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}

export default function StepNav({ activeTab, onChange }: StepNavProps) {
  const activeIndex = STEPS.findIndex((s) => s.id === activeTab);
  const activeStep = STEPS[activeIndex];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:px-5">
      <nav aria-label="Tiến trình" className="flex items-center">
        {STEPS.map((step, idx) => {
          const isActive = activeTab === step.id;
          const isCompleted = idx < activeIndex;
          const isLast = idx === STEPS.length - 1;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => onChange(step.id)}
                className="group flex min-w-0 items-center gap-2.5 focus:outline-none"
              >
                <span
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition ${
                    isActive
                      ? "bg-accent text-white shadow-sm"
                      : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground ring-1 ring-border"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : (
                    idx + 1
                  )}
                </span>
                <span
                  className={`hidden truncate text-xs font-medium transition sm:inline ${
                    isActive
                      ? "text-accent"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {!isLast && (
                <span
                  aria-hidden
                  className={`mx-3 h-px flex-1 transition ${
                    isCompleted
                      ? "bg-emerald-500/50"
                      : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </nav>

      {/* Active step description */}
      {activeStep && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-xs sm:hidden">
          <span className="font-semibold text-foreground">
            {activeStep.label}
          </span>
          <span className="text-muted-foreground/35">·</span>
          <span className="text-muted-foreground">
            {activeStep.description}
          </span>
        </div>
      )}
      {activeStep && (
        <p className="mt-2 hidden text-xs text-muted-foreground sm:block">
          <span className="font-medium text-foreground">
            Bước {activeIndex + 1}/{STEPS.length}:
          </span>{" "}
          {activeStep.description}
        </p>
      )}
    </div>
  );
}
