"use client";

import MotionWrapper from "@/components/MotionWrapper";
import Link from "next/link";
import { FaRocket, FaBook, FaUsers, FaArrowRight } from "react-icons/fa";

const benefits = [
  {
    icon: FaBook,
    title: "Khóa học thực tế",
    description: "Học qua dự án thực tế, không chỉ lý thuyết"
  },
  {
    icon: FaUsers,
    title: "Cộng đồng hỗ trợ",
    description: "Tham gia cộng đồng học viên năng động"
  },
  {
    icon: FaRocket,
    title: "Cập nhật liên tục",
    description: "Nội dung được cập nhật theo công nghệ mới nhất"
  }
];

export default function RoadmapCTA() {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <MotionWrapper animation="fadeInUp" duration={0.6}>
          <div className="bg-gradient-to-br from-accent via-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Sẵn sàng bắt đầu hành trình?
                </h2>
                <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                  Tham gia cùng hàng nghìn học viên đang theo đuổi ước mơ trở thành Backend Developer chuyên nghiệp
                </p>
              </div>

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                      <benefit.icon className="text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-blue-100">{benefit.description}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/courses"
                  className="group px-8 py-4 bg-white text-accent rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:gap-3"
                >
                  Khám phá khóa học
                  <FaArrowRight className="transition-all duration-300" />
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-bold hover:bg-white/20 transition-all duration-300"
                >
                  Đăng ký ngay
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 pt-8 border-t border-white/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl md:text-4xl font-bold mb-1">1000+</div>
                    <div className="text-blue-100 text-sm">Học viên</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold mb-1">50+</div>
                    <div className="text-blue-100 text-sm">Khóa học</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold mb-1">100+</div>
                    <div className="text-blue-100 text-sm">Bài viết</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold mb-1">24/7</div>
                    <div className="text-blue-100 text-sm">Hỗ trợ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionWrapper>

        {/* Additional Info */}
        <MotionWrapper animation="fadeInUp" delay={0.2} duration={0.6}>
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Lộ trình này được thiết kế dựa trên kinh nghiệm thực tế và yêu cầu của thị trường
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                #JavaDeveloper
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                #SpringBoot
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                #Microservices
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                #BackendDeveloper
              </span>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
