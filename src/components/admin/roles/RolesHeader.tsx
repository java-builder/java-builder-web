"use client";

import { Plus } from "lucide-react";
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
          <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent dark:bg-accent/20">
            {t("admin.roles.totalRoles").replace("{count}", String(totalCount))}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("admin.roles.pageSubtitle")}
        </p>
      </div>

      <button
        onClick={onCreate}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent/20 active:scale-95 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        {t("admin.roles.createRoleBtn")}
      </button>
    </div>
  );
}
