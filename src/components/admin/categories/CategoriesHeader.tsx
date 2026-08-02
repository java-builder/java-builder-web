"use client";

import { Plus, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

interface CategoriesHeaderProps {
  totalCount: number;
  onCreate: () => void;
}

export default function CategoriesHeader({
  totalCount,
  onCreate,
}: CategoriesHeaderProps) {
  const { t, locale } = useI18n();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-6 rounded-xl shadow-sm">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl flex items-center gap-2">
          <FolderTree className="h-6 w-6 text-accent" />
          <span>{t("admin.categories.pageTitle")}</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("admin.categories.pageSubtitle")}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-semibold text-accent">
          {t("admin.categories.totalCount").replace("{count}", totalCount.toLocaleString(locale === "vi" ? "vi-VN" : "en-US"))}
        </span>
        <Button
          onClick={onCreate}
          variant="accent"
          className="gap-1.5 h-9 font-semibold"
        >
          <Plus className="h-4 w-4" />
          <span>{t("admin.categories.createButton")}</span>
        </Button>
      </div>
    </div>
  );
}
