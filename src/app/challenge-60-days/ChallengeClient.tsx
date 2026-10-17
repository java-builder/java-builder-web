"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Flame,
  Target,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  Compass,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { PHASES, INITIAL_DAYS_CHALLENGE } from "./data/challengeData";
import { DayChallenge } from "./types";

const STORAGE_KEY = "javabuilder_challenge_60_days_v1";

export default function ChallengeClient() {
  const [days, setDays] = useState<DayChallenge[]>(INITIAL_DAYS_CHALLENGE);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(2); // Default to current day 2
  const [activePhaseFilter, setActivePhaseFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"matrix" | "list">("matrix");

  // Load from localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 60) {
          setDays(parsed);
          // Set selected to first in_progress or current
          const current = parsed.find((d) => d.status === "in_progress") || parsed[0];
          setSelectedDayNumber(current.day);
        }
      }
    } catch {
      // Fallback to default
    }
  }, []);

  // Save to localStorage when days change
  const saveDays = (newDays: DayChallenge[]) => {
    setDays(newDays);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newDays));
      } catch {
        // Ignore quota errors
      }
    }
  };

  // Stats calculation
  const completedCount = useMemo(() => {
    return days.filter((d) => d.status === "completed").length;
  }, [days]);

  const progressPercent = useMemo(() => {
    return Math.round((completedCount / 60) * 100);
  }, [completedCount]);

  const activeDay = useMemo(() => {
    return days.find((d) => d.day === selectedDayNumber) || days[0];
  }, [days, selectedDayNumber]);

  // Filtered days list
  const filteredDays = useMemo(() => {
    return days.filter((d) => {
      const matchPhase = activePhaseFilter === "all" || d.phaseId === activePhaseFilter;
      const matchQuery =
        !searchQuery.trim() ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.keyConcepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        `ngày ${d.day}`.includes(searchQuery.toLowerCase());
      return matchPhase && matchQuery;
    });
  }, [days, activePhaseFilter, searchQuery]);

  // Toggle single task completion
  const handleToggleTask = (taskId: string) => {
    const newDays = days.map((d) => {
      if (d.day === activeDay.day) {
        const updatedTasks = d.tasks.map((t) =>
          t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
        );
        return { ...d, tasks: updatedTasks };
      }
      return d;
    });
    saveDays(newDays);
  };

  // Mark current day complete & unlock next
  const handleCompleteDay = (dayNum: number) => {
    const newDays = days.map((d) => {
      if (d.day === dayNum) {
        const allTasksDone = d.tasks.map((t) => ({ ...t, isCompleted: true }));
        return { ...d, status: "completed" as const, tasks: allTasksDone };
      }
      if (d.day === dayNum + 1 && d.status === "locked") {
        return { ...d, status: "in_progress" as const };
      }
      return d;
    });

    saveDays(newDays);
    toast.success(`🎉 Tuyệt vời! Bạn đã hoàn thành Ngày ${dayNum}!`);

    // Auto navigate to next day if available
    if (dayNum < 60) {
      setSelectedDayNumber(dayNum + 1);
    }
  };

  // Reset demo progress
  const handleResetProgress = () => {
    if (window.confirm("Bạn có chắc chắn muốn đặt lại tiến độ về trạng thái mẫu ban đầu?")) {
      saveDays(INITIAL_DAYS_CHALLENGE);
      setSelectedDayNumber(2);
      toast.success("Đã đặt lại tiến độ thử thách!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* 1. HERO HEADER - High Impact Challenge Branding */}
      <section className="relative py-10 sm:py-14 px-4 bg-gradient-to-b from-blue-50/80 via-background to-background dark:from-slate-900/90 dark:via-background dark:to-background border-b border-border overflow-hidden transition-all">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-5 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20 shadow-xs">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>THỬ THÁCH 60 NGÀY CHINH PHỤC SPRING BOOT</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.2]">
            Tấm Bản Đồ Định Hướng{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              Mỗi Ngày Cho Người Mới
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
            Không học qua các video dài dòng lan man, không lo mất phương hướng.
            Mỗi ngày một mục tiêu cụ thể, giải thích <strong>tại sao cần học</strong>, <strong>danh sách việc cần làm</strong> và <strong>cạm bẫy thực tế</strong> cần tránh.
          </p>

          {/* Stats Bar */}
          <div className="pt-4 max-w-4xl mx-auto">
            <div className="bg-card text-card-foreground border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Tiến độ hoàn thành
                </span>
                <p className="text-xl sm:text-2xl font-black text-foreground">
                  {completedCount} <span className="text-xs font-semibold text-muted-foreground">/ 60 ngày</span>
                </p>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mt-1">
                  <div
                    className="bg-accent h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Chuỗi liên tục
                </span>
                <p className="text-xl sm:text-2xl font-black text-amber-500">
                  {completedCount > 0 ? `${completedCount} Ngày` : "Bắt đầu ngay"}
                </p>
                <p className="text-[10px] text-muted-foreground">Giữ streak mỗi ngày</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-blue-500" />
                  Giai đoạn hiện tại
                </span>
                <p className="text-sm sm:text-base font-bold text-foreground truncate">
                  {activeDay.phaseName.split("&")[0]}
                </p>
                <p className="text-[10px] text-muted-foreground">Chặng {activeDay.phaseId} / 6</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                  Thời lượng gợi ý
                </span>
                <p className="text-xl sm:text-2xl font-black text-foreground">
                  ~45 <span className="text-xs font-semibold text-muted-foreground">phút/ngày</span>
                </p>
                <p className="text-[10px] text-muted-foreground">Kiên trì đều đặn</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">

        {/* Phase Filter Tabs & Search Bar */}
        <div className="space-y-4">
          {/* Phase Pill Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setActivePhaseFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                activePhaseFilter === "all"
                  ? "bg-accent text-white shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Tất cả 60 ngày
            </button>
            {PHASES.map((p) => {
              const isSelected = activePhaseFilter === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePhaseFilter(p.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-accent text-white shadow-xs"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{p.badge}:</span>
                  <span className="hidden sm:inline">{p.title}</span>
                  <span className="sm:hidden">{p.dayRange}</span>
                </button>
              );
            })}
          </div>

          {/* Search & View Mode Switcher */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm từ khóa: JPA, IoC, Bean, JWT, Docker, Ngày 5..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-card border border-border p-1 rounded-xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode("matrix")}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    viewMode === "matrix"
                      ? "bg-accent text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Dạng lưới 60 ngày"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Lưới 60 ngày</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    viewMode === "list"
                      ? "bg-accent text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Dạng danh sách"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Danh sách</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleResetProgress}
                className="p-2 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground text-xs cursor-pointer transition-colors"
                title="Đặt lại tiến độ mẫu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. SPLIT WORKSPACE: Left = 60 Days Grid/List, Right = Active Day Compass Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Days Selector (Lưới hoặc Danh sách) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold px-1">
              <span>Danh sách ngày ({filteredDays.length})</span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Xong
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-accent" /> Đang học
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40" /> Khóa
                </span>
              </span>
            </div>

            {/* Mode 1: 60-Day Matrix Grid */}
            {viewMode === "matrix" ? (
              <div className="bg-card border border-border rounded-3xl p-5 shadow-xs space-y-4">
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-2">
                  {filteredDays.map((d) => {
                    const isSelected = d.day === selectedDayNumber;
                    const isCompleted = d.status === "completed";
                    const isInProgress = d.status === "in_progress";

                    let buttonClass = "bg-muted/40 border-border/80 text-muted-foreground hover:bg-muted";
                    if (isCompleted) {
                      buttonClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold";
                    } else if (isInProgress) {
                      buttonClass = "bg-accent/15 border-accent text-accent font-extrabold ring-2 ring-accent/30 animate-pulse";
                    }

                    if (isSelected) {
                      buttonClass += " ring-2 ring-offset-2 ring-accent shadow-sm scale-105 z-10";
                    }

                    return (
                      <button
                        key={d.day}
                        type="button"
                        onClick={() => setSelectedDayNumber(d.day)}
                        className={`h-12 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer relative ${buttonClass}`}
                      >
                        <span className="text-[10px] uppercase font-semibold leading-none opacity-70">
                          N{d.day}
                        </span>
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : isInProgress ? (
                            <Zap className="w-3.5 h-3.5 text-accent fill-accent" />
                          ) : (
                            <Lock className="w-3 h-3 text-muted-foreground/60" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 text-center text-[11px] text-muted-foreground">
                  💡 Nhấp vào từng ngày để xem tấm bản đồ định hướng chi tiết ở bên cạnh.
                </div>
              </div>
            ) : (
              /* Mode 2: Timeline List View */
              <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
                {filteredDays.map((d) => {
                  const isSelected = d.day === selectedDayNumber;
                  const isCompleted = d.status === "completed";
                  const isInProgress = d.status === "in_progress";

                  return (
                    <div
                      key={d.day}
                      onClick={() => setSelectedDayNumber(d.day)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? "bg-accent/10 border-accent shadow-xs"
                          : "bg-card border-border hover:border-accent/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                            isCompleted
                              ? "bg-emerald-500 text-white"
                              : isInProgress
                              ? "bg-accent text-white"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {d.day}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1">
                              {d.title}
                            </h4>
                            <p className="text-[11px] text-muted-foreground line-clamp-1">
                              {d.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : isInProgress ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/20 text-accent">
                              Đang học
                            </span>
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: ACTIVE DAY COMPASS DETAIL (Bản đồ chi tiết của ngày) */}
          <div className="lg:col-span-7">
            <div className="bg-card text-card-foreground border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 sticky top-20">

              {/* Day Header */}
              <div className="space-y-2 border-b border-border pb-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-accent text-white shadow-xs">
                      NGÀY {activeDay.day}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
                      Tuần {activeDay.week} • {activeDay.phaseName}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    Ước tính {activeDay.estimatedMinutes} phút
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-foreground pt-1 leading-snug">
                  {activeDay.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {activeDay.tagline}
                </p>
              </div>

              {/* 1. WHY LEARN THIS? (Tại sao cần học phần này trong thực tế?) */}
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>Tại sao phần này lại quan trọng trong thực tế?</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {activeDay.whyLearn}
                </p>
              </div>

              {/* 2. CORE MISSION (Mục tiêu cốt lõi hôm nay) */}
              <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider">
                  <Target className="w-4 h-4" />
                  <span>Mục tiêu cốt lõi hôm nay cần đạt</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                  {activeDay.coreMission}
                </p>
              </div>

              {/* 3. ACTIONABLE CHECKLIST (Danh sách việc cần làm hôm nay) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Nhiệm vụ hành động hôm nay ({activeDay.tasks.filter(t => t.isCompleted).length}/{activeDay.tasks.length})</span>
                  </h3>
                  <span className="text-[11px] text-muted-foreground">Click để đánh dấu hoàn thành</span>
                </div>

                <div className="space-y-2">
                  {activeDay.tasks.map((task) => (
                    <label
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        task.isCompleted
                          ? "bg-emerald-500/10 border-emerald-500/30 text-muted-foreground"
                          : "bg-muted/40 border-border hover:border-accent/40 text-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => {}} // Controlled by label onClick
                        className="w-4 h-4 mt-0.5 rounded text-accent focus:ring-accent cursor-pointer"
                      />
                      <span className={`text-xs sm:text-sm leading-relaxed ${task.isCompleted ? "line-through opacity-80" : "font-medium"}`}>
                        {task.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. KEY CONCEPTS TO SEARCH (Từ khóa trọng tâm) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Từ khóa trọng tâm cần nắm:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeDay.keyConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-muted text-foreground border border-border"
                    >
                      #{concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* 5. MENTOR TIPS & COMMON PITFALLS (Lời khuyên & Cạm bẫy cần tránh) */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Lời khuyên & Cạm bẫy từ Mentor</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                  &ldquo;{activeDay.mentorTip}&rdquo;
                </p>
              </div>

              {/* Action Buttons: Hoàn thành & Điều hướng ngày */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={activeDay.day <= 1}
                    onClick={() => setSelectedDayNumber(Math.max(1, activeDay.day - 1))}
                    className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer text-xs flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Ngày trước</span>
                  </button>

                  <button
                    type="button"
                    disabled={activeDay.day >= 60}
                    onClick={() => setSelectedDayNumber(Math.min(60, activeDay.day + 1))}
                    className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer text-xs flex items-center gap-1"
                  >
                    <span>Ngày sau</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {activeDay.status === "completed" ? (
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã hoàn thành ngày {activeDay.day}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCompleteDay(activeDay.day)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-xs shadow-md hover:bg-accent-600 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đánh dấu hoàn thành Ngày {activeDay.day}</span>
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
