"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

export interface FilterOption<T extends string | number = string | number> {
  value: T;
  label: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface FilterSelectProps<T extends string | number = string | number> {
  value: T | undefined | null;
  onChange: (value: T) => void;
  options: FilterOption<string | number>[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  align?: "left" | "right";
  size?: "sm" | "md" | "lg";
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  clearable?: boolean;
}

export const FilterSelect = <T extends string | number = string | number>({
  value,
  onChange,
  options,
  placeholder = "Tất cả...",
  icon,
  className = "",
  triggerClassName = "",
  align = "left",
  size = "md",
  searchable,
  searchPlaceholder = "Tìm kiếm...",
  disabled = false,
  clearable = false,
}: FilterSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isSearchEnabled = searchable !== undefined ? searchable : options.length > 6;

  const selectedOption = useMemo(
    () => options.find((opt) => String(opt.value) === String(value)),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isSearchEnabled) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen, isSearchEnabled]);

  const handleSelect = (val: string | number, optDisabled?: boolean) => {
    if (optDisabled) return;
    onChange(val as T);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("" as T);
  };

  const heightClass =
    size === "sm"
      ? "h-7 text-xs px-2.5"
      : size === "lg"
        ? "h-10 text-base px-3.5"
        : "h-9 text-sm px-3";

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-md border border-input bg-background/50 text-foreground shadow-sm transition-all hover:bg-accent/5 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${heightClass} ${isOpen ? "ring-1 ring-ring border-accent" : ""
          } ${triggerClassName}`}
      >
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {icon}
          {selectedOption ? (
            <div className="flex items-center gap-1.5 overflow-hidden">
              {selectedOption.badge}
              {selectedOption.icon}
              <span className="font-medium text-foreground truncate whitespace-nowrap">
                {selectedOption.label}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground/60 truncate whitespace-nowrap">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {clearable && value !== "" && value !== undefined && value !== null && (
            <span
              onClick={handleClear}
              className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground/70 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              title="Xóa"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <ChevronDown
            className={`h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60 transition-transform duration-200 ${isOpen ? "rotate-180 text-accent" : ""
              }`}
          />
        </div>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={`absolute ${align === "right" ? "right-0 left-auto" : "left-0 sm:left-0 max-sm:right-0"
            } top-full z-50 mt-1.5 min-w-full w-max max-w-[calc(100vw-2rem)] sm:max-w-[320px] rounded-xl border border-border bg-card p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in-50 zoom-in-95`}
        >
          {/* Optional Live Search Box */}
          {isSearchEnabled && (
            <div className="relative mb-1.5 p-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-input bg-background py-1 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <div
                    key={String(opt.value)}
                    onClick={() => handleSelect(opt.value, opt.disabled)}
                    className={`flex items-center justify-between gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${opt.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : isSelected
                          ? "bg-accent/15 text-accent font-semibold"
                          : "text-foreground hover:bg-muted/80 cursor-pointer"
                      }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden truncate">
                      {opt.icon}
                      {opt.badge}
                      <div className="flex flex-col truncate">
                        <span className="truncate whitespace-nowrap">{opt.label}</span>
                        {opt.description && (
                          <span className="text-[10px] text-muted-foreground/70 font-normal truncate">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-muted-foreground">
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Also export as CustomSelect for alias compatibility
export const CustomSelect = FilterSelect;
