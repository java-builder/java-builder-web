"use client";

import Link from "next/link";
import Image from "next/image";
import MotionWrapper from "@/components/MotionWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/courses/CourseCard";
import PublicBlogCard from "@/components/blogs/PublicBlogCard";
import RoadmapSection from "@/components/roadmap/RoadmapSection";
import { useFeaturedCourses } from "@/hooks/useCourses";
import { useFeaturedBlogs } from "@/hooks/useBlogs";

export default function Home() {
  const { data: coursesData, isLoading: isLoadingCourses, error: coursesError } = useFeaturedCourses();
  const { data: blogsData, isLoading: isLoadingBlogs, error: blogsError } = useFeaturedBlogs();

  const courses = coursesData?.result || [];
  const blogs = (blogsData || []).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative min-h-[60vh] bg-gradient-to-r from-white to-blue-100">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full relative overflow-hidden bg-transparent">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-10 text-green-400 font-mono text-xs">
                <div>&lt;div className=&quot;hero&quot;&gt;</div>
                <div>&nbsp;&nbsp;&lt;h1&gt;Welcome&lt;/h1&gt;</div>
                <div>&lt;/div&gt;</div>
              </div>
              <div className="absolute top-40 right-20 text-blue-400 font-mono text-xs">
                <div>function learn() {`{`}</div>
                <div>&nbsp;&nbsp;return &quot;success&quot;;</div>
                <div>{`}`}</div>
              </div>
              <div className="absolute bottom-40 left-20 text-purple-400 font-mono text-xs">
                <div>const skills = [</div>
                <div>&nbsp;&nbsp;&quot;React&quot;, &quot;Node.js&quot;,</div>
                <div>&nbsp;&nbsp;&quot;Python&quot;, &quot;AI&quot;</div>
                <div>];</div>
              </div>
              <div className="absolute bottom-20 right-10 text-blue-400 font-mono text-xs">
                <div>if (dedication) {`{`}</div>
                <div>&nbsp;&nbsp;achieveGoals();</div>
                <div>{`}`}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12 min-h-[60vh]">
          <MotionWrapper animation="fadeInUp" duration={0.9}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Text / CTA */}
              <div className="lg:col-span-6 xl:col-span-7">
                <div className="space-y-6 md:space-y-8">
                  <div className="inline-block">
                    <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                      Course & Training
                    </span>
                  </div>

                  <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                    Khởi đầu hành trình{" "}
                    <span className="text-accent">lập trình</span>
                  </h1>

                  <div className="text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl">
                    <p className="leading-relaxed">
                      Hành trình chinh phục công nghệ cùng đội ngũ mentor chuyên
                      nghiệp.
                    </p>
                    <p className="leading-relaxed">
                      Từ zero đến hero, cùng{" "}
                      <span className="text-accent font-semibold">
                        Marino
                      </span>{" "}
                      phát triển kỹ năng coding thực sự.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
                    <Link
                      href="/courses"
                      className="inline-flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-[1.02]"
                    >
                      Khám phá khóa học
                    </Link>
                    <Link
                    href="/blogs"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Khám phá bài viết
                    </Link>
                  </div>

                  <div className="mt-6">
                    {/* Search removed from hero per design */}
                  </div>
                </div>
              </div>

              {/* Right: Illustration / image */}
              <div className="lg:col-span-6 xl:col-span-5">
                <div className="w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10">
                  <Image
                    src="/hero-background.jpg"
                    alt="Hero illustration"
                    width={1200}
                    height={800}
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-[420px] object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </main>

      {/* Roadmap Section */}
      <RoadmapSection />

      {/* Featured Blogs Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <MotionWrapper animation="fadeInUp" duration={0.8}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Bài viết nổi bật
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Khám phá những kiến thức mới nhất từ cộng đồng lập trình
              </p>
            </div>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Loading State */}
            {isLoadingBlogs && (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
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
                <p className="text-gray-600">Có lỗi xảy ra khi tải blogs</p>
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
                <p className="text-gray-600">Chưa có bài viết nào</p>
              </div>
            )}
          </div>

          {!isLoadingBlogs && !blogsError && blogs.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/blogs"
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Xem tất cả bài viết
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Course Cards Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <MotionWrapper animation="fadeInUp" duration={0.8}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Khóa học nổi bật
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Chọn lộ trình phù hợp với mục tiêu và trình độ của bạn
              </p>
            </div>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Loading State */}
            {isLoadingCourses && (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
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
                <p className="text-gray-600">Có lỗi xảy ra khi tải khóa học</p>
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
                <p className="text-gray-600">Chưa có khóa học nào</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
