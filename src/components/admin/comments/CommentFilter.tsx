import { Search, SlidersHorizontal, Layers, Eye, Trash2 } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface CommentFilterProps {
  statusFilter: "ACTIVE" | "DELETED" | "ALL";
  onStatusChange: (status: "ACTIVE" | "DELETED" | "ALL") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function CommentFilter({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: CommentFilterProps) {
  const { t } = useI18n();

  return (
    <div className="relative z-20 rounded-xl border border-border bg-card p-4 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full max-w-xl">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("admin.comments.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 pl-9 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
          />
        </div>

        {/* Status Filter Segmented Control */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 pr-2 border-r border-border/80 hidden sm:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
              <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              {t("admin.comments.filterStatus")}
            </span>
          </div>

          <div className="flex h-9 items-center gap-1 rounded-md border border-input bg-muted/40 p-1 shadow-xs">
            {[
              { value: "ALL", label: t("admin.comments.filterAll"), icon: Layers },
              { value: "ACTIVE", label: t("admin.comments.filterActive"), icon: Eye, activeColor: "text-emerald-500" },
              { value: "DELETED", label: t("admin.comments.filterDeleted"), icon: Trash2, activeColor: "text-rose-500" },
            ].map((tab) => {
              const isActive = statusFilter === tab.value;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => onStatusChange(tab.value as "ACTIVE" | "DELETED" | "ALL")}
                  className={`flex h-7 items-center gap-1.5 px-3 text-sm font-medium rounded transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-background text-foreground shadow-xs ring-1 ring-border/80 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? (tab.activeColor || "text-accent") : "text-muted-foreground/70"
                    }`}
                  />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
