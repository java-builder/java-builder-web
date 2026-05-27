"use client";

import MotionWrapper from "@/components/MotionWrapper";
import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Học tập có hệ thống",
    description: "Lộ trình học tập rõ ràng từ cơ bản đến nâng cao, giúp bạn nắm vững Java từ A đến Z.",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Bài tập thực hành",
    description: "Hàng trăm bài tập từ dễ đến khó, có đáp án chi tiết và giải thích rõ ràng.",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Phỏng vấn thực tế",
    description: "Ôn tập với các câu hỏi phỏng vấn Java Developer thường gặp, cập nhật liên tục.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Cộng đồng hỗ trợ",
    description: "Tham gia cộng đồng JavaBuilder để hỏi đáp, chia sẻ kinh nghiệm và kết nối.",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI hỗ trợ học tập",
    description: "Chatbot AI thông minh sẵn sàng giải đáp mọi thắc mắc 24/7.",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Tài liệu chuyên sâu",
    description: "Bộ sưu tập tài liệu Java cập nhật, từ core Java đến Spring Framework, Microservices.",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
  },
];

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <MotionWrapper animation="fadeInUp" duration={0.8}>
          <div className="text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white/80 dark:bg-slate-800/80 px-4 py-1.5 text-sm font-semibold text-accent shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Về chúng tôi
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-5">
              JavaBuilder là gì?
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              JavaBuilder là nền tảng học tập Java trực tuyến hàng đầu Việt Nam, cung cấp lộ trình học tập bài bản, 
              bài tập thực hành đa dạng và cộng đồng hỗ trợ nhiệt tình. Chúng tôi giúp bạn từ 
              <span className="font-semibold text-accent"> người mới bắt đầu </span> 
              tiến đến 
              <span className="font-semibold text-accent"> lập trình viên chuyên nghiệp</span>.
            </p>
          </div>
        </MotionWrapper>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <MotionWrapper
              key={feature.title}
              animation="fadeInUp"
              delay={0.1 * (index + 1)}
              duration={0.6}
            >
              <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bgColor} ${feature.color} mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </MotionWrapper>
          ))}
        </div>

        {/* CTA Banner */}
        <MotionWrapper animation="fadeInUp" delay={0.8} duration={0.8}>
          <div className="mt-16 rounded-2xl p-8 text-center bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 dark:from-accent/10 dark:via-accent/5 dark:to-accent/10">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Sẵn sàng bắt đầu hành trình Java của bạn?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
              Tham gia cùng hàng nghìn học viên đã chọn JavaBuilder làm người bạn đồng hành trên con đường lập trình.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-accent text-white font-bold rounded-xl shadow-md hover:bg-accent-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Khám phá khóa học
              </Link>
              <Link
                href="/roadmap"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Xem lộ trình học
              </Link>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
