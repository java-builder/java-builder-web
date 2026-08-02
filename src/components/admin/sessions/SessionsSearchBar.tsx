"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

interface SessionsSearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const SessionsSearchBar = ({
  query,
  onChange,
  onClear,
}: SessionsSearchBarProps) => {
  const { t } = useI18n();
  const hasQuery = query.length > 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-4 rounded-xl shadow-sm">
      <div className="relative flex-1 max-w-md w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("admin.sessions.searchPlaceholder")}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      {hasQuery && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="gap-1.5 shrink-0 self-end sm:self-auto cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
          {t("admin.payments.clearFilters")}
        </Button>
      )}
    </div>
  );
};
