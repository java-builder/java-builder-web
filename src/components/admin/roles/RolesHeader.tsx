"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

interface RolesHeaderProps {
  totalCount: number;
  onCreate: () => void;
}

export default function RolesHeader({ totalCount, onCreate }: RolesHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t("admin.roles.pageTitle")}
          </h1>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary-soft border border-primary/20 px-3 py-1 text-xs font-medium text-primary dark:bg-orange-950/40 dark:text-orange-400">
            {t("admin.roles.totalRoles").replace("{count}", String(totalCount))}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("admin.roles.pageSubtitle")}
        </p>
      </div>

      <Button
        type="button"
        variant="accent"
        onClick={onCreate}
        className="gap-1.5"
      >
        <Plus className="h-4 w-4" />
        {t("admin.roles.createRoleBtn")}
      </Button>
    </div>
  );
}
