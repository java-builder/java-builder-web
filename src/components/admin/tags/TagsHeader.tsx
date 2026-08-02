"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

interface TagsHeaderProps {
  totalCount: number;
  onCreate: () => void;
}

export default function TagsHeader({ totalCount, onCreate }: TagsHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          {t("admin.tags.pageTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("admin.tags.pageSubtitle")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          {totalCount.toLocaleString()} {t("admin.tags.colName")}
        </span>
        <Button
          onClick={onCreate}
          variant="accent"
          className="gap-1.5 h-9 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {t("admin.tags.createBtn")}
        </Button>
      </div>
    </div>
  );
}
