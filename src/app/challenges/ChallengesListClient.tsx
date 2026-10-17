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
import { FilterSelect, FilterOption } from "@/components/ui/FilterSelect";
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

    return [
      { value: "", label: "Tất cả chủ đề" },
      ...Array.from(catSet).map((cat) => ({ value: cat, label: cat })),
    ];
  }, [challengeCategories, challengesList]);

  const levelOptions: FilterOption<string>[] = [
    { value: "", label: "Tất cả cấp độ" },
    {
      value: "INTERN",
      label: "Intern",
      badge: <span className="h-2 w-2 rounded-full bg-sky-500 mr-1.5" />,
    },
    {
      value: "FRESHER",
      label: "Fresher",
      badge: <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5" />,
    },
    {
      value: "JUNIOR",
      label: "Junior",
      badge: <span className="h-2 w-2 rounded-full bg-amber-500 mr-1.5" />,
    },
    {
      value: "MIDDLE",
      label: "Middle",
      badge: <span className="h-2 w-2 rounded-full bg-indigo-500 mr-1.5" />,
    },
    {
      value: "SENIOR",
      label: "Senior",
      badge: <span className="h-2 w-2 rounded-full bg-rose-500 mr-1.5" />,
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
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent-rgb),0.08),transparent_60%)]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-accent/20">
                <Sparkles className="h-3 w-3" />
                Thử Thách Định Hướng Theo Ngày
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
                Thử Thách Lập Trình{" "}
                <span className="bg-gradient-to-r from-accent to-accent-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-purple-400">
                  Java & Spring Boot
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
                Lộ trình định hướng theo từng ngày, giúp bạn không còn mất phương hướng khi tự học. Biết chính xác hôm nay học gì, làm gì và cần nắm vững những kiến thức nào.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#challenges-list"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600 cursor-pointer"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Khám phá thử thách</span>
                </Link>
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="hidden lg:col-span-5 lg:block">
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-900/40 shadow-sm">
                <Image
                  src="/banners/codingchallenge.png"
                  alt="Thử thách lập trình JavaBuilder"
                  width={600}
                  height={360}
                  className="h-64 w-full object-cover"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER BAR */}
      <section id="challenges-list" className="relative z-30 mx-auto max-w-7xl p-4 sm:p-6 lg:px-8 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {/* Search Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 rounded-t-2xl dark:border-slate-700 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Bộ lọc thử thách
              </span>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                {isLoadingApi ? "Đang tải..." : `${filteredChallenges.length} thử thách`}
              </span>
            </div>

            {hasFilter && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-accent transition-colors cursor-pointer"
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
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm: Spring Boot, JPA, Security, Docker, Java Core..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background/50 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-ring dark:bg-slate-900/50 dark:focus:bg-slate-900"
                />
              </div>

              {/* Category Dropdown (FilterSelect) */}
              <div className="sm:col-span-1 lg:col-span-3">
                <FilterSelect
                  value={selectedCategory}
                  onChange={(val) => setSelectedCategory(String(val))}
                  options={categoryOptions}
                  placeholder="Chủ đề: Tất cả"
                  icon={<BookOpen className="h-3.5 w-3.5 text-accent shrink-0" />}
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
                  icon={<GraduationCap className="h-3.5 w-3.5 text-accent shrink-0" />}
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
                className="h-80 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 animate-pulse p-6 space-y-4"
              >
                <div className="aspect-video bg-muted rounded-xl w-full" />
                <div className="h-5 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-10 bg-muted rounded w-full mt-4" />
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
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-3">
            <Target className="mx-auto h-12 w-12 text-muted-foreground opacity-40" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Không tìm thấy thử thách phù hợp
            </h3>
            <p className="mx-auto max-w-sm text-xs text-muted-foreground">
              {challengesList.length === 0
                ? "Hệ thống chưa có thử thách nào được kích hoạt."
                : "Không có thử thách nào khớp với bộ lọc hiện tại. Hãy thử chọn thể loại khác."}
            </p>
            {hasFilter && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-600 cursor-pointer"
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
