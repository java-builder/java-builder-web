"use client";

import MotionWrapper from "@/components/MotionWrapper";
import { FaMapSigns } from "react-icons/fa";

export default function RoadmapHero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 md:py-12 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <MotionWrapper animation="fadeInUp" duration={0.6}>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 dark:bg-accent/20 rounded-full mb-6">
              <FaMapSigns className="text-accent" />
              <span className="text-sm font-medium text-accent">Lộ trình thăng tiến Nghề nghiệp</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Bản Đồ Nghề Nghiệp
              <span className="block text-accent mt-2">Backend Developer</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Lộ trình bài bản và chi tiết cho từng giai đoạn phát triển: từ Thực tập sinh (Intern) với những bước đi đầu tiên, cho đến vị trí Chuyên gia (Senior) kiến tạo các hệ thống lớn.
            </p>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
