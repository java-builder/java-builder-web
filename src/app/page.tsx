'use client';

// import Image from "next/image"; // Unused import
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Background Image */}
      <main className="relative min-h-[80vh]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full relative overflow-hidden">
            {/* Real background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
              style={{
                backgroundImage: 'url(/hero-background.jpg)',
                filter: 'brightness(0.4) contrast(1.1)'
              }}
            ></div>
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
            {/* Additional overlay for more dramatic effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 flex items-center min-h-[80vh]">
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
                    Khám phá vùng đất <span className="text-emerald-400">lập trình</span>
                  </h1>
                  
                  <div className="space-y-2 md:space-y-3 text-base md:text-lg lg:text-xl text-gray-100 max-w-4xl mx-auto px-4">
                    <p className="leading-relaxed">Hành trình chinh phục công nghệ cùng đội ngũ mentor chuyên nghiệp.</p>
                    <p className="leading-relaxed">Từ zero đến hero, cùng <span className="text-emerald-400 font-semibold">Lê Khánh Đức</span> phát triển kỹ năng coding thực sự.</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-6">
                  <Link
                    href="/register"
                    className="inline-flex items-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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

        {/* Search/Filter Card */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-5xl px-6">
          <MotionWrapper animation="fadeInUp" delay={0.6} duration={0.6}>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Filter Options */}
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">Chọn lĩnh vực</div>
                      <div className="text-xs text-gray-500">Frontend, Backend, AI...</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">Chọn loại khóa học</div>
                      <div className="text-xs text-gray-500">Cơ bản, Nâng cao, Dự án</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">Chọn lịch học</div>
                      <div className="text-xs text-gray-500">Linh hoạt</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">Trình độ</div>
                      <div className="text-xs text-gray-500">Tất cả level</div>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="w-full lg:w-auto">
                  <button className="group relative w-full lg:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden whitespace-nowrap">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="font-bold">Tìm khóa học</span>
                    </div>
                    
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Sparkle effects */}
                    <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full opacity-60 animate-ping"></div>
                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-white rounded-full opacity-40 animate-ping delay-500"></div>
                  </button>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </main>

      {/* Featured Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <MotionWrapper animation="fadeInUp" duration={0.6}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Khóa học nổi bật</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Khám phá các khóa học được đánh giá cao nhất từ mentor Lê Khánh Đức
              </p>
            </div>
          </MotionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Course Card 1 */}
            <MotionWrapper animation="fadeInUp" delay={0.2} duration={0.6}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <h3 className="text-lg font-semibold">Frontend Developer</h3>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">React & Next.js Mastery</h4>
                  <p className="text-gray-600 mb-4">Học cách xây dựng ứng dụng web hiện đại với React và Next.js từ cơ bản đến nâng cao.</p>
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">(124 đánh giá)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-emerald-600">899.000đ</div>
                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                      Tham gia ngay
                    </button>
                  </div>
                </div>
              </div>
            </MotionWrapper>

            {/* Course Card 2 */}
            <MotionWrapper animation="fadeInUp" delay={0.4} duration={0.6}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                    <h3 className="text-lg font-semibold">Backend Developer</h3>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">Node.js & Express Mastery</h4>
                  <p className="text-gray-600 mb-4">Xây dựng RESTful API mạnh mẽ với Node.js, Express và các công nghệ backend hiện đại.</p>
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">(98 đánh giá)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-emerald-600">1.299.000đ</div>
                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                      Tham gia ngay
                    </button>
                  </div>
                </div>
              </div>
            </MotionWrapper>

            {/* Course Card 3 */}
            <MotionWrapper animation="fadeInUp" delay={0.6} duration={0.6}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-lg font-semibold">AI & Machine Learning</h3>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">Python AI Foundation</h4>
                  <p className="text-gray-600 mb-4">Khám phá thế giới AI với Python, TensorFlow và các thuật toán machine learning cơ bản.</p>
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">(76 đánh giá)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-emerald-600">1.599.000đ</div>
                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                      Tham gia ngay
                    </button>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <MotionWrapper animation="fadeInUp" duration={0.6}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Lộ trình học tập cá nhân</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Chọn lộ trình phù hợp với mục tiêu nghề nghiệp của bạn
              </p>
            </div>
          </MotionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Learning Path 1 */}
            <MotionWrapper animation="fadeInUp" delay={0.2} duration={0.6}>
              <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col">
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Frontend Developer</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">HTML, CSS, JavaScript, React, Next.js</p>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500">Tiến độ</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>6 tháng</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>8 khóa học</span>
                  </div>
                </div>
              </div>
            </MotionWrapper>

            {/* Learning Path 2 */}
            <MotionWrapper animation="fadeInUp" delay={0.4} duration={0.6}>
              <div className="h-full bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col">
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Backend Developer</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">Node.js, Express, Database, API</p>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500">Tiến độ</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>8 tháng</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>10 khóa học</span>
                  </div>
                </div>
              </div>
            </MotionWrapper>

            {/* Learning Path 3 */}
            <MotionWrapper animation="fadeInUp" delay={0.6} duration={0.6}>
              <div className="h-full bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col">
                <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Full-stack Developer</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">Frontend + Backend + Database</p>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500">Tiến độ</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>12 tháng</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>15 khóa học</span>
                  </div>
                </div>
              </div>
            </MotionWrapper>

            {/* Learning Path 4 */}
            <MotionWrapper animation="fadeInUp" delay={0.8} duration={0.6}>
              <div className="h-full bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col">
                <div className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">AI & ML Engineer</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">Python, TensorFlow, Deep Learning</p>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500">Tiến độ</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-pink-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>10 tháng</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>12 khóa học</span>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/create-learning-path"
              className="inline-flex items-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Tạo lộ trình cá nhân
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
        <div className="max-w-7xl mx-auto px-6">
          <MotionWrapper animation="fadeInUp" duration={0.6}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Thành tựu của F Learning</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Những con số ấn tượng từ hành trình giáo dục của chúng ta
              </p>
            </div>
          </MotionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <MotionWrapper animation="scaleIn" delay={0.2} duration={0.6}>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">1,250+</div>
                <div className="text-lg text-white/90">Học viên tin tưởng</div>
              </div>
            </MotionWrapper>

            <MotionWrapper animation="scaleIn" delay={0.4} duration={0.6}>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">45+</div>
                <div className="text-lg text-white/90">Khóa học chất lượng</div>
              </div>
            </MotionWrapper>

            <MotionWrapper animation="scaleIn" delay={0.6} duration={0.6}>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">98%</div>
                <div className="text-lg text-white/90">Học viên hài lòng</div>
              </div>
            </MotionWrapper>

            <MotionWrapper animation="scaleIn" delay={0.8} duration={0.6}>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">850+</div>
                <div className="text-lg text-white/90">Dự án hoàn thành</div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <MotionWrapper animation="fadeInUp" duration={0.6}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Học viên nói gì về F Learning</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Những câu chuyện thành công từ cộng đồng học viên của chúng tôi
              </p>
            </div>
          </MotionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <MotionWrapper animation="fadeInUp" delay={0.2} duration={0.6}>
              <div className="h-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow text-sm">
                  &ldquo;Khóa học React của anh Đức rất chi tiết và dễ hiểu. Từ một người không biết gì về lập trình, giờ em đã có thể tự làm được website hoàn chỉnh!&rdquo;
                </p>
                <div className="flex items-center mt-auto">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    N
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-sm">Nguyễn Thị Mai</div>
                    <div className="text-xs text-gray-500">Frontend Developer tại ABC Tech</div>
                  </div>
                </div>
              </div>
            </MotionWrapper>

            {/* Testimonial 2 */}
            <MotionWrapper animation="fadeInUp" delay={0.4} duration={0.6}>
              <div className="h-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow text-sm">
                  &ldquo;Lộ trình Backend của F Learning giúp tôi có được công việc mơ ước. Mentor Đức luôn hỗ trợ nhiệt tình và tận tình.&rdquo;
                </p>
                <div className="flex items-center mt-auto">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    T
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-sm">Trần Minh Tuấn</div>
                    <div className="text-xs text-gray-500">Backend Developer tại XYZ Corp</div>
                  </div>
                </div>
              </div>
            </MotionWrapper>

            {/* Testimonial 3 */}
            <MotionWrapper animation="fadeInUp" delay={0.6} duration={0.6}>
              <div className="h-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow text-sm">
                  &ldquo;F Learning đã thay đổi cuộc sống tôi hoàn toàn. Từ nhân viên văn phòng, giờ tôi đã là một Full-stack Developer với mức lương x3!&rdquo;
                </p>
                <div className="flex items-center mt-auto">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    L
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-sm">Lê Văn Hải</div>
                    <div className="text-xs text-gray-500">Full-stack Developer tại Tech Startup</div>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <MotionWrapper animation="fadeInUp" duration={0.6}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Tại sao chọn F Learning?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Những lợi thế vượt trội giúp bạn thành công trong hành trình học lập trình
              </p>
            </div>
          </MotionWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MotionWrapper animation="fadeInUp" delay={0.2} duration={0.6}>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Mentor cá nhân 1:1</h3>
                <p className="text-gray-600">Được hướng dẫn trực tiếp bởi Lê Khánh Đức với hơn 5 năm kinh nghiệm trong ngành</p>
              </div>
            </MotionWrapper>

            <MotionWrapper animation="fadeInUp" delay={0.4} duration={0.6}>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Dự án thực tế</h3>
                <p className="text-gray-600">Học thông qua việc xây dựng các dự án thực tế, không chỉ lý thuyết suông</p>
              </div>
            </MotionWrapper>

            <MotionWrapper animation="fadeInUp" delay={0.6} duration={0.6}>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Linh hoạt thời gian</h3>
                <p className="text-gray-600">Học mọi lúc, mọi nơi với lộ trình cá nhân hóa phù hợp với công việc của bạn</p>
              </div>
            </MotionWrapper>

            <MotionWrapper animation="fadeInUp" delay={0.8} duration={0.6}>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Cộng đồng hỗ trợ</h3>
                <p className="text-gray-600">Tham gia cộng đồng học viên sôi động, cùng nhau tiến bộ và chia sẻ kinh nghiệm</p>
              </div>
            </MotionWrapper>

            <MotionWrapper animation="fadeInUp" delay={1.0} duration={0.6}>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Chứng chỉ uy tín</h3>
                <p className="text-gray-600">Nhận chứng chỉ hoàn thành khóa học được công nhận bởi các doanh nghiệp</p>
              </div>
            </MotionWrapper>

            <MotionWrapper animation="fadeInUp" delay={1.2} duration={0.6}>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v2a2 2 0 002 2h.01M8 6v2a2 2 0 01-2 2h-.01m0 0H4a2 2 0 01-2-2V6a2 2 0 012-2h2m2 0h8m-8 0v2a2 2 0 01-2 2h-.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Hỗ trợ nghề nghiệp</h3>
                <p className="text-gray-600">Tư vấn định hướng nghề nghiệp và hỗ trợ tìm kiếm việc làm sau khóa học</p>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <MotionWrapper animation="fadeInUp" duration={0.6}>
            <h2 className="text-4xl font-bold text-white mb-6">
              Sẵn sàng bắt đầu hành trình lập trình của bạn?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Tham gia cùng hàng nghìn học viên đã thành công với F Learning. <br />
              Nhận tư vấn miễn phí và lộ trình học tập cá nhân hóa ngay hôm nay!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 text-lg font-bold rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Bắt đầu học ngay
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/create-learning-path"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-emerald-600 transition-all duration-300"
              >
                Tạo lộ trình miễn phí
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Miễn phí tư vấn</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cam kết chất lượng</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FL</span>
                </div>
                <span className="text-xl font-bold text-gray-800">F Learning</span>
              </div>
              <p className="text-gray-600">
                Nền tảng học tập cá nhân hóa được tạo bởi <span className="font-semibold text-emerald-600">Lê Khánh Đức</span> - giúp bạn nâng cao kỹ năng và phát triển sự nghiệp trong lĩnh vực công nghệ.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-gray-800">Sản phẩm</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Khóa học</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Bài tập</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Chứng chỉ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-gray-800">Hỗ trợ</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Trung tâm trợ giúp</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Liên hệ</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Câu hỏi thường gặp</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-gray-800">Về tác giả</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Lê Khánh Đức</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Portfolio</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition-colors">Điều khoản</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2024 F Learning by Lê Khánh Đức. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
