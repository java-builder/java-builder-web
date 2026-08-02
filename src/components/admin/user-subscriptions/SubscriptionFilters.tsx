"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSelect, FilterOption } from "@/components/ui/FilterSelect";
import { useI18n } from "@/contexts/I18nContext";

interface SubscriptionFiltersProps {
  searchInput: string;
  status: string;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export default function SubscriptionFilters({
  searchInput,
  status,
  onSearchInputChange,
  onSearch,
  onStatusChange,
  onClear,
  hasActiveFilters,
}: SubscriptionFiltersProps) {
  const { t } = useI18n();

  const statusOptions: FilterOption[] = [
    { value: "", label: t("admin.documents.filterAllTypes") },
    {
      value: "ACTIVE",
      label: t("admin.userSubscriptions.statActiveSubs"),
      badge: <span className="h-2 w-2 rounded-full bg-emerald-500" />,
    },
    {
      value: "EXPIRED",
      label: t("admin.userSubscriptions.statExpiredSubs"),
      badge: <span className="h-2 w-2 rounded-full bg-amber-500" />,
    },
  ];

  return (
    <div className="relative z-20 rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            {t("admin.userSubscriptions.filterAllStatus")}
          </h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="gap-1 text-muted-foreground hover:text-foreground h-8 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            {t("admin.payments.clearFilters")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 sm:gap-4 lg:p-5">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("admin.userSubscriptions.colStatus")}
          </label>
          <FilterSelect
            value={status}
            onChange={onStatusChange}
            options={statusOptions}
            placeholder={t("admin.documents.filterAllTypes")}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("admin.userSubscriptions.searchPlaceholder")}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                placeholder={t("admin.userSubscriptions.searchPlaceholder")}
                className="block w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder-muted-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <Button
              variant="accent"
              size="default"
              onClick={onSearch}
              className="gap-1.5 h-[38px] cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
