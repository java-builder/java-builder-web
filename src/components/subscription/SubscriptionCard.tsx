"use client";

import {
  CalendarCheck,
  CalendarClock,
  Crown,
  RefreshCw,
  Timer,
} from "lucide-react";
import { UserSubscription } from "@/types/user-subscription";
import { getDaysLeftTone, getSubscriptionStatusTone } from "./helpers";

interface SubscriptionCardProps {
  subscription: UserSubscription;
  startDateText: string;
  endDateText: string;
  labels: {
    currentPlan: string;
    statusActive: string;
    statusExpired: string;
    statusCancelled: string;
    renewBtn: string;
    startDate: string;
    endDate: string;
    timeLeft: string;
    days: string;
    statusLabel: string;
  };
  onRenew: () => void;
}

export default function SubscriptionCard({
  subscription,
  startDateText,
  endDateText,
  labels,
  onRenew,
}: SubscriptionCardProps) {
  const isActive = subscription.status === "ACTIVE";
  const daysLeft = subscription.daysRemaining ?? 0;
  const tone = getSubscriptionStatusTone(subscription.status);
  const StatusIcon = tone.icon;

  const statusLabel =
    subscription.status === "ACTIVE"
      ? labels.statusActive
      : subscription.status === "EXPIRED"
        ? labels.statusExpired
        : labels.statusCancelled;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Crown className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
              {subscription.planName}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {labels.currentPlan}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone.pill}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {statusLabel}
          </span>
          {isActive && (
            <button
              type="button"
              onClick={onRenew}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-accent-600"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {labels.renewBtn}
            </button>
          )}
        </div>
      </div>

      {/* KPI strip */}
      <div className="flex flex-col divide-y divide-gray-200 dark:divide-slate-700 sm:flex-row sm:divide-x sm:divide-y-0">
        <InfoCell
          icon={<CalendarCheck className="h-4 w-4 text-emerald-500" />}
          label={labels.startDate}
          value={startDateText}
        />
        <InfoCell
          icon={<CalendarClock className="h-4 w-4 text-blue-500" />}
          label={labels.endDate}
          value={endDateText}
        />
        <DaysLeftCell
          label={labels.timeLeft}
          days={daysLeft}
          daysLabel={labels.days}
        />
        <StatusCell
          label={labels.statusLabel}
          tonePill={tone.pill}
          toneDot={tone.dot}
          statusLabel={statusLabel}
          icon={<StatusIcon className="h-3.5 w-3.5" />}
        />
      </div>
    </div>
  );
}

interface InfoCellProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCell({ icon, label, value }: InfoCellProps) {
  return (
    <div className="flex-1 px-5 py-4">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </p>
      </div>
      <p className="mt-2 truncate text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

interface DaysLeftCellProps {
  label: string;
  days: number;
  daysLabel: string;
}

function DaysLeftCell({ label, days, daysLabel }: DaysLeftCellProps) {
  const tone = getDaysLeftTone(days);
  return (
    <div className="flex-1 px-5 py-4">
      <div className="flex items-center gap-2">
        <Timer className="h-4 w-4 text-amber-500" />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </p>
      </div>
      <p className="mt-2 flex items-baseline gap-1">
        <span className={`text-2xl font-bold tabular-nums ${tone}`}>{days}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {daysLabel}
        </span>
      </p>
    </div>
  );
}

interface StatusCellProps {
  label: string;
  tonePill: string;
  toneDot: string;
  statusLabel: string;
  icon: React.ReactNode;
}

function StatusCell({
  label,
  tonePill,
  toneDot,
  statusLabel,
  icon,
}: StatusCellProps) {
  return (
    <div className="flex-1 px-5 py-4">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${toneDot}`} />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </p>
      </div>
      <span
        className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tonePill}`}
      >
        {icon}
        {statusLabel}
      </span>
    </div>
  );
}
