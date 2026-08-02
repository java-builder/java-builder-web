"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  RotateCcw,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateTimePickerProps {
  value: string; // YYYY-MM-DDTHH:mm or ISO or ""
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  align?: "left" | "right";
  presetType?: "start" | "end";
}

const parseValueToDate = (val: string): Date | null => {
  if (!val) return null;
  const d = new Date(val);
  if (!isNaN(d.getTime())) return d;
  const formatted = val.replace(" ", "T");
  const d2 = new Date(formatted);
  return isNaN(d2.getTime()) ? null : d2;
};

const formatDateToValue = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDisplay = (val: string): string => {
  const d = parseValueToDate(val);
  if (!d) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const DAYS_OF_WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTH_NAMES = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

function MiniDropdown({
  value,
  options,
  onChange,
  className = "",
  minWidth = "95px",
}: {
  value: number | string;
  options: { value: number | string; label: string }[];
  onChange: (val: number | string) => void;
  className?: string;
  minWidth?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
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

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-7 items-center justify-between gap-1.5 rounded border border-border bg-background px-2 text-xs font-semibold text-foreground shadow-sm hover:bg-accent/5 focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer transition-colors whitespace-nowrap"
      >
        <span className="whitespace-nowrap">{selectedOption ? selectedOption.label : value}</span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground/60 transition-transform duration-150 flex-shrink-0 ${
            isOpen ? "rotate-180 text-accent" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          style={{ minWidth }}
          className="absolute left-0 top-full z-[60] mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-card p-1 shadow-2xl backdrop-blur-md animate-in fade-in-50 zoom-in-95 custom-scrollbar w-max whitespace-nowrap"
        >
          {options.map((opt) => {
            const isSel = String(opt.value) === String(value);
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between gap-2.5 px-2 py-1.5 text-xs font-medium rounded cursor-pointer transition-colors whitespace-nowrap ${
                  isSel
                    ? "bg-accent/15 text-accent font-bold"
                    : "text-foreground hover:bg-muted/80"
                }`}
              >
                <span className="whitespace-nowrap">{opt.label}</span>
                {isSel && <Check className="h-3 w-3 text-accent flex-shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const DateTimePicker = ({
  value,
  onChange,
  placeholder = "Chọn ngày giờ...",
  className = "",
  align = "left",
  presetType = "start",
}: DateTimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = useMemo(() => parseValueToDate(value), [value]);

  const [viewDate, setViewDate] = useState<Date>(() => selectedDate || new Date());

  useEffect(() => {
    if (isOpen && selectedDate) {
      setViewDate(new Date(selectedDate));
    }
  }, [isOpen, selectedDate]);

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

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleYearChange = (year: number) => {
    setViewDate(new Date(year, currentMonth, 1));
  };

  const handleMonthChange = (month: number) => {
    setViewDate(new Date(currentYear, month, 1));
  };

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

    const days: {
      day: number;
      monthOffset: -1 | 0 | 1;
      date: Date;
    }[] = [];

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      days.push({
        day: dayNum,
        monthOffset: -1,
        date: new Date(currentYear, currentMonth - 1, dayNum),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        monthOffset: 0,
        date: new Date(currentYear, currentMonth, i),
      });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        monthOffset: 1,
        date: new Date(currentYear, currentMonth + 1, i),
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const handleSelectDay = (targetDate: Date) => {
    const newDate = new Date(targetDate);
    if (selectedDate) {
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
    } else {
      if (presetType === "end") {
        newDate.setHours(23, 59, 0, 0);
      } else {
        newDate.setHours(0, 0, 0, 0);
      }
    }
    onChange(formatDateToValue(newDate));
  };

  const handleHourChange = (hours: number) => {
    const baseDate = selectedDate ? new Date(selectedDate) : new Date();
    baseDate.setHours(hours);
    onChange(formatDateToValue(baseDate));
  };

  const handleMinuteChange = (minutes: number) => {
    const baseDate = selectedDate ? new Date(selectedDate) : new Date();
    baseDate.setMinutes(minutes);
    onChange(formatDateToValue(baseDate));
  };

  const setNow = () => {
    const now = new Date();
    onChange(formatDateToValue(now));
    setViewDate(now);
  };

  const setTodayStart = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    onChange(formatDateToValue(now));
    setViewDate(now);
  };

  const setTodayEnd = () => {
    const now = new Date();
    now.setHours(23, 59, 0, 0);
    onChange(formatDateToValue(now));
    setViewDate(now);
  };

  const setYesterday = () => {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    if (presetType === "end") {
      now.setHours(23, 59, 0, 0);
    } else {
      now.setHours(0, 0, 0, 0);
    }
    onChange(formatDateToValue(now));
    setViewDate(now);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const today = new Date();
  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const isSelected = (d: Date) =>
    selectedDate &&
    d.getDate() === selectedDate.getDate() &&
    d.getMonth() === selectedDate.getMonth() &&
    d.getFullYear() === selectedDate.getFullYear();

  const yearOptions = useMemo(() => {
    const currentY = new Date().getFullYear();
    const years: number[] = [];
    for (let y = currentY - 5; y <= currentY + 5; y++) {
      years.push(y);
    }
    return years.map((y) => ({ value: y, label: String(y) }));
  }, []);

  const monthOptions = useMemo(() => {
    return MONTH_NAMES.map((name, idx) => ({ value: idx, label: name }));
  }, []);

  const hourOptions = useMemo(() => {
    return Array.from({ length: 24 }).map((_, h) => ({
      value: h,
      label: String(h).padStart(2, "0"),
    }));
  }, []);

  const minuteOptions = useMemo(() => {
    return Array.from({ length: 60 }).map((_, m) => ({
      value: m,
      label: String(m).padStart(2, "0"),
    }));
  }, []);

  const currentHour = selectedDate ? selectedDate.getHours() : presetType === "end" ? 23 : 0;
  const currentMinute = selectedDate ? selectedDate.getMinutes() : presetType === "end" ? 59 : 0;

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-all hover:bg-accent/5 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer ${
          isOpen ? "ring-1 ring-ring border-accent" : ""
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <CalendarIcon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/70" />
          {value ? (
            <span className="font-medium text-foreground">{formatDisplay(value)}</span>
          ) : (
            <span className="text-muted-foreground/60">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {value && (
            <span
              onClick={handleClear}
              className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
              title="Xóa chọn"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
        </div>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } top-full z-50 mt-1.5 w-[310px] rounded-xl border border-border bg-card p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in-50 zoom-in-95`}
        >
          {/* Quick Presets Bar */}
          <div className="mb-3 flex items-center justify-between border-b border-border pb-2.5 text-xs">
            <span className="font-semibold text-muted-foreground">Chọn nhanh:</span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={presetType === "end" ? setTodayEnd : setTodayStart}
                className="h-6 px-2 text-[11px]"
              >
                Hôm nay
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={setYesterday}
                className="h-6 px-2 text-[11px]"
              >
                Hôm qua
              </Button>
              <Button
                type="button"
                variant="accent"
                size="xs"
                onClick={setNow}
                className="h-6 px-2 text-[11px]"
              >
                Bây giờ
              </Button>
            </div>
          </div>

          {/* Month/Year Header */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MiniDropdown
                value={currentMonth}
                options={monthOptions}
                onChange={(m) => handleMonthChange(Number(m))}
                minWidth="90px"
              />
              <MiniDropdown
                value={currentYear}
                options={yearOptions}
                onChange={(y) => handleYearChange(Number(y))}
                minWidth="70px"
              />
            </div>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={prevMonth}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Tháng trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Tháng sau"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 mb-1 text-center">
            {DAYS_OF_WEEK.map((day) => (
              <span
                key={day}
                className="py-1 text-[11px] font-semibold text-muted-foreground/80"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5 mb-3 text-center">
            {calendarDays.map((item, idx) => {
              const selected = isSelected(item.date);
              const current = isToday(item.date);
              const isOtherMonth = item.monthOffset !== 0;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDay(item.date)}
                  className={`relative flex h-8 w-full items-center justify-center rounded-md text-xs font-medium transition-all cursor-pointer ${
                    selected
                      ? "bg-accent text-white font-bold shadow-sm"
                      : isOtherMonth
                      ? "text-muted-foreground/30 hover:bg-muted/40"
                      : current
                      ? "bg-accent/15 text-accent font-bold ring-1 ring-accent/40 hover:bg-accent/25"
                      : "text-foreground hover:bg-muted/80"
                  }`}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Time Picker Section */}
          <div className="pt-2.5 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-accent" />
                <span>Giờ : Phút</span>
              </div>

              {/* Hour & Minute Pickers */}
              <div className="flex items-center gap-1">
                <MiniDropdown
                  value={currentHour}
                  options={hourOptions}
                  onChange={(h) => handleHourChange(Number(h))}
                  minWidth="55px"
                />
                <span className="font-bold text-muted-foreground">:</span>
                <MiniDropdown
                  value={currentMinute}
                  options={minuteOptions}
                  onChange={(m) => handleMinuteChange(Number(m))}
                  minWidth="55px"
                />
              </div>
            </div>

            {/* Time Shortcuts */}
            <div className="mt-2 flex items-center justify-between gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  handleHourChange(0);
                  handleMinuteChange(0);
                }}
                className="rounded px-1.5 py-0.5 border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                00:00
              </button>
              <button
                type="button"
                onClick={() => {
                  handleHourChange(12);
                  handleMinuteChange(0);
                }}
                className="rounded px-1.5 py-0.5 border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                12:00
              </button>
              <button
                type="button"
                onClick={() => {
                  handleHourChange(23);
                  handleMinuteChange(59);
                }}
                className="rounded px-1.5 py-0.5 border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                23:59
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={(e) => {
                handleClear(e);
                setIsOpen(false);
              }}
              className="gap-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Đặt lại
            </Button>
            <Button
              type="button"
              variant="accent"
              size="xs"
              onClick={() => setIsOpen(false)}
              className="px-3 font-semibold"
            >
              Hoàn tất
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
