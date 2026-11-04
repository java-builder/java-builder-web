"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/contexts/I18nContext";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  showButton?: boolean;
  buttonText?: string;
  className?: string;
  inputClassName?: string;
  size?: "sm" | "md" | "lg";
}

export default function SearchBar({
  placeholder,
  value: controlledValue,
  onChange,
  onSearch,
  showButton = true,
  buttonText,
  className = "",
  inputClassName = "",
  size = "md",
}: SearchBarProps) {
  const { t } = useI18n();
  const displayPlaceholder = placeholder ?? t("common.searchPlaceholder");
  const displayButtonText = buttonText ?? t("common.search");
  
  const [internalValue, setInternalValue] = useState("");
  
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [isControlled, onChange]);

  const handleSearch = useCallback(() => {
    onSearch?.(value);
  }, [onSearch, value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }, [handleSearch]);

  const sizeClasses = {
    sm: "h-10 text-sm",
    md: "h-12 text-[15px]",
    lg: "h-14 text-base",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      {/* Search input */}
      <div className="flex-1">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <svg
              className={iconSizes[size]}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder={displayPlaceholder}
            className={`
              w-full ${sizeClasses[size]} rounded-[8px] border border-[#E8E8E8] dark:border-[#262d3d] bg-white dark:bg-[#181d28] text-[#171717] dark:text-slate-100 placeholder:text-[#64748B] dark:placeholder:text-slate-500 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 focus:border-[#FF5A1F]
              transition-colors
              ${inputClassName}
            `}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* Search button */}
      {showButton && (
        <button
          type="button"
          onClick={handleSearch}
          className={`
            px-4 sm:px-6 ${sizeClasses[size]} 
            bg-[#FF5A1F] hover:bg-[#e04b16] text-white rounded-[8px] font-medium shadow-xs 
            transition-colors duration-200 
            flex items-center gap-2
            whitespace-nowrap
            flex-shrink-0 cursor-pointer
          `}
        >
          <svg
            className={iconSizes[size]}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="hidden sm:inline">{displayButtonText}</span>
        </button>
      )}
    </div>
  );
}
