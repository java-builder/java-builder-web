"use client";

import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificatesHeaderProps {
  totalCount: number;
  searchTerm?: string;
  isLoading: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export const CertificatesHeader = ({
  totalCount,
  searchTerm,
  isLoading,
  onRefresh,
  onCreate,
}: CertificatesHeaderProps) => {

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Quản Lý Chứng Chỉ
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
            "Quản lý, cấp phát chứng chỉ hoàn thành khóa học cho học viên & tra cứu mã bảo chứng"
          )}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {!searchTerm && totalCount > 0 && (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent dark:text-accent-on-dark">
            Tổng chứng chỉ:{" "}
            <span className="font-bold tabular-nums">
              {totalCount.toLocaleString()}
            </span>
          </span>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-1.5"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-accent" : ""}`} />
          Làm mới
        </Button>
        <Button
          type="button"
          variant="accent"
          onClick={onCreate}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Cấp chứng chỉ mới
        </Button>
      </div>
    </div>
  );
};
