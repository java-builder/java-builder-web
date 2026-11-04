"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

export interface FilterOption<T = string | number> {
  value: T;
  label: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface FilterSelectProps<T = string | number, O = T> {
  value?: T | undefined | null;
  onChange?: (value: T) => void;
  options: FilterOption<O>[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  align?: "left" | "right";
  size?: "sm" | "md" | "lg" | string;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  error?: string | boolean;
  id?: string;
}

export const FilterSelect = <T = string | number, O = T>({
  value,
  onChange,
  options,
  placeholder = "Táº¥t cáº£...",
  icon,
  className = "",
  triggerClassName = "",
  align = "left",
  size = "md",
  searchable,
  searchPlaceholder = "TÃ¬m kiáº¿m...",
  disabled = false,
  clearable = false,
  error = false,
  id,
}: FilterSelectProps<T, O>) => {
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
    return options.filter((opt) =>
      String(opt.label ?? "").toLowerCase().includes(q)
    );
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

  const handleSelect = (val: O, optDisabled?: boolean) => {
    if (optDisabled) return;
    onChange?.(val as unknown as T);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("" as unknown as T);
  };

  const heightClass =
    size === "sm"
      ? "h-8 text-xs px-2.5"
      : size === "lg"
        ? "h-10 text-base px-3.5"
        : "h-9 text-sm px-3";

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`} id={id}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        data-invalid={error ? "true" : undefined}
        className={`flex w-full items-center justify-between rounded-[8px] border bg-white dark:bg-[#181d28] text-[#171717] dark:text-slate-100 shadow-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${heightClass} ${
          error
            ? "border-red-500 focus:ring-red-500 dark:border-red-500"
            : isOpen
              ? "ring-2 ring-[#FF5A1F]/30 border-[#FF5A1F]"
              : "border-[#E8E8E8] dark:border-[#262d3d]"
        } ${triggerClassName}`}
      >
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {icon}
          {selectedOption ? (
            <div className="flex items-center gap-1.5 overflow-hidden">
              {selectedOption.badge}
              {selectedOption.icon}
              <span className="font-medium text-slate-900 dark:text-slate-100 truncate whitespace-nowrap">
                {selectedOption.label}
              </span>
            </div>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 truncate whitespace-nowrap">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {clearable && value !== "" && value !== undefined && value !== null && (
            <span
              onClick={handleClear}
              className="flex h-4 w-4 items-center justify-center rounded-[4px] text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="XÃ³a"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-slate-900 dark:text-slate-100" : ""
            }`}
          />
        </div>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0 left-auto" : "left-0 sm:left-0 max-sm:right-0"
          } top-full z-50 mt-1.5 min-w-full w-max max-w-[calc(100vw-2rem)] sm:max-w-[320px] rounded-[6px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1 shadow-lg animate-in fade-in-50 zoom-in-95`}
        >
          {/* Optional Live Search Box */}
          {isSearchEnabled && (
            <div className="relative mb-1 p-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-[6px] border border-slate-200 dark:border-slate-800 bg-transparent py-1 pl-8 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300"
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
                    className={`flex items-center justify-between gap-3 px-2.5 py-1.5 text-xs font-medium rounded-[6px] transition-colors whitespace-nowrap ${
                      opt.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : isSelected
                          ? "bg-[#FFF0E8] text-[#FF5A1F] dark:bg-orange-950/40 dark:text-orange-400 font-semibold"
                          : "text-[#171717] dark:text-slate-200 hover:bg-[#FFF0E8]/50 dark:hover:bg-slate-800 hover:text-[#FF5A1F] dark:hover:text-white cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden truncate">
                      {opt.icon}
                      {opt.badge}
                      <div className="flex flex-col truncate">
                        <span className="truncate whitespace-nowrap">{opt.label}</span>
                        {opt.description && (
                          <span className="text-[10px] text-[#64748B] dark:text-slate-500 font-normal truncate">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-[#FF5A1F] dark:text-orange-400 shrink-0" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">
                KhÃ´ng tÃ¬m tháº¥y káº¿t quáº£
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Aliases for common UI standardization
export const Select = FilterSelect;
export const CustomSelect = FilterSelect;

export type SelectOption<T = string | number> = FilterOption<T>;
export type CustomSelectOption<T = string | number> = FilterOption<T>;

export type SelectProps<T = string | number, O = T> = FilterSelectProps<T, O>;
export type CustomSelectProps<T = string | number, O = T> = FilterSelectProps<T, O>;

export default Select;
