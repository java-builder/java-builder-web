"use client";

import MotionWrapper from "@/components/MotionWrapper";
import { FaCheckCircle } from "react-icons/fa";

const phases = [
  {
    title: "Giai đoạn 1: Nền tảng",
    duration: "3-4 tháng",
    color: "orange",
    items: ["Java Core", "SQL & Database", "JDBC", "Hibernate"]
  },
  {
    title: "Giai đoạn 2: Spring Ecosystem",
    duration: "4-5 tháng",
    color: "green",
    items: ["Spring Boot", "Spring Data JPA", "Spring Security", "RESTful API"]
  },
  {
    title: "Giai đoạn 3: Nâng cao",
    duration: "5-6 tháng",
    color: "purple",
    items: ["Microservices", "Spring Cloud", "Docker & Kubernetes", "CI/CD"]
  }
];

export default function RoadmapOverview() {
  return (
    <section className="py-16 md:py-20 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <MotionWrapper animation="fadeInUp" duration={0.6}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tổng quan lộ trình
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Lộ trình được chia thành 3 giai đoạn chính, mỗi giai đoạn xây dựng trên kiến thức của giai đoạn trước
            </p>
          </div>
        </MotionWrapper>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {phases.map((phase, index) => (
            <MotionWrapper key={index} animation="fadeInUp" delay={index * 0.1} duration={0.6}>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-slate-700">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                  phase.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                  phase.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                }`}>
                  <span className="text-2xl font-bold">{index + 1}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {phase.title}
                </h3>
                
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  phase.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                  phase.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                }`}>
                  {phase.duration}
                </div>

                <ul className="space-y-3">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FaCheckCircle className={`mt-1 flex-shrink-0 ${
                        phase.color === 'orange' ? 'text-orange-500' :
                        phase.color === 'green' ? 'text-green-500' :
                        'text-purple-500'
                      }`} />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
