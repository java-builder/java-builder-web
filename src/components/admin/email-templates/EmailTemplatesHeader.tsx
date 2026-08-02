"use client";

import { Plus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

interface EmailTemplatesHeaderProps {
  totalCount: number;
  onCreate: () => void;
}

export default function EmailTemplatesHeader({
  totalCount,
  onCreate,
}: EmailTemplatesHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl font-bold text-foreground sm:text-2xl flex items-center gap-2">
            <Mail className="h-6 w-6 text-accent" />
            {t("admin.emailTemplates.pageTitle")}
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            AWS SES Active
          </span>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t("admin.emailTemplates.pageSubtitle")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          {totalCount.toLocaleString()} {t("admin.emailTemplates.colName")}
        </span>
        <Button onClick={onCreate} variant="accent" className="gap-1.5 h-9 cursor-pointer">
          <Plus className="h-4 w-4" />
          {t("admin.emailTemplates.createBtn")}
        </Button>
      </div>
    </div>
  );
}
