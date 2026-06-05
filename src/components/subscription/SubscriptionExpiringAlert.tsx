"use client";

import { AlertTriangle } from "lucide-react";

interface SubscriptionExpiringAlertProps {
  title: string;
  description: string;
}

export default function SubscriptionExpiringAlert({
  title,
  description,
}: SubscriptionExpiringAlertProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/20">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
        <AlertTriangle className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
          {title}
        </h4>
        <p className="mt-1 text-xs text-amber-700 dark:text-amber-300 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
