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
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:px-5">
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
                      : "bg-gray-100 text-gray-500 ring-1 ring-gray-200 dark:bg-slate-700 dark:text-gray-400 dark:ring-slate-600"
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
                      ? "text-gray-700 dark:text-gray-200"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
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
                      ? "bg-emerald-300 dark:bg-emerald-800"
                      : "bg-gray-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </nav>

      {/* Active step description */}
      {activeStep && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs dark:border-slate-700 sm:hidden">
          <span className="font-semibold text-gray-900 dark:text-white">
            {activeStep.label}
          </span>
          <span className="text-gray-300 dark:text-slate-600">·</span>
          <span className="text-gray-500 dark:text-gray-400">
            {activeStep.description}
          </span>
        </div>
      )}
      {activeStep && (
        <p className="mt-2 hidden text-xs text-gray-500 dark:text-gray-400 sm:block">
          <span className="font-medium text-gray-700 dark:text-gray-200">
            Bước {activeIndex + 1}/{STEPS.length}:
          </span>{" "}
          {activeStep.description}
        </p>
      )}
    </div>
  );
}
