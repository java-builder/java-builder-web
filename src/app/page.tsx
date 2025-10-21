'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import MotionWrapper from "@/components/MotionWrapper";
import Header from "@/components/Header";
import CourseCard from "@/components/courses/CourseCard";
import { courseApi } from "@/services/course.service";
import { CourseDetailResponse } from "@/types/course";

export default function Home() {
  const [courses, setCourses] = useState<CourseDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchFeaturedCourses = async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await courseApi.getCourses(1, 3); // Lấy 3 khóa học đầu tiên
      if (result.code === 200 && result.result) {
        setCourses(result.result.result || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative min-h-[70vh] bg-gray-900">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full relative overflow-hidden bg-gray-900">
            <div className="absolute inset-0 opacity-10">
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
              <div className="absolute bottom-20 right-10 text-orange-400 font-mono text-xs">
                <div>if (dedication) {`{`}</div>
                <div>&nbsp;&nbsp;achieveGoals();</div>
                <div>{`}`}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16 flex items-center min-h-[70vh]">
          <div className="w-full">
            <MotionWrapper animation="fadeInUp" duration={0.8}>
              <div className="text-center space-y-6 md:space-y-8">
                {/* Course & Training badge */}
                <div className="inline-block">
                  <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Course & Training
                  </span>
                </div>

                {/* Main Heading */}
                <div className="space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    Khám phá vùng đất <span className="text-orange-400">lập trình</span>
                  </h1>

                  <div className="space-y-2 md:space-y-3 text-base md:text-lg lg:text-xl text-gray-100 max-w-4xl mx-auto px-4">
                    <p className="leading-relaxed">Hành trình chinh phục công nghệ cùng đội ngũ mentor chuyên nghiệp.</p>
                    <p className="leading-relaxed">Từ zero đến hero, cùng <span className="text-orange-400 font-semibold">Lê Khánh Đức</span> phát triển kỹ năng coding thực sự.</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-5">
                  <Link
                    href="/register"
                    className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Bắt đầu ngay
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </main>
      {/* Course Cards Section */}
      <section className="py-20 bg-white">
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
            {isLoading && (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="col-span-full text-center py-12">
                <div className="text-red-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600">{error}</p>
              </div>
            )}

            {/* Course Cards from API */}
            {!isLoading && !error && courses.map((course, index) => (
              <MotionWrapper key={course.id} animation="fadeInUp" delay={0.2 * (index + 1)} duration={0.6}>
                <CourseCard course={course} index={index} />
              </MotionWrapper>
            ))}

            {/* Empty State */}
            {!isLoading && !error && courses.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-gray-600">Chưa có khóa học nào</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-800 py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FL</span>
                </div>
                <span className="text-xl font-bold text-gray-800">F Learning</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Nền tảng học lập trình trực tuyến hàng đầu Việt Nam, giúp bạn phát triển kỹ năng coding từ cơ bản đến chuyên nghiệp.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Khóa học</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/courses" className="hover:text-orange-500 transition-colors">Frontend Development</Link></li>
                <li><Link href="/courses" className="hover:text-orange-500 transition-colors">Backend Development</Link></li>
                <li><Link href="/courses" className="hover:text-orange-500 transition-colors">Mobile Development</Link></li>
                <li><Link href="/courses" className="hover:text-orange-500 transition-colors">AI & Machine Learning</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/about" className="hover:text-orange-500 transition-colors">Giới thiệu</Link></li>
                <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Liên hệ</Link></li>
                <li><Link href="/help" className="hover:text-orange-500 transition-colors">Trợ giúp</Link></li>
                <li><Link href="/faq" className="hover:text-orange-500 transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
            <p>&copy; 2024 F Learning. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}