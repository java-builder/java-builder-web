"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, RefreshCw } from "lucide-react";

export const TIME_RANGE_OPTIONS = [
  { value: "7days", label: "7 ngày qua" },
  { value: "30days", label: "30 ngày qua" },
  { value: "3months", label: "3 tháng qua" },
  { value: "6months", label: "6 tháng qua" },
  { value: "1year", label: "1 năm qua" },
] as const;

export type TimeRangeValue = (typeof TIME_RANGE_OPTIONS)[number]["value"];

interface ReportHeaderProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const ReportHeader = ({
  timeRange,
  onTimeRangeChange,
  onRefresh,
  isLoading,
}: ReportHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = TIME_RANGE_OPTIONS.find((o) => o.value === timeRange);

  return (
    <div className="bg-gradient-to-r from-card to-card/60 rounded-xl p-6 border border-border shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-5 lg:mb-0">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Báo cáo &amp; Thống kê
          </h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi hiệu suất và phân tích dữ liệu hệ thống
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Custom Select Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isLoading}
              className="flex items-center justify-between gap-2 px-4 py-2 border border-input rounded-lg text-sm bg-background hover:bg-accent/5 font-medium transition-colors shadow-sm focus:outline-none min-w-[140px] text-foreground text-left cursor-pointer"
            >
              <span>{currentOption?.label || timeRange}</span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-full min-w-[150px] bg-popover text-popover-foreground border border-border rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                {TIME_RANGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onTimeRangeChange(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                      timeRange === option.value
                        ? "bg-accent/10 font-semibold text-accent"
                        : "text-foreground font-normal"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="accent"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>
    </div>
  );
};

