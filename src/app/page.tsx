"use client";

import Image from "next/image";
import MotionWrapper from "@/components/MotionWrapper";
import CourseCard from "@/components/courses/CourseCard";
import PublicBlogCard from "@/components/blogs/PublicBlogCard";
import DocumentCard from "@/components/documents/DocumentCard";
import CICDPipelineSection from "@/components/home/CICDPipelineSection";
import AboutSection from "@/components/home/AboutSection";
import ViewAllLink from "@/components/ui/ViewAllLink";
import { useFeaturedCourses } from "@/hooks/useCourses";
import { useFeaturedBlogs } from "@/hooks/useBlogs";
import { useFeaturedDocuments } from "@/hooks/useDocuments";
import { useI18n } from "@/contexts/I18nContext";

export default function Home() {
  const { t } = useI18n();
  const { data: coursesData, isLoading: isLoadingCourses, error: coursesError } = useFeaturedCourses();
  const { data: blogsData, isLoading: isLoadingBlogs, error: blogsError } = useFeaturedBlogs();
  const { data: documentsData, isLoading: isLoadingDocuments, error: documentsError } = useFeaturedDocuments();

  const courses = coursesData?.data || [];
  const blogs = (blogsData?.data || []).slice(0, 6);
  const documents = documentsData?.data?.data || [];

  return (
    <>
      <main className="relative bg-gradient-to-r from-white to-blue-50 py-8 md:py-10 lg:py-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <MotionWrapper animation="fadeInUp" duration={0.9}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Left: Text / CTA */}
              <div className="lg:col-span-7">
                <div className="space-y-3 md:space-y-4">
                  <div className="inline-block">
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                      {t("home.heroBadge")}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    {t("home.heroTitleStart")}{" "}
                    <span className="text-accent">
                      {t("home.heroTitleEnd")}
                    </span>
                  </h1>

                  <div className="text-sm md:text-base text-gray-700 max-w-xl">
                    <p className="leading-relaxed mb-2">
                      {t("home.heroDesc1")}
                    </p>
                    <p className="leading-relaxed">
                      {t("home.heroDesc2")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Community Banners */}
              <div className="lg:col-span-5 space-y-4">
                {/* Facebook Group Card */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-slate-700/50 p-4 hover:bg-white dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-300">
                  <div className="flex items-start space-x-3 mb-3">
                    {/* Facebook Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="inline-flex items-center bg-accent/10 dark:bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs font-semibold mb-2">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                        </svg>
                        {t("home.communityBadge")}
                      </div>
                      
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                        {t("home.fbGroupTitle")}
                      </h3>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                        {t("home.fbGroupDesc")}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1 text-accent" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                          </svg>
                          <span className="font-medium">{t("home.fbMembers")}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span className="font-medium">{t("home.fbActive")}</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <a
                        href="https://www.facebook.com/groups/779508281889441"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-accent text-white text-xs font-semibold rounded-lg shadow hover:bg-accent-600 hover:shadow-md transform hover:scale-[1.02] transition-all duration-200"
                      >
                        <svg className="w-3.5 h-3.5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        {t("home.fbJoin")}
                        <svg className="w-3.5 h-3.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Discord Group Card */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-slate-700/50 p-4 hover:bg-white dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-300">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 bg-accent/10 dark:bg-accent/20 rounded-full flex items-center justify-center overflow-hidden">
                        <Image
                          src="/logos/discord.png"
                          alt="Discord"
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="inline-flex items-center bg-accent/10 dark:bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs font-semibold mb-2">
                        {t("home.discordBadge")}
                      </div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                        {t("home.discordTitle")}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                        {t("home.discordDesc")}
                      </p>
                      <a
                        href="https://discord.gg/DfTsStwT"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-accent text-white text-xs font-semibold rounded-lg shadow hover:bg-accent-600 hover:shadow-md transform hover:scale-[1.02] transition-all duration-200"
                      >
                        {t("home.discordJoin")}
                        <svg className="w-3.5 h-3.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </main>

      {/* Course Cards Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <MotionWrapper animation="fadeInUp" duration={0.8}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t("home.featuredCourses")}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t("home.featuredCoursesDesc")}
              </p>
            </div>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Loading State */}
            {isLoadingCourses && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full col-span-full">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-2xl overflow-hidden p-6 space-y-4 animate-pulse">
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

      {/* Featured Blogs Section */}
      <section className="py-12 bg-gray-50">
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
                  <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-2xl overflow-hidden p-6 space-y-4 animate-pulse">
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

      {/* CI/CD Pipeline Section */}
      <CICDPipelineSection />

      {/* Featured Documents Section */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-b from-slate-50 via-white to-blue-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl"></div>
          <div className="absolute bottom-10 -left-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <MotionWrapper animation="fadeInUp" duration={0.8}>
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white/80 dark:bg-slate-800/80 px-4 py-1.5 text-sm font-semibold text-accent shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-accent"></span>
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
                  <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-2xl p-6 space-y-4 animate-pulse">
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

      {/* About JavaBuilder Section */}
      <AboutSection />
    </>
  );
}
