"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

interface UsersHeaderProps {
  totalCount: number;
  searchTerm?: string;
  onCreate: () => void;
}

export const UsersHeader = ({
  totalCount,
  searchTerm,
  onCreate,
}: UsersHeaderProps) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t("admin.users.pageTitle")}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {searchTerm ? (
            <>
              Tìm thấy{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {totalCount.toLocaleString()}
              </span>{" "}
              kết quả cho{" "}
              <span className="font-semibold text-foreground">&ldquo;{searchTerm}&rdquo;</span>
            </>
          ) : (
            t("admin.users.pageSubtitle")
          )}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {!searchTerm && totalCount > 0 && (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent dark:text-accent-on-dark">
            {t("admin.users.totalUsers")}:{" "}
            <span className="font-bold tabular-nums">
              {totalCount.toLocaleString()}
            </span>
          </span>
        )}
        <Button
          type="button"
          variant="accent"
          onClick={onCreate}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          {t("admin.users.createUserBtn")}
        </Button>
      </div>
    </div>
  );
};
