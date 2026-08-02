"use client";

import React from "react";
import { Radio, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

interface PushHeaderProps {
  totalCount: number;
  onOpenCreate: () => void;
}

export default function PushHeader({ totalCount, onOpenCreate }: PushHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
          <Radio className="h-7 w-7 text-accent" />
          {t("admin.pushNotifications.pageTitle")}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t("admin.pushNotifications.pageSubtitle")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent dark:text-accent-on-dark">
          {totalCount} {t("admin.pushNotifications.colTitle")}
        </span>

        <Button
          type="button"
          variant="accent"
          onClick={onOpenCreate}
          className="gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {t("admin.pushNotifications.sendPushBtn")}
        </Button>
      </div>
    </div>
  );
}
