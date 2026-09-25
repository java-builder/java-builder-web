"use client";

import { Check, Lock } from "lucide-react";
import type { ActiveTab } from "@/components/admin/notifications/useEmailCampaign";
import { STEPS } from "./helpers";

interface StepNavProps {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
  canAccessTab?: (tab: ActiveTab) => boolean;
}

export default function StepNav({ activeTab, onChange, canAccessTab }: StepNavProps) {
  const activeIndex = STEPS.findIndex((s) => s.id === activeTab);
  const activeStep = STEPS[activeIndex];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:px-5">
      <nav aria-label="Tiến trình" className="flex items-center">
        {STEPS.map((step, idx) => {
          const isActive = activeTab === step.id;
          const isCompleted = idx < activeIndex;
          const isAccessible = canAccessTab ? canAccessTab(step.id) : true;
          const isLast = idx === STEPS.length - 1;

          return (
            <div key={step.id} className="flex flex-1 items-center justify-center">
              <button
                type="button"
                disabled={!isAccessible}
                onClick={() => {
                  if (isAccessible) {
                    onChange(step.id);
                  }
                }}
                title={
                  !isAccessible
                    ? "Vui lòng hoàn thành bước trước đó để tiếp tục"
                    : undefined
                }
                className={`group flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 p-1.5 focus:outline-none rounded-xl transition-all ${
                  isAccessible
                    ? "cursor-pointer hover:bg-accent/5"
                    : "cursor-not-allowed opacity-40 hover:bg-transparent"
                }`}
              >
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums transition ${
                    isActive
                      ? "bg-accent text-white shadow-sm ring-2 ring-accent/30"
                      : isCompleted
                      ? "bg-emerald-500 text-white"
                      : isAccessible
                      ? "bg-muted text-muted-foreground ring-1 ring-border group-hover:border-accent"
                      : "bg-muted/50 text-muted-foreground/50 ring-1 ring-border/50"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : !isAccessible ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    idx + 1
                  )}
                </span>
                <span
                  className={`hidden truncate text-xs font-semibold transition sm:inline ${
                    isActive
                      ? "text-accent"
                      : isCompleted
                      ? "text-foreground"
                      : isAccessible
                      ? "text-muted-foreground group-hover:text-foreground"
                      : "text-muted-foreground/40"
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
