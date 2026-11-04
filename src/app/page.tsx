"use client";

import Link from "next/link";
import MotionWrapper from "@/components/common/MotionWrapper";
import CourseCard from "@/components/courses/CourseCard";
import PublicBlogCard from "@/components/blogs/PublicBlogCard";
import DocumentCard from "@/components/documents/DocumentCard";
import ViewAllLink from "@/components/ui/view-all-link";
import FeaturedCourseCarousel from "@/components/home/FeaturedCourseCarousel";
import { useFeaturedCourses } from "@/hooks/useCourses";
import { useFeaturedBlogs } from "@/hooks/useBlogs";
import { useFeaturedDocuments } from "@/hooks/useDocuments";
import { useChallenges } from "@/hooks/useChallenges";
import { ChallengeCard } from "@/components/challenges";
import { adaptChallengeResponseToUi } from "@/app/challenges/data/challengeAdapter";
import { useI18n } from "@/contexts/I18nContext";
import { useMemo } from "react";

export default function Home() {
  const { t } = useI18n();
  const { data: coursesData, isLoading: isLoadingCourses, error: coursesError } = useFeaturedCourses();
  const { data: blogsData, isLoading: isLoadingBlogs, error: blogsError } = useFeaturedBlogs();
  const { data: documentsData, isLoading: isLoadingDocuments, error: documentsError } = useFeaturedDocuments();
  const { data: challengesData, isLoading: isLoadingChallenges } = useChallenges("ACTIVE", 1, 6);

  const courses = coursesData?.data || [];
  const blogs = blogsData?.data || [];
  const documents = documentsData?.data?.data || [];

  const challenges = useMemo(() => {
    const apiList = challengesData?.data || [];
    return apiList.map((c) => adaptChallengeResponseToUi(c));
  }, [challengesData]);

  return (
    <>
      <main className="relative bg-[#FAFAFA] dark:bg-[#0B0F19] -mt-[54px] pt-[80px] pb-6 md:pb-10 overflow-hidden transition-colors">
        {/* Modern AWS Cloud Aesthetic Background: Tech Dot Grid + Ambient Orange Aura */}
        <div
          className="absolute inset-0 pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          {/* 1. AWS Primary Orange soft ambient halo behind the course card */}
          <div className="absolute top-1/2 right-[0%] -translate-y-1/2 w-[550px] h-[460px] bg-[radial-gradient(circle,_rgba(255,90,31,0.13)_0%,_rgba(255,153,0,0.05)_40%,_transparent_70%)] dark:bg-[radial-gradient(circle,_rgba(255,90,31,0.18)_0%,_rgba(255,153,0,0.08)_45%,_transparent_75%)] rounded-full blur-2xl pointer-events-none" />

          {/* 2. Sleek tech dot matrix on the right half */}
          <div
            className="absolute top-0 right-0 w-[55%] h-full opacity-40 dark:opacity-20 hidden lg:block pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#94A3B8 1.2px, transparent 1.2px)",
              backgroundSize: "22px 22px",
              maskImage:
                "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
            }}
          />

          {/* 3. Subtle angled tech accent glow across top-right */}
          <div className="absolute -top-16 -right-16 w-80 h-80 bg-gradient-to-br from-[#FF5A1F]/15 via-[#26344D]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <MotionWrapper animation="fadeInUp" duration={0.9}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pt-1">
              {/* Left: Text / CTA */}
              <div className="lg:col-span-7">
                <div className="space-y-2.5 sm:space-y-3">
                  {/* Course & Training Badge: AWS style pill */}
                  <div className="inline-block">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF0E8] dark:bg-orange-950/40 text-[#171717] dark:text-slate-100 border border-[#FFD8C7] dark:border-orange-900/50 shadow-2xs">
                      <svg className="w-2.5 h-2.5 fill-[#FF5A1F] flex-shrink-0" viewBox="0 0 24 24">
                        <polygon points="6,3 20,12 6,21" />
                      </svg>
                      <span>{t("home.heroBadge") || "Course & Training"}</span>
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[50px] font-black text-[#171717] dark:text-white leading-[1.12] tracking-tight">
                    {t("home.heroTitleStart") || "Khởi đầu hành trình"}<br />
                    <span>{t("home.heroTitleEndPrefix") || "lập trình "}</span>
                    <span className="text-[#FF5A1F] relative inline-block">
                      {t("home.heroTitleHighlight") || "Java"}
                      <svg className="absolute -bottom-2.5 left-0 w-full" viewBox="0 0 120 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 10C35 2 85 2 117 10" stroke="#FF5A1F" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-300 max-w-xl leading-relaxed">
                    {t("home.heroDesc1") || "Hành trình chinh phục Backend Java toàn diện từ con số 0 đến cấp độ kỹ sư thực chiến cùng JavaBuilder."}
                  </p>

                  {/* 3 Feature Highlights matching exact AWS mockup */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-0.5 select-none">
                    {/* Item 1: Học mọi lúc mọi nơi */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFF0E8] flex items-center justify-center flex-shrink-0 text-[#171717] font-extrabold text-sm tracking-tighter">
                        &lt;/&gt;
                      </div>
                      <div className="text-xs sm:text-[13px] font-semibold text-[#171717] dark:text-slate-200 leading-tight">
                        <p>{t("home.featureLearnAnytime") || "Học mọi lúc"}</p>
                        <p>{t("home.featureAnywhere") || "mọi nơi"}</p>
                      </div>
                    </div>

                    {/* Divider 1 */}
                    <div className="h-7 w-px bg-slate-200/90 dark:bg-slate-700/80 hidden sm:block" />

                    {/* Item 2: Thực hành thực tế */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFF0E8] flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#FF5A1F]" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="3" y="14" width="4" height="7" rx="1" />
                          <rect x="10" y="8" width="4" height="13" rx="1" />
                          <rect x="17" y="3" width="4" height="18" rx="1" />
                        </svg>
                      </div>
                      <div className="text-xs sm:text-[13px] font-semibold text-[#171717] dark:text-slate-200 leading-tight">
                        <p>{t("home.featurePractice") || "Thực hành"}</p>
                        <p>{t("home.featureReal") || "thực tế"}</p>
                      </div>
                    </div>

                    {/* Divider 2 */}
                    <div className="h-7 w-px bg-slate-200/90 dark:bg-slate-700/80 hidden sm:block" />

                    {/* Item 3: Cộng đồng hỗ trợ mạnh mẽ */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFF0E8] flex items-center justify-center flex-shrink-0 text-[#FF5A1F]">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                          <path d="M4 22h16" />
                          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                        </svg>
                      </div>
                      <div className="text-xs sm:text-[13px] font-semibold text-[#171717] dark:text-slate-200 leading-tight">
                        <p>{t("home.featureCommunity") || "Cộng đồng"}</p>
                        <p>{t("home.featureSupport") || "hỗ trợ mạnh mẽ"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick CTAs */}
                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      href="/courses"
                      className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold bg-[#FF5A1F] text-white hover:bg-[#e04b16] transition-all shadow-md shadow-[#FF5A1F]/25 active:scale-95 cursor-pointer"
                    >
                      <span>{t("home.exploreCourses") || "Khám phá khóa học"}</span>
                      <span className="text-base leading-none">→</span>
                    </Link>
                    <Link
                      href="/interview"
                      className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold bg-white dark:bg-[#181d28] border border-[#E8E8E8] dark:border-[#262d3d] text-[#171717] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-pointer shadow-2xs"
                    >
                      <svg className="w-2.5 h-2.5 fill-[#171717] dark:fill-white flex-shrink-0" viewBox="0 0 24 24">
                        <polygon points="6,3 20,12 6,21" />
                      </svg>
                      <span>{t("home.prepInterview") || "Ôn tập phỏng vấn"}</span>
                      <span className="text-base leading-none">→</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right: Featured Course Carousel with smooth ambient halo */}
              <div className="lg:col-span-5 relative max-w-[380px] sm:max-w-[390px] lg:max-w-[400px] mx-auto w-full">
                {/* Soft ambient orange glow aura behind carousel */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#FF5A1F]/15 via-[#FF9900]/10 to-transparent rounded-3xl blur-xl -z-10 pointer-events-none" />

                <div className="relative z-10">
                  <FeaturedCourseCarousel courses={coursesData?.data} isLoading={isLoadingCourses} />
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </main>


      {/* Course Cards Section */}
      <section className="py-12 bg-white dark:bg-[#0f1117] border-b border-[#E8E8E8] dark:border-[#262d3d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <MotionWrapper animation="fadeInUp" duration={0.8}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-1.5 h-6 bg-[#FF5A1F] rounded-full inline-block" />
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] dark:text-white">
                    {t("home.featuredCourses")}
                  </h2>
                </div>
                <p className="text-sm text-[#64748B] dark:text-slate-400">
                  {t("home.featuredCoursesDesc")}
                </p>
              </div>
              <ViewAllLink href="/courses" variant="ghost">
                {t("home.viewAllCourses")}
              </ViewAllLink>
            </div>
          </MotionWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Loading State */}
            {isLoadingCourses && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full col-span-full">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[6px] overflow-hidden p-6 space-y-4 ">
                    <div className="aspect-video bg-muted rounded-xl w-full" />
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-800">
                      <div className="h-5 bg-muted rounded w-16" />
                      <div className="h-5 bg-muted rounded w-20" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {coursesError && !isLoadingCourses && (
              <div className="col-span-full text-center py-12">
                <div className="text-red-600 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">{t("home.loadCoursesError")}</p>
              </div>
            )}

            {/* Course Cards from API */}
            {!isLoadingCourses &&
              !coursesError &&
              courses.map((course, index) => (
                <MotionWrapper
                  key={course.id}
                  animation="fadeInUp"
                  delay={0.2 * (index + 1)}
                  duration={0.6}
                >
                  <CourseCard course={course} index={index} />
                </MotionWrapper>
              ))}

            {/* Empty State */}
            {!isLoadingCourses && !coursesError && courses.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">{t("home.noCourses")}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Challenges Section */}
      <section className="py-14 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <MotionWrapper animation="fadeInUp" duration={0.8}>
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                {t("home.featuredChallengesBadge")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                {t("home.featuredChallenges")}
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {t("home.featuredChallengesDesc")}
              </p>
            </div>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingChallenges ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full col-span-full">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-80 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[6px]  p-6 space-y-4"
                  >
                    <div className="aspect-video bg-muted rounded-xl w-full" />
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                ))}
              </div>
            ) : challenges.length === 0 ? (
              <div className="col-span-full text-center py-12 text-sm text-muted-foreground">
                ChÆ°a cÃ³ thá»­ thÃ¡ch nÃ o Ä‘ang má»Ÿ.
              </div>
            ) : (
              challenges.map((challenge, index) => (
                <MotionWrapper
                  key={challenge.id}
                  animation="fadeInUp"
                  delay={0.15 * (index + 1)}
                  duration={0.6}
                >
                  <ChallengeCard challenge={challenge} />
                </MotionWrapper>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <ViewAllLink href="/challenges">
              {t("home.viewAllChallenges")}
            </ViewAllLink>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-14 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <MotionWrapper animation="fadeInUp" duration={0.8}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t("home.featuredBlogs")}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t("home.featuredBlogsDesc")}
              </p>
            </div>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Loading State */}
            {isLoadingBlogs && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full col-span-full">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-855 rounded-[6px] overflow-hidden p-6 space-y-4 ">
                    <div className="aspect-video bg-muted rounded-xl w-full" />
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                    <div className="flex gap-2 items-center pt-2">
                      <div className="w-8 h-8 rounded-full bg-muted" />
                      <div className="h-4 bg-muted rounded w-24" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {blogsError && !isLoadingBlogs && (
              <div className="col-span-full text-center py-12">
                <div className="text-red-650 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">{t("home.loadBlogsError")}</p>
              </div>
            )}

            {/* Blog Cards from API */}
            {!isLoadingBlogs &&
              !blogsError &&
              blogs.map((blog, index) => (
                <MotionWrapper
                  key={blog.id}
                  animation="fadeInUp"
                  delay={0.2 * (index + 1)}
                  duration={0.6}
                >
                  <PublicBlogCard blog={blog} />
                </MotionWrapper>
              ))}

            {/* Empty State */}
            {!isLoadingBlogs && !blogsError && blogs.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">{t("home.noBlogs")}</p>
              </div>
            )}
          </div>

          {!isLoadingBlogs && !blogsError && blogs.length > 0 && (
            <div className="text-center mt-12">
              <ViewAllLink href="/blogs">
                {t("home.viewAllBlogs")}
              </ViewAllLink>
            </div>
          )}
        </div>
      </section>

      {/* Featured Documents Section */}
      <section className="relative overflow-hidden py-16 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl"></div>
          <div className="absolute bottom-10 -left-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <MotionWrapper animation="fadeInUp" duration={0.8}>
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                {t("home.featuredDocsBadge")}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-955 dark:text-white mb-5">
                {t("home.featuredDocs")}
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {t("home.featuredDocsDesc")}
              </p>
            </div>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingDocuments && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full col-span-full">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[6px] p-6 space-y-4 ">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted" />
                      <div className="h-5 bg-muted rounded w-1/2" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-150 dark:border-slate-800">
                      <div className="h-4 bg-muted rounded w-16" />
                      <div className="h-4 bg-muted rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {documentsError && !isLoadingDocuments && (
              <div className="col-span-full text-center py-12">
                <div className="text-red-650 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{t("home.loadDocsError")}</p>
              </div>
            )}

            {!isLoadingDocuments && !documentsError && documents.map((doc, index) => (
              <MotionWrapper
                key={doc.id}
                animation="fadeInUp"
                delay={0.2 * (index + 1)}
                duration={0.6}
              >
                <DocumentCard document={doc} index={index} />
              </MotionWrapper>
            ))}
          </div>

          {!isLoadingDocuments && !documentsError && documents.length > 0 && (
            <div className="text-center mt-12">
              <ViewAllLink href="/documents">
                {t("home.viewAllDocs")}
              </ViewAllLink>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
