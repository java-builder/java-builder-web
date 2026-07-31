"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps<T extends string = string> {
  options: CustomSelectOption<T>[];
  value?: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export default function CustomSelect<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = "-- Chọn --",
  disabled = false,
  className = "",
  id,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optValue: T) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`} id={id}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all duration-200 ${
          isOpen
            ? "border-primary ring-2 ring-primary/20 dark:border-primary"
            : "border-gray-300 hover:border-gray-400 dark:border-slate-600 dark:hover:border-slate-500"
        } ${
          disabled
            ? "cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
            : "bg-white text-gray-900 dark:bg-slate-700/80 dark:text-white"
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          {selectedOption ? (
            <span className="font-medium">{selectedOption.label}</span>
          ) : (
            <span className="text-gray-400 dark:text-slate-400">
              {placeholder}
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 dark:text-slate-400 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-64 overflow-y-auto rounded-xl border border-gray-200/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-lg dark:border-slate-700 dark:bg-slate-800/95">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  isSelected
                    ? "bg-primary/10 font-semibold text-primary dark:bg-primary/20 dark:text-primary-light"
                    : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 dark:text-slate-200 dark:hover:bg-slate-700/70 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {option.icon}
                  <div className="flex flex-col truncate">
                    <span>{option.label}</span>
                    {option.description && (
                      <span className="text-xs font-normal text-gray-500 dark:text-slate-400">
                        {option.description}
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
