"use client";

import { Loader2, RotateCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserSearchBarProps {
  search: string;
  debouncedSearch: string;
  isLoading: boolean;
  onSearch: (value: string) => void;
  onRefresh: () => void;
}

export const UserSearchBar = ({
  search,
  debouncedSearch,
  isLoading,
  onSearch,
  onRefresh,
}: UserSearchBarProps) => {
  const isDebouncing = search !== debouncedSearch;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-4 rounded-xl shadow-sm">
      <div className="relative flex-1 max-w-md w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Nhập tên, email hoặc tên đăng nhập..."
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 pr-9 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {isDebouncing && (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-accent" />
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="gap-1.5 shrink-0 self-end sm:self-auto"
      >
        <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
        Làm mới
      </Button>
    </div>
  );
};
