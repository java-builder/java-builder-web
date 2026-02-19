"use client";

import MotionWrapper from "@/components/MotionWrapper";
import Link from "next/link";
import { FaRocket, FaCode, FaGraduationCap } from "react-icons/fa";

export default function RoadmapHero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 md:py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <MotionWrapper animation="fadeInUp" duration={0.6}>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 dark:bg-accent/20 rounded-full mb-6">
              <FaRocket className="text-accent" />
              <span className="text-sm font-medium text-accent">Lộ trình học Backend Java</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Từ Zero đến Hero
              <span className="block text-accent mt-2">Backend Developer</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Lộ trình học tập toàn diện từ Java Core đến Microservices, 
              được thiết kế dành riêng cho người mới bắt đầu và những ai muốn nâng cao kỹ năng Backend
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <FaGraduationCap className="text-accent text-xl" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">11</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Giai đoạn</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <FaCode className="text-accent text-xl" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">12-15</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tháng</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#timeline"
                className="px-8 py-4 bg-accent hover:bg-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Xem lộ trình chi tiết
              </a>
              <Link
                href="/courses"
                className="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-slate-700"
              >
                Khám phá khóa học
              </Link>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
