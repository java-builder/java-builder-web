"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Trophy,
  SlidersHorizontal,
  X,
  Search,
  BookOpen,
  GraduationCap,
  Target,
} from "lucide-react";
import { FilterSelect, FilterOption } from "@/components/ui/select";
import { ChallengeCard } from "@/components/challenges";
import { useChallenges } from "@/hooks/useChallenges";
import { categoryService } from "@/services/category.service";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import { adaptChallengeResponseToUi } from "./data/challengeAdapter";
import { Challenge } from "./types";

export default function ChallengesListClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [userProgressMap, setUserProgressMap] = useState<Record<string, { completedCount: number; currentDay: number }>>({});
  const [challengeCategories, setChallengeCategories] = useState<CategoryDetailResponse[]>([]);

  const { data: apiChallengesData, isLoading: isLoadingApi } = useChallenges("ACTIVE", 1, 50);

  useEffect(() => {
    categoryService
      .getAll(CategoryType.CHALLENGE)
      .then((res) => {
        if (res.data) setChallengeCategories(res.data);
      })
      .catch(() => {});
  }, []);

  const challengesList: Challenge[] = useMemo(() => {
    const apiList = apiChallengesData?.data || [];
    return apiList.map((c) => adaptChallengeResponseToUi(c));
  }, [apiChallengesData]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const progressMap: Record<string, { completedCount: number; currentDay: number }> = {};

    challengesList.forEach((c) => {
      try {
        const saved = localStorage.getItem(`jb_challenge_${c.slug}`);
        if (saved) {
          const days = JSON.parse(saved);
          if (Array.isArray(days)) {
            const completedCount = days.filter((d: { status: string }) => d.status === "completed").length;
            const currentDay = days.find((d: { status: string }) => d.status === "in_progress")?.day || 1;
            progressMap[c.slug] = { completedCount, currentDay };
          }
        }
      } catch {
        // Ignore
      }
    });

    setUserProgressMap(progressMap);
  }, [challengesList]);

  const categoryOptions: FilterOption<string>[] = useMemo(() => {
    const catSet = new Set<string>();

    challengeCategories.forEach((c) => {
      if (c.name) catSet.add(c.name);
    });

    challengesList.forEach((c) => {
      if (c.category) catSet.add(c.category);
    });

    return Array.from(catSet).map((cat) => ({
      value: cat,
      label: cat,
    }));
  }, [challengeCategories, challengesList]);

  const levelOptions: FilterOption<string>[] = [
    {
      value: "INTERN",
      label: "Intern",
      badge: <span className="h-2 w-2 rounded-full bg-slate-400 mr-1.5" />,
    },
    {
      value: "FRESHER",
      label: "Fresher",
      badge: <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5" />,
    },
    {
      value: "JUNIOR",
      label: "Junior",
      badge: <span className="h-2 w-2 rounded-full bg-sky-500 mr-1.5" />,
    },
    {
      value: "MIDDLE",
      label: "Middle",
      badge: <span className="h-2 w-2 rounded-full bg-[#FF5A1F] mr-1.5" />,
    },
    {
      value: "SENIOR",
      label: "Senior",
      badge: <span className="h-2 w-2 rounded-full bg-[#FF9900] mr-1.5" />,
    },
  ];

  const filteredChallenges = useMemo(() => {
    return challengesList.filter((c) => {
      const matchCat = !selectedCategory || c.category === selectedCategory;
      const matchLvl = !selectedLevel || c.level === selectedLevel;
      const matchQuery =
        !searchText.trim() ||
        c.title.toLowerCase().includes(searchText.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(searchText.toLowerCase()) ||
        c.description.toLowerCase().includes(searchText.toLowerCase()) ||
        c.category.toLowerCase().includes(searchText.toLowerCase());
      return matchCat && matchLvl && matchQuery;
    });
  }, [challengesList, selectedCategory, selectedLevel, searchText]);

  const hasFilter = Boolean(searchText) || Boolean(selectedCategory) || Boolean(selectedLevel);

  const handleClearFilter = () => {
    setSelectedCategory("");
    setSelectedLevel("");
    setSearchText("");
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8] dark:bg-background transition-colors duration-300 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#E8E8E8] dark:border-border bg-white dark:bg-surface">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,31,0.08),transparent_60%)]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD8C7] dark:border-orange-900/50 bg-[#FFF0E8] dark:bg-orange-950/40 px-3 py-1 text-xs font-semibold text-[#FF5A1F]">
                <Sparkles className="h-3.5 w-3.5 text-[#FF5A1F]" />
                Thử Thách Định Hướng Theo Ngày
              </span>

              <h1 className="text-3xl font-black tracking-tight text-[#171717] dark:text-white sm:text-4xl md:text-5xl leading-tight">
                Thử Thách Lập Trình{" "}
                <span className="text-[#FF5A1F]">Java & Spring Boot</span>
              </h1>

              <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-[#64748B] dark:text-slate-300">
                Lộ trình định hướng theo từng ngày, giúp bạn không còn mất phương hướng khi tự học. Biết chính xác hôm nay học gì, làm gì và cần nắm vững những kiến thức nào.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="#challenges-list"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF5A1F] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#FF5A1F]/25 transition hover:bg-[#e04b16] active:scale-95 cursor-pointer"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Khám phá thử thách</span>
                </Link>
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="hidden lg:col-span-5 lg:block">
              <div className="relative overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-slate-900 shadow-sm">
                <Image
                  src="/banners/codingchallenge.png"
                  alt="Thử thách lập trình JavaBuilder"
                  width={600}
                  height={360}
                  className="h-64 w-full object-cover"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#FF5A1F]/10 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER BAR */}
      <section id="challenges-list" className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs">
          {/* Search Header */}
          <div className="flex items-center justify-between border-b border-[#E8E8E8] dark:border-border px-5 py-3.5 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="h-4 w-4 text-[#FF5A1F]" />
              <span className="text-sm font-bold text-[#171717] dark:text-white">
                Bộ lọc thử thách
              </span>
              <span className="rounded-full bg-[#FFF0E8] dark:bg-orange-950/40 border border-[#FFD8C7] dark:border-orange-900/50 px-2.5 py-0.5 text-xs font-semibold text-[#FF5A1F]">
                {isLoadingApi ? "Đang tải..." : `${filteredChallenges.length} thử thách`}
              </span>
            </div>

            {hasFilter && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#64748B] hover:text-[#FF5A1F] transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Đặt lại</span>
              </button>
            )}
          </div>

          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              {/* Search Input */}
              <div className="relative sm:col-span-2 lg:col-span-6">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Tìm kiếm: Spring Boot, JPA, Security, Docker, Java Core..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#E8E8E8] dark:border-border bg-slate-50 dark:bg-background py-2 pl-9 pr-3 text-xs sm:text-sm text-[#171717] dark:text-white placeholder:text-[#64748B] focus:border-[#FF5A1F] focus:bg-white dark:focus:bg-surface focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all"
                />
              </div>

              {/* Category Dropdown (FilterSelect) */}
              <div className="sm:col-span-1 lg:col-span-3">
                <FilterSelect
                  value={selectedCategory}
                  onChange={(val) => setSelectedCategory(String(val))}
                  options={categoryOptions}
                  placeholder="Chủ đề: Tất cả"
                  icon={<BookOpen className="h-3.5 w-3.5 text-[#64748B] shrink-0" />}
                  clearable={Boolean(selectedCategory)}
                  size="md"
                />
              </div>

              {/* Level Dropdown (FilterSelect) */}
              <div className="sm:col-span-1 lg:col-span-3">
                <FilterSelect
                  value={selectedLevel}
                  onChange={(val) => setSelectedLevel(String(val))}
                  options={levelOptions}
                  placeholder="Cấp độ: Tất cả"
                  icon={<GraduationCap className="h-3.5 w-3.5 text-[#64748B] shrink-0" />}
                  clearable={Boolean(selectedLevel)}
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. CHALLENGES GRID */}
        {isLoadingApi ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-6 space-y-4 animate-pulse"
              >
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
                <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                userProgress={userProgressMap[challenge.slug]}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingApi && filteredChallenges.length === 0 && (
          <div className="rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-12 text-center shadow-xs space-y-3">
            <Target className="mx-auto h-12 w-12 text-[#64748B] opacity-40" />
            <h3 className="text-base font-bold text-[#171717] dark:text-white">
              Không tìm thấy thử thách phù hợp
            </h3>
            <p className="mx-auto max-w-sm text-xs text-[#64748B] dark:text-slate-400">
              {challengesList.length === 0
                ? "Hệ thống chưa có thử thách nào được kích hoạt."
                : "Không có thử thách nào khớp với bộ lọc hiện tại. Hãy thử chọn thể loại khác."}
            </p>
            {hasFilter && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#FF5A1F] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#e04b16] cursor-pointer shadow-xs active:scale-95"
              >
                Xem tất cả thử thách
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
